State = React ki memory
React ko kuch information yaad rakhni hoti hai jo time ke saath change ho sakti hai

Express      → Backend server
CORS         → Frontend ↔ Backend communication
Multer       → Video upload
FFprobe      → Video information
FFmpeg       → Video compression
Crypto       → Unique filename
FS           → Temporary files cleanup


server. js ka code phle wala

// =====================================================
// Dependencies
// kya kya technologies / packages use huye hain
// =====================================================

const express = require("express")
const multer = require("multer")
const ffmpeg = require("fluent-ffmpeg")
const ffmpegPath = require("ffmpeg-static")
const ffprobePath = require("ffprobe-static").path
const crypto = require("crypto")
const cors = require("cors")
const fs = require("fs")


// =====================================================
// Server Configuration
// Express app aur Multer upload setup
// =====================================================

const app = express()

const upload = multer({
  dest: "uploads/"
})


// =====================================================
// FFmpeg Configuration
// FFmpeg aur FFprobe ke paths configure kar rahe hain
// FFmpeg → video compress karega
// FFprobe → video ki information nikalega
// =====================================================

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)


// =====================================================
// Middleware
// Frontend aur Backend ko communicate karne ke liye CORS
// =====================================================

app.use(cors())


// =====================================================
// Home Route
// Backend server check karne ke liye
// =====================================================

app.get("/", (req, res) => {

  res.send("Video Size Optimizer backend is running")

})


// =====================================================
// Compress Video Route
// User video + target size backend ko bhejta hai
// =====================================================

app.post("/compress", upload.single("video"), (req, res) => {

  // ---------------------------------------------------
  // 1. Receive Uploaded Video
  // User ne video bheji hai ya nahi check kar rahe hain
  // ---------------------------------------------------

  if (!req.file) {

    return res.status(400).send("Please upload a video")

  }

  console.log("Uploaded File:", req.file)
  console.log("File Path:", req.file.path)
  console.log("Target Size:", req.body.targetSize)


  // ---------------------------------------------------
  // 2. Generate Unique Output File
  // Har user ke output video ka unique naam banega
  // taki files ek dusre ko overwrite na karein
  // ---------------------------------------------------

  const fileName = crypto.randomBytes(8).toString("hex")

  const outputPath = `compressed/${fileName}.mp4`

  console.log("Output Path:", outputPath)


  // ---------------------------------------------------
  // 3. Get Video Duration
  // FFprobe video ki duration nikalta hai
  // ---------------------------------------------------

  ffmpeg.ffprobe(req.file.path, (err, metadata) => {

    if (err) {

      console.log("FFprobe Error:", err)

      return res.status(500).send(
        "Unable to read video information"
      )

    }

    const duration = metadata.format.duration

    console.log("Video Duration:", duration)


    // -------------------------------------------------
    // 4. Calculate Required Bitrate
    // Target size + duration se required bitrate calculate
    // kar rahe hain
    // -------------------------------------------------

    const targetSize = Number(req.body.targetSize)

    const bitrate = (targetSize * 8 * 1000) / duration

    console.log("Required Bitrate:", bitrate, "k")


    // -------------------------------------------------
    // 5. Compress Video Using FFmpeg
    // FFmpeg calculated bitrate ke according
    // video ko compress karega
    // -------------------------------------------------

    ffmpeg(req.file.path)

      .videoBitrate(`${bitrate}k`)

      .on("end", () => {

        console.log("Compression Complete")


        // ---------------------------------------------
        // 6. Send Compressed Video to Frontend
        // User ko compressed video download ke liye bhej rahe hain
        // ---------------------------------------------

        res.download(
          outputPath,
          "compressed-video.mp4",
          (err) => {

            if (err) {

              console.log("Download Error:", err)

              return

            }


            // -----------------------------------------
            // 7. Cleanup Temporary Files
            // Download ke baad temporary files delete
            // kar rahe hain taki server storage fill na ho
            // -----------------------------------------

            fs.unlink(req.file.path, (error) => {

              if (error) {

                console.log(
                  "Upload File Cleanup Error:",
                  error
                )

              } else {

                console.log(
                  "Temporary Upload File Deleted"
                )

              }

            })


            fs.unlink(outputPath, (error) => {

              if (error) {

                console.log(
                  "Output File Cleanup Error:",
                  error
                )

              } else {

                console.log(
                  "Compressed File Deleted"
                )

              }

            })

          }

        )

      })

      .on("error", (error) => {

        console.log("FFmpeg Error:", error)

        res.status(500).send(
          "Video compression failed"
        )

      })

      .save(outputPath)

  })

})


// =====================================================
// Start Server
// Backend port 5000 par run hoga
// =====================================================

app.listen(5000, () => {

  console.log(
    "Backend server started on port 5000"
  )

})