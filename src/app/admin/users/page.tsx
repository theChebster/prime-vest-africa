"use client";
import { useState, useEffect } from "react";
import { Search, User, Phone, ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Filter logic for search bar
  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 text-zinc-500 hover:text-white mb-4 text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <h1 className="text-5xl font-black uppercase italic text-white tracking-tighter flex items-center gap-3">
              Members <ShieldCheck className="text-red-600" size={32} />
            </h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2">Database Overview</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
              type="text"
              placeholder="Search name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-5 pl-12 pr-4 outline-none focus:border-red-600 transition-all text-sm font-medium"
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <RefreshCw className="animate-spin text-red-600" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Syncing User Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((u: any) => (
              <div key={u.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] hover:border-red-600/50 transition-all duration-500 group relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                      <User size={28} />
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Balance</span>
                      <p className="text-2xl font-black italic text-white leading-none mt-1">GHS {u.balance}</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-black uppercase tracking-tight mb-2 group-hover:text-red-500 transition-colors">
                    {u.name}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-zinc-400 mb-8 p-3 bg-black/40 rounded-xl border border-zinc-800/50">
                    <Phone size={14} className="text-red-600" />
                    <span className="text-xs font-mono font-bold tracking-tighter">{u.phone}</span>
                  </div>

                  <button 
                    onClick={() => router.push(`/admin/users/${u.id}`)}
                    className="w-full py-4 bg-zinc-800 text-zinc-300 hover:bg-white hover:text-black transition-all rounded-2xl font-black uppercase text-[10px] tracking-[0.2em]"
                  >
                    View Details
                  </button>
                </div>
                
                {/* Glow Decoration */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-600/5 blur-[50px] rounded-full group-hover:bg-red-600/10 transition-all"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Result State */}
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-24 border border-dashed border-zinc-800 rounded-[40px]">
            <p className="text-zinc-600 font-black uppercase text-xs tracking-widest">No matching users found</p>
          </div>
        )}
      </div>
    </div>
  );
}