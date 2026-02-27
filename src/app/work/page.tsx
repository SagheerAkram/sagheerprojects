"use client";

import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Work() {
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        async function fetchProjects() {
            const { data } = await supabase
                .from('projects')
                .select('*')
                .order('display_order', { ascending: true });
            if (data) setProjects(data);
        }
        fetchProjects();
    }, []);

    return (
        <div className="relative min-h-screen bg-[#050505] p-8 md:p-16">
            <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50">
                <Logo />
                <a href="/" className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> BACK TO HOME
                </a>
            </nav>

            <div className="max-w-6xl mx-auto pt-32 space-y-16">
                <div className="space-y-4">
                    <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
                        SELECTED <br />
                        <span className="text-gradient">WORK.</span>
                    </h2>
                    <p className="text-white/40 max-w-lg font-medium">A collection of projects pushing the boundaries of digital space.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden glass border-white/5"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            <img
                                src={project.image_url}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                alt={project.title}
                            />
                            <div className="absolute inset-x-8 bottom-8 z-20 space-y-1">
                                <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">{project.category}</span>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-3xl font-black text-white">{project.title}</h3>
                                    <a
                                        href={project.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all"
                                    >
                                        <ExternalLink className="w-5 h-5 text-white" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
