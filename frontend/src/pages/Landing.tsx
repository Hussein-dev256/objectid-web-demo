import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl w-full text-center space-y-8"
            >
                {/* Hero Section */}
                <div className="space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-100 to-emerald-400 bg-clip-text text-transparent"
                    >
                        AI-Powered Object Recognition
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        Web demo of the ObjectID Android application
                    </motion.p>
                </div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <Link
                        to="/demo/input"
                        className="inline-block btn-primary text-lg px-10 py-4 shadow-2xl"
                    >
                        Try Live Demo
                    </Link>
                </motion.div>

                {/* Glass Card with Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="glass p-8 mt-12 max-w-2xl mx-auto"
                >
                    <p className="text-gray-300 leading-relaxed">
                        Upload an image, annotate the object you want to identify, and let our AI-powered recognition system
                        provide you with top predictions and confidence scores in real-time.
                    </p>
                </motion.div>

                {/* Footer Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="pt-8 space-x-6 text-sm text-gray-400"
                >
                    <a
                        href="https://github.com/Hussein-dev256/ROI-Based-Image-ID-Android-App"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-400 transition-colors"
                    >
                        Android App Repository
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
                </motion.div>
            </motion.div>
        </div>
    );
}
