# Video Size Optimizer

A web application that helps users reduce video file sizes using FFmpeg compression, making videos easier to store and share.

## Features

- Upload a video for compression.
- View the selected video's name and file size.
- Compress videos using FFmpeg.
- Select a target size for video compression.
- Download the compressed video.

## Tech Stack

### Frontend
- React
- Vite
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- Multer
- FFmpeg
- fluent-ffmpeg
- ffmpeg-static

## Project Structure

```text
instaProject/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) and npm before running the project.

### 1. Clone the Repository

```bash
git clone https://github.com/parvejhashmi19/Video-Size-Optimizer.git
cd Video-Size-Optimizer
```

### 2. Set Up and Run the Backend

Open a terminal in the project root and run:

```bash
cd backend
npm install
npm run dev
```

The backend will start using the development script configured in `backend/package.json`.

### 3. Set Up and Run the Frontend

Open a **second terminal** in the project root and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## How It Works

1. The user selects a video in the React frontend.
2. The frontend sends the video to the Node.js and Express backend.
3. Multer handles the uploaded video file.
4. FFmpeg processes and compresses the video.
5. The compressed video is made available for download.

## Future Improvements

- Add more video quality and compression options.
- Improve error handling and the user interface.
- Deploy the frontend and backend for public access.

## Author

**Parvej Hashami**

GitHub: [parvejhashmi19](https://github.com/parvejhashmi19)

Repository: [Video Size Optimizer](https://github.com/parvejhashmi19/Video-Size-Optimizer)
