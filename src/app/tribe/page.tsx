"use client";

import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import { ArrowLeft, Users } from "lucide-react";

export default function Tribe() {
    const tribe = [
        {
            name: "SAMEER",
            role: "The Brother",
            image: "/images/sameer_profile.png",
            desc: "Architect of Zer0bit.",
        },
        {
            name: "ADIL",
            role: "The Homie",
            image: "/images/adil_profile.png",
            desc: "Creative Soul.",
        },
        {
            name: "AAYUSH",
            role: "The Partner",
            image: "/images/aayush_profile.png",
            desc: "Digital Strategist.",
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

            <div className="max-w-6xl mx-auto pt-32 space-y-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase">
                            THE <br />
                            <span className="text-gradient">TRIBE.</span>
                        </h2>
                        <p className="text-white/40 max-w-sm font-medium">Surrounding myself with the best minds in the game.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                        <Users className="w-5 h-5 text-cyan-400" />
                        <span className="text-xs font-black tracking-widest text-white/50">CORE CIRCLE</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tribe.map((member, i) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="group relative h-[500px] rounded-[3rem] overflow-hidden glass border-white/5"
                        >
                            <img
                                src={member.image}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                alt={member.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
                            <div className="absolute inset-x-8 bottom-10 z-20 space-y-2">
                                <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase">{member.role}</span>
                                <h3 className="text-4xl font-black text-white">{member.name}</h3>
                                <p className="text-white/50 text-sm font-medium">{member.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
