import { Loader2 } from 'lucide-react';

export default function Processing() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-sm w-full mx-auto text-center">
            <div className="w-full ui-card p-6 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                </div>

                <div className="space-y-1">
                    <h2 className="text-base font-semibold text-white">
                        Analyzing Region
                    </h2>
                    <p className="text-xs text-zinc-400">
                        Querying Imagga AI tagging endpoint...
                    </p>
                </div>

                <div className="bg-black/40 rounded p-2.5 border border-white/[0.06] text-[11px] text-zinc-400 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Extracting visual features</span>
                </div>
            </div>
        </div>
    );
}
