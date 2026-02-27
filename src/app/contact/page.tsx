"use client";

import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import { ArrowLeft, Send, Github, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Contact() {
    const socials = [
        { name: "GITHUB", icon: <Github />, href: "#" },
        { name: "TWITTER", icon: <Twitter />, href: "#" },
        { name: "INSTAGRAM", icon: <Instagram />, href: "#" },
        { name: "LINKEDIN", icon: <Linkedin />, href: "#" },
    ];

    return (
        <div className="relative min-h-screen bg-[#050505] p-8 md:p-16 flex flex-col justify-center overflow-hidden">
            <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50">
                <Logo />
                <a href="/" className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> BACK TO HOME
                </a>
            </nav>

            {/* Hero */}
            <div className="max-w-4xl mx-auto w-full z-10 space-y-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                >
                    <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase leading-none">
                        SAY <br />
                        <span className="text-gradient">HELLO.</span>
                    </h2>
                    <p className="text-white/40 text-lg font-medium max-w-sm mx-auto">Available for new opportunities and creative partnerships.</p>
                </motion.div>

                {/* Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {socials.map((social, i) => (
                        <motion.a
                            key={social.name}
                            href={social.href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="glass p-6 rounded-3xl flex flex-col items-center gap-4 hover:bg-white/5 transition-colors border-white/5 group"
                        >
                            <div className="text-white/30 group-hover:text-cyan-400 transition-colors">
                                {social.icon}
                            </div>
                            <span className="text-[10px] font-black tracking-widest text-white/50">{social.name}</span>
                        </motion.a>
                    ))}
                </div>

                {/* Direct Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col items-center space-y-4 pt-12"
                >
                    <a href="mailto:hello@sagheer.com" className="text-2xl md:text-4xl font-black text-white hover:text-cyan-400 transition-colors underline decoration-cyan-500/50 underline-offset-8">
                        HELLO@SAGHEER.COM
                    </a>
                    <span className="text-[10px] font-black tracking-[0.3em] text-white/20">CLICK TO COPY EMAIL</span>
                </motion.div>
            </div>

            {/* Animated Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-[180px] -z-10 rounded-full"
            />
        </div>
    );
}
