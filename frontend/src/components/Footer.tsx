import GitHubIcon from './GitHubIcon';

export default function Footer() {
    return (
        <footer className="w-full py-4 px-4 mt-auto border-t border-white/[0.06] text-[11px] text-zinc-500">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-400">ObjectID</span>
                    <span>•</span>
                    <span>AI Visual Recognition Web Demo</span>
                </div>

                <div className="flex items-center gap-4 text-zinc-400">
                    <a
                        href="https://github.com/Hussein-dev256/ROI-Based-Image-ID-Android-App"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                    >
                        <GitHubIcon className="w-3.5 h-3.5" />
                        <span>Android App</span>
                    </a>
                    <span>•</span>
                    <a
                        href="https://github.com/Hussein-dev256"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-400 transition-colors"
                    >
                        GitHub Profile
                    </a>
                </div>

                <p>© 2025 codebyHussein</p>
            </div>
        </footer>
    );
}
