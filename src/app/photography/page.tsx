"use client";

import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import { ArrowLeft, Camera } from "lucide-react";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Photography() {
    const [photos, setPhotos] = useState<any[]>([]);

    useEffect(() => {
        async function fetchPhotos() {
            const { data } = await supabase
                .from('photography')
                .select('*')
                .order('display_order', { ascending: true });
            if (data) setPhotos(data);
        }
        fetchPhotos();
    }, []);

    return (
        <div className="relative min-h-screen bg-[#050505] p-8 md:p-16 overflow-hidden">
            <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50">
                <Logo />
                <a href="/" className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> BACK TO HOME
                </a>
            </nav>

            <div className="max-w-7xl mx-auto pt-32 space-y-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <h2 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter">
                        THE <br />
                        <span className="text-gradient uppercase">LENS.</span>
                    </h2>
                    <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                        <Camera className="w-5 h-5 text-cyan-400" />
                        <span className="text-xs font-black tracking-widest text-white/50 font-outfit">ANALOG & DIGITAL</span>
                    </div>
                </div>

                {/* Masonry-style Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px]">
                    {photos.map((photo, i) => (
                        <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`group relative rounded-[2rem] overflow-hidden glass border-white/5 ${photo.category === 'Wide' ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`}
                        >
                            <img
                                src={photo.image_url}
                                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                                alt={photo.caption}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white font-black tracking-widest uppercase text-xs">{photo.caption}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/5 blur-[180px] -z-10 rounded-full" />
        </div>
    );
}
