import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Copy, ArrowLeft, RefreshCw } from 'lucide-react';
import StepTracker from '../components/StepTracker';
import type { RecognitionResult } from '../types/api';

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const { results, previewUrl } = (location.state as {
        results?: RecognitionResult[];
        previewUrl?: string;
    }) || {};

    if (!results || !previewUrl) {
        navigate('/demo/input');
        return null;
    }

    const handleCopyResults = () => {
        const text = results
            .map(r => `#${r.rank} ${r.label}: ${(r.confidence * 100).toFixed(1)}%`)
            .join('\n');
        navigator.clipboard.writeText(`ObjectID AI Recognition Results:\n${text}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-4xl w-full mx-auto">
            <StepTracker currentStep={3} />

            <div className="w-full space-y-4">
                <div className="text-center space-y-1">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Recognition Results</h1>
                    <p className="text-xs sm:text-sm text-zinc-400">
                        Top visual tags predicted by Imagga Computer Vision API
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Left: Target Image Preview */}
                    <div className="md:col-span-5 ui-card p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span className="font-medium text-zinc-300">Cropped Region</span>
                            <span className="text-emerald-400 text-[11px]">Input Target</span>
                        </div>

                        <div className="relative rounded overflow-hidden bg-black/40 border border-white/[0.08] max-h-[260px] flex items-center justify-center p-2">
                            <img
                                src={previewUrl}
                                alt="Analyzed Target"
                                className="max-h-[220px] w-auto object-contain rounded"
                            />
                        </div>

                        <button
                            onClick={handleCopyResults}
                            className="btn-secondary w-full text-xs h-8"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-300 font-medium">Copied to Clipboard</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Predictions</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right: Top Predictions */}
                    <div className="md:col-span-7 space-y-2.5">
                        <div className="flex items-center justify-between px-0.5">
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Top Predictions</h2>
                            <span className="text-[11px] text-zinc-500">Confidence</span>
                        </div>

                        {results.map((result) => {
                            const isTopMatch = result.rank === 1;
                            const percentage = (result.confidence * 100).toFixed(1);

                            return (
                                <div
                                    key={result.rank}
                                    className={`ui-card p-3.5 sm:p-4 space-y-2 border ${
                                        isTopMatch ? 'border-emerald-500/40 bg-emerald-500/[0.04]' : 'border-white/[0.08]'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <span
                                                className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold ${
                                                    isTopMatch
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-white/[0.06] text-zinc-400 border border-white/[0.08]'
                                                }`}
                                            >
                                                {result.rank}
                                            </span>

                                            <span className="text-sm font-semibold capitalize text-zinc-100">
                                                {result.label}
                                            </span>

                                            {isTopMatch && (
                                                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                    Top Match
                                                </span>
                                            )}
                                        </div>

                                        <span className="text-xs font-mono font-semibold text-zinc-200">
                                            {percentage}%
                                        </span>
                                    </div>

                                    {/* Progress Meter */}
                                    <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                                        <div
                                            style={{ width: `${result.confidence * 100}%` }}
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                isTopMatch ? 'bg-emerald-500' : 'bg-zinc-400'
                                            }`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                        onClick={() => navigate('/')}
                        className="btn-secondary"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Home</span>
                    </button>

                    <button
                        onClick={() => navigate('/demo/input')}
                        className="btn-primary"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Try Another Image</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
