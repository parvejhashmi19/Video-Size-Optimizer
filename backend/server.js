
// Dependencies
// kya kya technologies / packages use huye hain


const express = require("express")
const multer = require("multer")
const ffmpeg = require("fluent-ffmpeg")
const ffmpegPath = require("ffmpeg-static")
const ffprobePath = require("ffprobe-static").path
const crypto = require("crypto")
const cors = require("cors")
const fs = require("fs")



// Server Configuration
// Express app aur Multer upload setup


const app = express()
const compressionProgress = {}
const progressCleanupTimers = {}
const MAX_UPLOAD_SIZE_BYTES = 500 * 1024 * 1024
const MAX_TARGET_SIZE_MB = 500

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: MAX_UPLOAD_SIZE_BYTES },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype || !file.mimetype.startsWith("video/")) {
      const error = new Error("Please upload a valid video file")
      error.code = "INVALID_FILE_TYPE"
      return callback(error)
    }

    callback(null, true)
  }
})

function cleanupFile(filePath, label) {
  if (!filePath) return

  fs.unlink(filePath, (error) => {
    if (error && error.code !== "ENOENT") {
      console.log(`${label} Cleanup Error:`, error)
    } else if (!error) {
      console.log(`${label} Deleted`)
    }
  })
}

function cleanupCompressionFiles(uploadPath, outputPath) {
  cleanupFile(uploadPath, "Temporary Upload File")
  const outputPaths = Array.isArray(outputPath) ? outputPath : [outputPath]
  outputPaths.forEach((path) => cleanupFile(path, "Compressed File"))
}

function scheduleProgressCleanup(jobId, delay = 10 * 60 * 1000) {
  if (progressCleanupTimers[jobId]) {
    clearTimeout(progressCleanupTimers[jobId])
  }

  const cleanupTimer = setTimeout(() => {
    delete compressionProgress[jobId]
    delete progressCleanupTimers[jobId]
  }, delay)

  progressCleanupTimers[jobId] = cleanupTimer
  if (cleanupTimer.unref) cleanupTimer.unref()
}

function removeProgressJob(jobId) {
  if (progressCleanupTimers[jobId]) {
    clearTimeout(progressCleanupTimers[jobId])
    delete progressCleanupTimers[jobId]
  }

  delete compressionProgress[jobId]
}



// FFmpeg Configuration
// FFmpeg aur FFprobe ke paths configure kar rahe hain
// FFmpeg → video compress karega
// FFprobe → video ki information nikalega


ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)



// Middleware
// Frontend aur Backend ko communicate karne ke liye CORS


app.use(cors())



// Home Route
// Backend server check karne ke liye


app.get("/", (req, res) => {

  res.send("Video Size Optimizer backend is running")

})

app.get("/progress/:jobId", (req, res) => {

  const progress = compressionProgress[req.params.jobId]

  if (progress === undefined) {

    return res.status(404).json({ error: "Compression job not found" })

  }

  res.json({ progress })

})



// Compress Video Route
// User video + target size backend ko bhejta hai

app.post("/compress", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Please upload a video")
  }

  const targetSize = Number(req.body.targetSize)
  if (!Number.isFinite(targetSize) || targetSize <= 0 || targetSize > MAX_TARGET_SIZE_MB) {
    cleanupFile(req.file.path, "Temporary Upload File")
    return res.status(400).send(`Target size must be greater than 0 and no more than ${MAX_TARGET_SIZE_MB} MB`)
  }

  const jobId = req.body.jobId
  if (!jobId) {
    cleanupFile(req.file.path, "Temporary Upload File")
    return res.status(400).send("Please provide a compression job ID")
  }

  const targetBytes = targetSize * 1024 * 1024
  const safetyTargetBytes = targetBytes * 0.95
  const containerHeadroom = Math.max(16 * 1024, targetBytes * 0.02)
  const fileName = crypto.randomBytes(8).toString("hex")
  const attemptPaths = []
  const MAX_ATTEMPTS = 3

  compressionProgress[jobId] = 0
  scheduleProgressCleanup(jobId, 30 * 60 * 1000)

  ffmpeg.ffprobe(req.file.path, (probeError, metadata) => {
    if (probeError) {
      console.log("FFprobe Error:", probeError)
      cleanupCompressionFiles(req.file.path, attemptPaths)
      removeProgressJob(jobId)
      return res.status(422).send("Unable to read this video. Please upload a valid video file.")
    }

    const duration = Number(metadata?.format?.duration)
    const sourceStreams = metadata?.streams || []
    const sourceHasVideo = sourceStreams.some((stream) => stream.codec_type === "video")
    const sourceHasAudio = sourceStreams.some((stream) => stream.codec_type === "audio")

    if (!Number.isFinite(duration) || duration <= 0 || !sourceHasVideo) {
      cleanupCompressionFiles(req.file.path, attemptPaths)
      removeProgressJob(jobId)
      return res.status(422).send("Unable to encode this video. Please choose a valid video with a readable duration.")
    }

    const minimumAudioBitrateKbps = sourceHasAudio ? 32 : 0
    const minimumVideoBitrateKbps = 32
    const minimumOutputBytes = containerHeadroom +
      ((minimumAudioBitrateKbps + minimumVideoBitrateKbps) * 1000 * duration / 8)
    const availableBytes = safetyTargetBytes - containerHeadroom
    const targetAvailableBytes = targetBytes - containerHeadroom
    const minimumTotalBitrateKbps = minimumAudioBitrateKbps + minimumVideoBitrateKbps
    const targetTotalBitrateKbps = targetAvailableBytes * 8 / duration / 1000
    const initialTotalBitrateKbps = Math.max(minimumTotalBitrateKbps, availableBytes * 8 / duration / 1000)

    function finishWithError(statusCode, message) {
      cleanupCompressionFiles(req.file.path, attemptPaths)
      removeProgressJob(jobId)
      if (!res.headersSent && !res.destroyed) res.status(statusCode).send(message)
    }

    if (targetTotalBitrateKbps < minimumTotalBitrateKbps) {
      console.log(
        `[Compression] rejected reason=below-minimum-feasible-size sourceBytes=${req.file.size} ` +
        `targetBytes=${targetBytes} minimumOutputBytes=${Math.ceil(minimumOutputBytes)} durationSeconds=${duration}`
      )
      return finishWithError(
        422,
        `The requested target is too small. This video needs at least approximately ${(minimumOutputBytes / (1024 * 1024)).toFixed(2)} MB for minimum audio, video, and container overhead.`
      )
    }

    function ratesForTotal(totalBitrateKbps) {
      const audioBitrateKbps = sourceHasAudio
        ? Math.floor(Math.min(128, Math.max(minimumAudioBitrateKbps, totalBitrateKbps * 0.2)))
        : 0
      const videoBitrateKbps = Math.floor(totalBitrateKbps - audioBitrateKbps)
      return { audioBitrateKbps, videoBitrateKbps }
    }

    let { audioBitrateKbps, videoBitrateKbps } = ratesForTotal(initialTotalBitrateKbps)
    console.log(
      `[Compression] sourceBytes=${req.file.size} targetBytes=${targetBytes} durationSeconds=${duration.toFixed(3)} ` +
      `attempt=1 audioBitrateKbps=${audioBitrateKbps} videoBitrateKbps=${videoBitrateKbps} ` +
      `estimatedOutputBytes=${Math.ceil(containerHeadroom + (audioBitrateKbps + videoBitrateKbps) * 1000 * duration / 8)} ` +
      `safetyTargetBytes=${Math.floor(safetyTargetBytes)} minimumOutputBytes=${Math.ceil(minimumOutputBytes)}`
    )

    function sendOutput(outputPath, outputBytes) {
      console.log(`[Compression] action=download outputBytes=${outputBytes} targetBytes=${targetBytes}`)
      compressionProgress[jobId] = 100
      scheduleProgressCleanup(jobId)
      res.download(outputPath, "compressed-video.mp4", (downloadError) => {
        if (downloadError) {
          console.log("Download Error:", downloadError)
          removeProgressJob(jobId)
        }
        cleanupCompressionFiles(req.file.path, attemptPaths)
        if (downloadError && !res.headersSent && !res.destroyed) {
          res.status(500).send("Unable to download compressed video")
        }
      })
    }

    function encodeAttempt(attemptIndex) {
      const outputPath = `compressed/${fileName}-attempt-${attemptIndex + 1}.mp4`
      attemptPaths.push(outputPath)
      let ffmpegCompleted = false
      const command = ffmpeg(req.file.path)
        .videoCodec("libx264")
        .videoBitrate(`${videoBitrateKbps}k`)
        .format("mp4")
        .outputOptions("-movflags +faststart")

      if (sourceHasAudio) {
        command.audioCodec("aac").audioBitrate(`${audioBitrateKbps}k`)
      } else {
        command.noAudio()
      }

      command
        .on("progress", (progress) => {
          const attemptPercent = Math.max(0, Math.min(100, Number(progress.percent) || 0))
          compressionProgress[jobId] = Math.min(99, Math.floor(((attemptIndex + attemptPercent / 100) / MAX_ATTEMPTS) * 100))
          scheduleProgressCleanup(jobId, 30 * 60 * 1000)
          console.log(`Compression attempt ${attemptIndex + 1}: ${attemptPercent}%`)
        })
        .on("end", () => {
          ffmpegCompleted = true
          fs.stat(outputPath, (statError, outputStats) => {
            if (statError || !outputStats.size) {
              console.log(`[Compression] attempt=${attemptIndex + 1} ffmpegCompleted=${ffmpegCompleted} outputStatError=${statError?.message || "none"}`)
              return finishWithError(500, "Video compression did not produce a valid output file.")
            }

            const actualBytes = outputStats.size
            console.log(
              `[Compression] attempt=${attemptIndex + 1} ffmpegCompleted=${ffmpegCompleted} ` +
              `audioBitrateKbps=${audioBitrateKbps} videoBitrateKbps=${videoBitrateKbps} ` +
              `estimatedOutputBytes=${Math.ceil(containerHeadroom + (audioBitrateKbps + videoBitrateKbps) * 1000 * duration / 8)} ` +
              `actualOutputBytes=${actualBytes} targetBytes=${targetBytes}`
            )

            ffmpeg.ffprobe(outputPath, (outputProbeError, outputMetadata) => {
              if (outputProbeError) {
                console.log("Compressed Video FFprobe Error:", outputProbeError)
                return finishWithError(422, "The compressed video could not be validated. Please try another video.")
              }

              const outputStreams = outputMetadata?.streams || []
              const outputHasVideo = outputStreams.some((stream) => stream.codec_type === "video")
              const outputHasAudio = outputStreams.some((stream) => stream.codec_type === "audio")
              const outputDuration = Number(outputMetadata?.format?.duration)
              if (!outputHasVideo || (sourceHasAudio && !outputHasAudio) || !Number.isFinite(outputDuration) || outputDuration <= 0) {
                return finishWithError(422, "The compressed output is invalid or did not retain the required audio and video streams.")
              }

              if (actualBytes <= Math.floor(safetyTargetBytes) || attemptIndex + 1 >= MAX_ATTEMPTS) {
                if (actualBytes <= targetBytes) return sendOutput(outputPath, actualBytes)
                return finishWithError(
                  422,
                  `The requested target could not be met after ${MAX_ATTEMPTS} encodes. The last output was ${(actualBytes / (1024 * 1024)).toFixed(2)} MB; the estimated minimum is approximately ${(minimumOutputBytes / (1024 * 1024)).toFixed(2)} MB. Please choose a larger target.`
                )
              }

              const observedRatio = safetyTargetBytes / actualBytes
              const currentTotalBitrateKbps = audioBitrateKbps + videoBitrateKbps
              const nextTotalBitrateKbps = currentTotalBitrateKbps * observedRatio
              const nextRates = ratesForTotal(nextTotalBitrateKbps)
              if (nextRates.videoBitrateKbps < minimumVideoBitrateKbps ||
                  nextRates.audioBitrateKbps < minimumAudioBitrateKbps) {
                return finishWithError(
                  422,
                  `The requested target is too small. This video needs at least approximately ${(minimumOutputBytes / (1024 * 1024)).toFixed(2)} MB for minimum audio, video, and container overhead.`
                )
              }

              console.log(
                `[Compression] attempt=${attemptIndex + 1} action=retry observedRatio=${observedRatio.toFixed(4)} ` +
                `nextAudioBitrateKbps=${nextRates.audioBitrateKbps} nextVideoBitrateKbps=${nextRates.videoBitrateKbps}`
              )
              audioBitrateKbps = nextRates.audioBitrateKbps
              videoBitrateKbps = nextRates.videoBitrateKbps
              encodeAttempt(attemptIndex + 1)
            })
          })
        })
        .on("error", (error,stdout, stderr) => {
          console.log(`[Compression] attempt=${attemptIndex + 1} FFmpeg error:`, error.message)
          console.log("[Compression] FFmpeg stderr:", stderr || "No stderr output")
          finishWithError(500, "Video compression failed. Please try another video or target size.")
        })
        .save(outputPath)
    }

    encodeAttempt(0)
  })
})
app.use((error, req, res, next) => {
  if (req.path !== "/compress") return next(error)
  if (res.headersSent || res.destroyed) return

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).send("Video must be 500 MB or smaller")
  }

  if (error.code === "INVALID_FILE_TYPE") {
    return res.status(415).send(error.message)
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).send(error.message)
  }

  console.log("Upload Error:", error)
  return res.status(500).send("Unable to process the uploaded video")
})



// Start Server
// Backend port 5000 par run hoga

app.listen(5000, () => {

  console.log(
    "Backend server started on port 5000"
  )

})
