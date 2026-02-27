"use client";

import { motion } from "framer-motion";

export default function Logo() {
    const letters = "SAGHEER".split("");

    return (
        <div className="flex items-center space-x-1 cursor-none pointer-events-none select-none">
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: [0.6, 0.01, -0.05, 0.95],
                    }}
                    whileHover={{
                        y: -5,
                        color: "#00f2ff",
                        transition: { duration: 0.2 },
                    }}
                    className="text-2xl font-black tracking-tighter text-white font-outfit"
                >
                    {letter}
                </motion.span>
            ))}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="w-2 h-2 rounded-full bg-cyan-400 ml-1"
            />
        </div>
    );
}
