"use client";

import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#050505] animate-pulse" />,
});

export default function Home() {
  const navItems = [
    { name: "ABOUT", href: "/about" },
    { name: "WORK", href: "/work" },
    { name: "PHOTO", href: "/photography" },
    { name: "TRIBE", href: "/tribe" },
    { name: "CONNECT", href: "/contact" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8">
      {/* Header / Logo */}
      <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50">
        <Logo />
        <div className="flex gap-8">
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                whileHover={{ scale: 1.05, color: "#00f2ff" }}
                className="text-xs font-bold tracking-[0.2em] text-white/50 hover:text-white transition-colors"
              >
                {item.name}
              </motion.a>
            ))}
          </div>
          <div className="flex gap-8">
            <a href="/login" className="text-[10px] font-black tracking-widest text-white/10 hover:text-cyan-400 transition-colors">ADMIN</a>
            <a href="mailto:contact@sagheer.com" className="text-xs font-bold tracking-tighter hover:text-cyan-400 transition-colors font-outfit">EMAIL</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl items-center z-10">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="text-cyan-400 font-bold tracking-widest text-sm">PERSONAL PORTFOLIO</span>
            <h1 className="text-7xl md:text-9xl font-black text-white leading-none mt-2">
              BEYOND <br />
              <span className="text-gradient">LIMITS.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-white/40 max-w-md text-lg leading-relaxed font-medium"
          >
            Designing experiences that bridge the gap between imagination and digital reality. Specialized in UI/UX, 3D interactivity, and clean code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex gap-4 pt-4"
          >
            <a
              href="/work"
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
            >
              BROWSE WORK
            </a>
            <a
              href="/contact"
              className="px-8 py-4 glass text-white font-bold rounded-full hover:bg-white/10 transition-colors"
            >
              GET IN TOUCH
            </a>
          </motion.div>
        </div>

        {/* 3D Scene Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-[500px] w-full relative"
        >
          <div className="absolute inset-0 bg-cyan-500/10 blur-[120px] rounded-full" />
          <div className="w-full h-full relative z-10">
            <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
          </div>
        </motion.div>
      </div>

      {/* Footer / Location */}
      <div className="fixed bottom-8 left-8 flex items-center gap-4 text-white/30 text-[10px] tracking-widest uppercase font-bold">
        <span>EST 2026</span>
        <div className="w-12 h-[1px] bg-white/10" />
        <span>PUNJAB, PK</span>
      </div>

      {/* Background Orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 blur-[150px] -z-10 rounded-full" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-cyan-600/5 blur-[120px] -z-10 rounded-full" />
    </div>
  );
}
