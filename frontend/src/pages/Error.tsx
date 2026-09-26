import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
    error?: string;
}

export default function Error() {
    const navigate = useNavigate();
    const location = useLocation();
    const error = (location.state as ErrorPageProps)?.error || 'An unexpected error occurred during image processing.';

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-sm w-full mx-auto text-center">
            <div className="w-full ui-card p-6 border border-red-500/30 space-y-4">
                <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                    <AlertCircle className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                    <h1 className="text-base font-semibold text-white">Recognition Failed</h1>
                    <p className="text-xs text-zinc-400">
                        Unable to complete visual recognition request
                    </p>
                </div>

                <div className="bg-black/50 p-3 rounded border border-red-500/20 text-left">
                    <p className="text-xs font-mono text-red-300 leading-relaxed">
                        {error}
                    </p>
                </div>

                <div className="space-y-2 pt-1">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn-primary w-full text-xs h-8"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Try Again</span>
                    </button>
                    <button
                        onClick={() => navigate('/demo/input')}
                        className="btn-secondary w-full text-xs h-8"
                    >
                        <span>Start Over</span>
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-secondary w-full text-xs h-8"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Home</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
