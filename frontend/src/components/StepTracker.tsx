import { Check } from 'lucide-react';

interface StepTrackerProps {
    currentStep: 1 | 2 | 3;
}

const steps = [
    { id: 1, title: 'Upload', desc: 'Select image' },
    { id: 2, title: 'Annotate', desc: 'Frame ROI' },
    { id: 3, title: 'Results', desc: 'Visual tags' },
];

export default function StepTracker({ currentStep }: StepTrackerProps) {
    return (
        <div className="w-full max-w-lg mx-auto mb-6">
            <div className="ui-card px-3 py-2 flex items-center justify-between">
                {steps.map((step, idx) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} className="flex items-center flex-1 last:flex-none">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                                        isActive
                                            ? 'bg-emerald-600 text-white'
                                            : isCompleted
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-white/[0.05] text-zinc-500 border border-white/[0.08]'
                                    }`}
                                >
                                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.id}
                                </div>

                                <div className="flex flex-col">
                                    <span className={`text-xs font-medium ${isActive ? 'text-zinc-100' : isCompleted ? 'text-zinc-300' : 'text-zinc-500'}`}>
                                        {step.title}
                                    </span>
                                </div>
                            </div>

                            {idx < steps.length - 1 && (
                                <div className="flex-1 mx-2.5 h-[1px] bg-white/[0.08]">
                                    <div
                                        className={`h-full bg-emerald-500/60 transition-all duration-300 ${
                                            isCompleted ? 'w-full' : 'w-0'
                                        }`}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
