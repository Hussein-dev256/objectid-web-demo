import { motion } from 'framer-motion';

export default function Processing() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-8"
            >
                {/* Animated Spinner */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 border-4 border-glass border-t-emerald-500 rounded-full mx-auto"
                />

                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold">Analyzing Image...</h2>
                    <p className="text-gray-400">
                        Our AI is identifying objects in your image
                    </p>
                </div>

                <div className="glass p-6 max-w-md mx-auto">
                    <p className="text-sm text-gray-300">
                        This usually takes just a few seconds
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
