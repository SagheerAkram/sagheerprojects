"use client";

import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import { ArrowLeft, Cpu, Box, Scissors } from "lucide-react";

export default function About() {
    const traits = [
        {
            title: "CODING",
            icon: <Cpu className="w-6 h-6 text-cyan-400" />,
            desc: "Building digital worlds through code. Focused on Next.js, 3D, and automation.",
        },
        {
            title: "RUBIK'S CUBE",
            icon: <Box className="w-6 h-6 text-purple-400" />,
            desc: "Master of algorithms. Able to decipher complex patterns in under 30 seconds.",
        },
        {
            title: "AMBIDEXTROUS",
            icon: <Scissors className="w-6 h-6 text-pink-400" />,
            desc: "Unique ability to perform tasks with both hands with equal precision.",
        },
    ];

    return (
        <div className="relative min-h-screen bg-[#050505] p-8 md:p-16">
            <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50">
                <Logo />
                <a href="/" className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> BACK TO HOME
                </a>
            </nav>

            <div className="max-w-4xl mx-auto pt-32 space-y-24">
                {/* Intro */}
                <section className="space-y-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black text-white"
                    >
                        WHO IS <br />
                        <span className="text-gradient">SAGHEER?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-white/60 leading-relaxed font-medium max-w-2xl"
                    >
                        I am a creative developer who believes that technology should be as beautiful as it is functional. I don't just build websites; I craft experiences.
                    </motion.p>
                </section>

                {/* Traits Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {traits.map((trait, i) => (
                        <motion.div
                            key={trait.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.2 }}
                            whileHover={{ y: -10 }}
                            className="glass p-8 rounded-3xl space-y-4 hover:border-white/20 transition-all cursor-crosshair"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                {trait.icon}
                            </div>
                            <h3 className="text-2xl font-black text-white tracking-tight">{trait.title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">{trait.desc}</p>
                        </motion.div>
                    ))}
                </section>

                {/* Closing */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="p-12 glass rounded-[3rem] text-center space-y-4 border-cyan-500/20"
                >
                    <h3 className="text-3xl font-bold text-white">Let's create something legendary.</h3>
                    <p className="text-white/50">I'm always open to new challenges and creative collaborations.</p>
                </motion.div>
            </div>

            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-cyan-600/5 blur-[150px] -z-10 rounded-full" />
        </div>
    );
}
