// Compression page UI and behavior: file validation, target size, API request, progress, results, and download.
import { useEffect, useRef, useState } from "react"
const MAX_UPLOAD_SIZE_MB = 500
const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024

function CompressionPage(){
  
// Video information
  const[videoName,setvideoName] = useState("")
  const[videoSize , setvideoSize] = useState(0)

// Compression information
  const[targetSize, settargetSize] = useState(0)
  const [videoFile, setVideoFile] = useState(null)

  // Download information
  const [downloadUrl, setDownloadUrl] = useState("")
  const [downloadFilename, setDownloadFilename] = useState("")
  const [compressedSize, setCompressedSize] = useState(null)

  // Compression status
   const [isCompressing, setIsCompressing] = useState(false)

   const [errorMessage, setErrorMessage] = useState("")

   const [progressPercentage, setProgressPercentage] = useState(0)
   const compressionInProgress = useRef(false)

   useEffect(() => {
     return () => {
       if (downloadUrl) URL.revokeObjectURL(downloadUrl)
     }
   }, [downloadUrl])

  async function compressVideo(){
   if (compressionInProgress.current) return

   if(!videoFile){
    setErrorMessage("Please select a video before compressing.")
    return
   }

   if (!videoFile.type || !videoFile.type.startsWith("video/")) {
    setErrorMessage("Please choose a valid video file.")
    return
   }

   if (videoFile.size > MAX_UPLOAD_SIZE_BYTES) {
    setErrorMessage(`Please choose a video that is ${MAX_UPLOAD_SIZE_MB} MB or smaller.`)
    return
   }

   const parsedTargetSize = Number(targetSize)
   if (!String(targetSize).trim() || !Number.isFinite(parsedTargetSize) || parsedTargetSize <= 0) {
    setErrorMessage("Enter a valid target size greater than 0 MB.")
    return
   }

   if (parsedTargetSize > MAX_UPLOAD_SIZE_MB) {
    setErrorMessage(`Target size must be ${MAX_UPLOAD_SIZE_MB} MB or less.`)
    return
   }

   compressionInProgress.current = true
   let progressController
   let progressPoll
  
try{
    const jobId = crypto.randomUUID()
    progressController = new AbortController()

// Start compression status ab user ne video bhej di aur compress button dba diya isliye ab compression true kr diye
    setErrorMessage("")
    setIsCompressing(true)
    setProgressPercentage(0)
    setCompressedSize(null)
    setDownloadUrl("")

    let progressPollInProgress = false
    progressPoll = setInterval(async () => {
      if (progressPollInProgress) return

      progressPollInProgress = true
      try {
        const progressResponse = await fetch(
          `https://video-size-optimizer.onrender.com/progress/${encodeURIComponent(jobId)}`,
          { signal: progressController.signal }
        )

        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          setProgressPercentage(progressData.progress)

          if (progressData.progress >= 100) {
            clearInterval(progressPoll)
          }
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          // Ignore transient progress API errors; the compression request remains authoritative.
        }
      } finally {
        progressPollInProgress = false
      }
    }, 500)

// Prepare video and target size
    const formdata = new FormData()
    formdata.append("video", videoFile)
    formdata.append("targetSize", parsedTargetSize)
    formdata.append("jobId", jobId)

// Send video to backend
    const response = await fetch("https://video-size-optimizer.onrender.com/compress",{
      method:"POST",
      body: formdata
    })

    if (!response.ok) {
       const backendMessage = await response.text()
       throw new Error(backendMessage || "Video compression failed. Please try again.")
   }

// Receive compressed video
    const data = await response.blob()
    console.log(data)
    setCompressedSize(data.size / (1024 * 1024))

// Create temporary URL for downloaded video
    const videoUrl = URL.createObjectURL(data)
    setDownloadUrl(videoUrl)
    setDownloadFilename(`compressed-video-${crypto.randomUUID().replaceAll("-", "").slice(0, 10)}.mp4`)

// Compression finished
   setIsCompressing(false)
  }

 catch(error){
  console.log(error)
  setErrorMessage( error.message === "Failed to fetch"
    ? "Unable to connect to the server. Please try again."
    : error.message || "Something went wrong")


  // stop loading state even if error occurs
  setIsCompressing(false)
} finally {
  if (progressPoll) clearInterval(progressPoll)
  if (progressController) progressController.abort()
  compressionInProgress.current = false
}
}



  return (
    <main className="min-h-screen bg-slate-50 pt-[105px] text-slate-900">
      {isCompressing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/65 px-5 backdrop-blur-sm">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          <p className="mt-5 text-lg font-semibold text-white">Compressing your video... {progressPercentage}%</p>
          <p className="mt-2 text-sm text-white/80">Please wait while your video is processed.</p>
        </div>
      )}

      <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 px-5 py-7 text-center text-white sm:px-8 sm:py-9">
        <div className="mx-auto max-w-4xl">
          <p className="text-2xl font-bold tracking-tight sm:text-3xl">Video Compression Tool</p>
          <p className="mt-2 text-sm leading-6 text-slate-200 sm:text-base">Upload a video, choose a target size, and download the compressed result.</p>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-12">
        <div id="compressor" className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60 sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Video Size Optimizer</h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">Compress your video to the size you need.</p>
          </div>

          <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center transition hover:border-blue-500 hover:bg-blue-50 sm:py-9">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" className="block" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" /><path d="m9 10 3-2 3 2v4l-3 2-3-2v-4Z" /></svg>
            </span>
            <span className="mt-3 block font-semibold text-slate-800">Choose your video</span>
            <span className="mt-1 block text-sm text-slate-500">MP4, MOV, AVI and other video formats</span>
            <input
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0]
                if (!selectedFile) return

                setErrorMessage("")
                setCompressedSize(null)
                setDownloadUrl("")
                if (!selectedFile.type || !selectedFile.type.startsWith("video/")) {
                  setErrorMessage("That file does not appear to be a supported video. Please choose a video file.")
                  setVideoFile(null)
                  setvideoName("")
                  setvideoSize(0)
                  event.target.value = ""
                  return
                }

                if (selectedFile.size > MAX_UPLOAD_SIZE_BYTES) {
                  setErrorMessage(`Video must be ${MAX_UPLOAD_SIZE_MB} MB or smaller.`)
                  setVideoFile(null)
                  setvideoName("")
                  setvideoSize(0)
                  event.target.value = ""
                  return
                }

                setvideoName(selectedFile.name)
                setvideoSize(selectedFile.size / (1024 * 1024))
                setVideoFile(selectedFile)
              }}
            />
          </label>

          {videoFile && (
            <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="min-w-0"><p className="text-xs font-medium text-slate-500">Selected video</p><p className="mt-1 truncate font-semibold text-slate-800">{videoName}</p></div>
              <p className="shrink-0 text-sm text-slate-500">{videoSize.toFixed(2)} MB</p>
            </div>
          )}

          <div className="mt-6">
            <label htmlFor="target-size" className="mb-2 block text-sm font-semibold text-slate-700">Target Size (MB)</label>
            <input id="target-size" type="number" min="1" max={MAX_UPLOAD_SIZE_MB} placeholder="Example: 10" value={targetSize || ""} onChange={(event) => { settargetSize(event.target.value); setErrorMessage("") }} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            {targetSize > 0 && <p className="mt-2 text-sm text-slate-500">Target size: {targetSize} MB</p>}
          </div>

          <button onClick={compressVideo} disabled={isCompressing} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
            {isCompressing ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Compressing...</> : "Compress Video"}
          </button>

          {isCompressing && <div className="mt-4" aria-live="polite"><div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progressPercentage}%` }} /></div><p className="mt-2 text-right text-xs font-medium text-slate-500">{progressPercentage}%</p></div>}
          {errorMessage && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{errorMessage}</p>}

          {compressedSize !== null && (
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
              <h2 className="font-semibold text-slate-900">Compression Results</h2>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p className="flex justify-between gap-4"><span>Original size</span><span className="font-semibold text-slate-900">{videoSize.toFixed(2)} MB</span></p>
                <p className="flex justify-between gap-4"><span>Compressed size</span><span className="font-semibold text-slate-900">{compressedSize.toFixed(2)} MB</span></p>
                {compressedSize < videoSize ? <><p className="flex justify-between gap-4"><span>Space saved</span><span className="font-semibold text-green-700">{(videoSize - compressedSize).toFixed(2)} MB</span></p><p className="flex justify-between gap-4"><span>Percentage saved</span><span className="font-semibold text-green-700">{(((videoSize - compressedSize) / videoSize) * 100).toFixed(1)}%</span></p></> : compressedSize > videoSize ? <p className="flex justify-between gap-4"><span>Size increase</span><span className="font-semibold text-amber-700">{(compressedSize - videoSize).toFixed(2)} MB ({(((compressedSize - videoSize) / videoSize) * 100).toFixed(1)}%)</span></p> : <p className="flex justify-between gap-4"><span>Space saved</span><span className="font-semibold text-slate-900">0.00 MB (0.0%)</span></p>}
              </div>
            </div>
          )}

          {downloadUrl && <a href={downloadUrl} download={downloadFilename} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"><span aria-hidden="true">↓</span>Download Video</a>}
        </div>
      </section>
    </main>
  )
}

export default CompressionPage
