"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";
import { Loader2 } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
        } else {
            window.location.href = "/admin";
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
            <div className="max-w-md w-full glass p-12 rounded-[3rem] space-y-8 border-white/5">
                <div className="flex justify-center">
                    <Logo />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Admin Entry</h2>
                    <p className="text-white/40 text-sm font-medium">Restricted Access only.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-cyan-400 uppercase ml-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                            placeholder="admin@sagheer.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-cyan-400 uppercase ml-2">Security Key</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {message && <p className="text-red-400 text-xs font-bold text-center">{message}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full glass py-4 rounded-2xl text-white font-black tracking-[0.2em] uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "AUTHENTICATE"}
                    </button>
                </form>
            </div>
        </div>
    );
}
