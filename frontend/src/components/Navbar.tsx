import { Link, useLocation } from 'react-router-dom';
import { Scan, ArrowRight, Activity } from 'lucide-react';
import GitHubIcon from './GitHubIcon';

export default function Navbar() {
    const location = useLocation();
    const isLanding = location.pathname === '/';

    return (
        <header className="w-full sticky top-0 z-50 px-4 py-2.5">
            <div className="max-w-5xl mx-auto ui-card px-3.5 sm:px-4 py-2 flex items-center justify-between">
                {/* Brand / Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/50 transition-colors">
                        <Scan className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                            ObjectID
                        </span>
                        <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                            Web Demo
                        </span>
                    </div>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <a
                        href="https://github.com/Hussein-dev256/ROI-Based-Image-ID-Android-App"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-md hover:bg-white/[0.05]"
                    >
                        <GitHubIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Android App</span>
                    </a>

                    {isLanding ? (
                        <Link
                            to="/demo/input"
                            className="btn-primary text-xs h-8 px-3"
                        >
                            <span>Live Demo</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    ) : (
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                            <Activity className="w-3 h-3 animate-pulse" />
                            <span>Imagga Engine Ready</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
