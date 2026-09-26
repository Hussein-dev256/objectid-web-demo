import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Crop, Cpu, Smartphone, ArrowRight } from 'lucide-react';
import Ferrofluid from '../components/Ferrofluid';
import GitHubIcon from '../components/GitHubIcon';

export default function Landing() {
    return (
        <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
            {/* Interactive Ferrofluid Background (Unchanged) */}
            <div className="absolute inset-0 z-0">
                <Ferrofluid
                    colors={['#10B981', '#34D399', '#059669', '#6EE7B7']}
                    speed={0.4}
                    scale={1.4}
                    turbulence={0.9}
                    fluidity={0.15}
                    rimWidth={0.25}
                    sharpness={2.8}
                    shimmer={1.2}
                    glow={2.2}
                    flowDirection="down"
                    opacity={0.85}
                    mouseInteraction={true}
                    mouseStrength={1.2}
                    mouseRadius={0.35}
                />
            </div>

            {/* Subtle Contrast Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-onyx-950/60 via-onyx-950/30 to-onyx-950/80 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl w-full mx-auto my-auto flex flex-col items-center text-center space-y-6 py-4">
                
                {/* Subtle Header Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-medium text-zinc-300">
                        ROI Computer Vision Demo
                    </span>
                </motion.div>

                {/* Hero Title & Subtitle */}
                <div className="space-y-3 max-w-2xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
                    >
                        AI Object Recognition
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-sm sm:text-base text-zinc-300 leading-normal max-w-lg mx-auto"
                    >
                        Browser demonstration of the ObjectID Android application. Crop any Region of Interest (ROI) to extract predictions in real-time.
                    </motion.p>
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex flex-wrap items-center justify-center gap-3 pt-1"
                >
                    <Link
                        to="/demo/input"
                        className="btn-primary"
                    >
                        <span>Try Live Demo</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    <a
                        href="https://github.com/Hussein-dev256/ROI-Based-Image-ID-Android-App"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                    >
                        <GitHubIcon className="w-4 h-4" />
                        <span>View Repository</span>
                    </a>
                </motion.div>

                {/* Compact 3-Column Feature Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl text-left pt-3"
                >
                    <div className="ui-card-interactive p-4 space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-emerald-400">
                            <Crop className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs sm:text-sm font-semibold text-zinc-100">Precision ROI Crop</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Interactive canvas with touch and mouse handles to frame specific target objects.
                        </p>
                    </div>

                    <div className="ui-card-interactive p-4 space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-emerald-400">
                            <Cpu className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs sm:text-sm font-semibold text-zinc-100">Imagga Vision API</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Multi-tag visual categorization returning prediction labels and confidence metrics.
                        </p>
                    </div>

                    <div className="ui-card-interactive p-4 space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-emerald-400">
                            <Smartphone className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs sm:text-sm font-semibold text-zinc-100">Android Companion</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Mirrors the mobile application camera pipeline and client-side processing workflow.
                        </p>
                    </div>
                </motion.div>

                {/* Metadata Row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-zinc-500 pt-1"
                >
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
                        Imagga API v2
                    </span>
                    <span>•</span>
                    <span>Client-Side Canvas Processing</span>
                    <span>•</span>
                    <span>No Persistent Server Storage</span>
                </motion.div>
            </div>
        </div>
    );
}
