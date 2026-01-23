# ObjectID Web Demo

AI-powered object recognition web application - a browser-based demonstration of the [ObjectID Android application](https://github.com/Hussein-dev256/ROI-Based-Image-ID-Android-App).

## Overview

This web demo allows users to experience the full ObjectID workflow directly in their browser:

1. **Upload** or capture an image
2. **Annotate** the region of interest with a draggable/resizable bounding box
3. **Recognize** objects using the Imagga API
4. **View** top 3 predictions with confidence scores

## Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** for fast development and builds
- **Tailwind CSS** with custom glassmorphism theme
- **React Konva** for interactive ROI annotation
- **Framer Motion** for smooth animations
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **Multer** for file uploads
- **Axios** for Imagga API integration
- **CORS** enabled for frontend communication

## Project Structure

```
web-demo/
├── frontend/          # React application
│   ├── src/
│   │   ├── pages/     # Main application pages
│   │   ├── components # Reusable UI components
│   │   ├── services/  # API client
│   │   ├── utils/     # Helper functions
│   │   └── types/     # TypeScript definitions
│   └── ...
│
└── backend/           # Express API server
    ├── src/
    │   ├── routes/    # API routes
    │   └── services/  # Imagga integration
    └── ...
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Imagga API credentials ([Get them here](https://imagga.com/profile/dashboard))

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd web-demo
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd ../backend
   npm install
   ```

4. **Configure environment variables:**

   **Backend** (`backend/.env`):
   ```env
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   IMAGGA_API_KEY=your_api_key_here
   IMAGGA_API_SECRET=your_api_secret_here
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

### Running Locally

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:3000`

2. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```
   App will open at `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## Features

### ✨ Glassmorphism UI
- Modern dark theme with charcoal black background
- Frosted glass panel effects with backdrop blur
- Smooth animations and transitions
- Poppins font for clean typography

### 🎯 Interactive ROI Annotation
- Drag to reposition the bounding box
- Resize using corner handles
- Visual feedback with semi-transparent overlay
- Validation to ensure minimum ROI size

### 🤖 AI-Powered Recognition
- Secure backend proxy to Imagga API
- Returns top 3 predictions
- Confidence scores with visual bars
- Comprehensive error handling

### 📱 Fully Responsive
- Works on desktop, tablet, and mobile
- Touch-friendly interactions
- Adaptive layouts

## API Endpoints

### `POST /api/recognize`

Accepts an image and returns object recognition results.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` field with image file

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "rank": 1,
      "label": "object_name",
      "confidence": 0.89
    },
    ...
  ]
}
```

## Design Decisions

- **Backend Proxy**: API credentials are kept server-side for security
- **Client-side Cropping**: ROI cropping happens in the browser for better UX
- **No Direct Imagga Calls**: Frontend never exposes API credentials
- **Glassmorphism Theme**: Modern, professional aesthetic suitable for portfolios

## Related Repositories

- [ObjectID Android App](https://github.com/Hussein-dev256/ROI-Based-Image-ID-Android-App)
- [GitHub Profile](https://github.com/Hussein-dev256)

## Author

**Mafabi Hussein**  
Adaptable Software Engineer passionate about delivering digital solutions

## License

This project is part of a portfolio demonstration and uses the Imagga API for image recognition.
