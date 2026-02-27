"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";
import { Plus, Trash2, LogOut, Loader2, Camera, Briefcase, Users as UsersIcon } from "lucide-react";

export default function Admin() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);
    const [photos, setPhotos] = useState<any[]>([]);
    const [tribe, setTribe] = useState<any[]>([]);
    const [showModal, setShowModal] = useState<string | null>(null);
    const [newItem, setNewItem] = useState<any>({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = "/login";
            } else {
                setUser(user);
                fetchData();
            }
            setLoading(false);
        }
        checkUser();
    }, []);

    async function fetchData() {
        const { data: p } = await supabase.from('projects').select('*').order('display_order');
        const { data: ph } = await supabase.from('photography').select('*').order('display_order');
        const { data: t } = await supabase.from('tribe').select('*').order('display_order');
        if (p) setProjects(p);
        if (ph) setPhotos(ph);
        if (t) setTribe(t);
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    const deleteItem = async (table: string, id: string) => {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (!error) fetchData();
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, folder: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('portfolio')
            .upload(`${folder}/${fileName}`, file);

        if (!error) {
            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(`${folder}/${fileName}`);
            setNewItem({ ...newItem, image_url: publicUrl });
        }
        setUploading(false);
    };

    const handleSave = async (table: string) => {
        const { error } = await supabase.from(table).insert([newItem]);
        if (!error) {
            setShowModal(null);
            setNewItem({});
            fetchData();
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 md:p-16">
            <nav className="flex justify-between items-center mb-16">
                <Logo />
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors text-xs font-black tracking-widest uppercase"
                >
                    <LogOut className="w-4 h-4" /> LOGOUT
                </button>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Projects Section */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-cyan-400" />
                            <h2 className="text-xl font-black italic uppercase">Projects</h2>
                        </div>
                        <button onClick={() => setShowModal('Projects')} className="p-2 glass rounded-lg hover:bg-white/10"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-4">
                        {projects.map(p => (
                            <div key={p.id} className="glass p-4 rounded-2xl flex justify-between items-center border-white/5">
                                <div>
                                    <p className="text-sm font-bold text-white">{p.title}</p>
                                    <p className="text-[10px] text-white/40 font-black tracking-widest uppercase">{p.category}</p>
                                </div>
                                <button onClick={() => deleteItem('projects', p.id)} className="text-white/20 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Photography Section */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <Camera className="w-5 h-5 text-purple-400" />
                            <h2 className="text-xl font-black italic uppercase">Photography</h2>
                        </div>
                        <button onClick={() => setShowModal('Photography')} className="p-2 glass rounded-lg hover:bg-white/10"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-4">
                        {photos.map(p => (
                            <div key={p.id} className="glass p-4 rounded-2xl flex justify-between items-center border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                                        <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-sm font-bold text-white">{p.caption}</p>
                                </div>
                                <button onClick={() => deleteItem('photography', p.id)} className="text-white/20 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tribe Section */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <UsersIcon className="w-5 h-5 text-pink-400" />
                            <h2 className="text-xl font-black italic uppercase">Tribe</h2>
                        </div>
                        <button onClick={() => setShowModal('Tribe')} className="p-2 glass rounded-lg hover:bg-white/10"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-4">
                        {tribe.map(t => (
                            <div key={t.id} className="glass p-4 rounded-2xl flex justify-between items-center border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                        <img src={t.image_url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-sm font-bold text-white">{t.name}</p>
                                </div>
                                <button onClick={() => deleteItem('tribe', t.id)} className="text-white/20 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <p className="mt-16 text-center text-[10px] font-black tracking-[0.5em] text-white/20 uppercase italic">
                Sagheer Portfolio OS v2.0 // Secured by Supabase
            </p>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-xl" onClick={() => setShowModal(null)} />
                    <div className="relative glass p-12 rounded-[3.5rem] w-full max-w-xl border-white/10 space-y-8 animate-in fade-in zoom-in duration-300">
                        <h2 className="text-4xl font-black italic uppercase">Add to {showModal}</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-cyan-400 uppercase ml-2">Display Title</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white"
                                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value, name: e.target.value, caption: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-purple-400 uppercase ml-2">Image Asset</label>
                                <div className="relative group overflow-hidden rounded-2xl border border-white/10 aspect-video bg-white/5 flex items-center justify-center">
                                    {newItem.image_url ? (
                                        <img src={newItem.image_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center space-y-2">
                                            {uploading ? <Loader2 className="w-8 h-8 animate-spin mx-auto text-white/20" /> : <Plus className="w-8 h-8 mx-auto text-white/20" />}
                                            <p className="text-[10px] font-black text-white/20 uppercase">Click to Upload</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => handleUpload(e, showModal!.toLowerCase())}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-pink-400 uppercase ml-2">Category / Role</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white"
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value, role: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={() => handleSave(showModal!.toLowerCase())}
                                className="w-full py-5 glass rounded-2xl font-black tracking-widest uppercase hover:bg-white/10 transition-all border-cyan-500/50 text-cyan-400"
                            >
                                Publish Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
