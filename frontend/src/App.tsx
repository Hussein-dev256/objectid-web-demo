import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import ImageInput from './pages/ImageInput';
import Annotate from './pages/Annotate';
import Processing from './pages/Processing';
import Results from './pages/Results';
import Error from './pages/Error';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-charcoal-900">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/demo/input" element={<ImageInput />} />
          <Route path="/demo/annotate" element={<Annotate />} />
          <Route path="/demo/processing" element={<Processing />} />
          <Route path="/demo/results" element={<Results />} />
          <Route path="/demo/error" element={<Error />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
