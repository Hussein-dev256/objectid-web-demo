# ObjectID Web Demo

AI-powered object recognition web application - a browser-based demonstration of the [ObjectID Android application](https://github.com/Hussein-dev256/ROI-Based-Image-ID-Android-App).

## Live Demo

- **Frontend**: [https://objectid-demo.vercel.app](https://objectid-demo.vercel.app)
- **Backend API**: [https://objectid-api.vercel.app](https://objectid-api.vercel.app)

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS (Glassmorphism theme)
- Framer Motion

### Backend
- Vercel Serverless Functions
- Imagga API integration

## Local Development

### Prerequisites
- Node.js 18+
- npm

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Environment Variables

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:3000
```

**Backend** (`backend/.env`):
```env
PORT=3000
IMAGGA_API_KEY=your_api_key
IMAGGA_API_SECRET=your_api_secret
```

## Deployment to Vercel

### Deploy Frontend

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the frontend folder
3. Set environment variable:
   - `VITE_API_BASE_URL` = Your deployed backend URL

### Deploy Backend

1. Import the backend folder as a separate Vercel project
2. Set environment variables:
   - `IMAGGA_API_KEY` = Your Imagga API key
   - `IMAGGA_API_SECRET` = Your Imagga API secret

## Features

- 🎯 Interactive ROI annotation with drag and resize
- 🤖 AI-powered object recognition via Imagga API
- ✨ Glassmorphism UI with charcoal black theme
- 📱 Fully responsive design
- 🔍 Zoom controls for annotation

## Author

**Mafabi Hussein**  
© 2025 codebyHussein
