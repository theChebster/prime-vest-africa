"use client";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { Briefcase, ShieldCheck, Wallet, AlertCircle, ChevronRight, Loader2 } from "lucide-react";

const JOB_BOARD = [
  { id: "J1", price: 150, daily: 5.75, videos: 10 },
  { id: "J2", price: 300, daily: 11.50, videos: 10 },
  { id: "J3", price: 600, daily: 23.00, videos: 20 },
  { id: "J4", price: 1000, daily: 38.33, videos: 20 },
  { id: "J5", price: 1500, daily: 57.50, videos: 25 },
  { id: "J6", price: 2000, daily: 76.66, videos: 30 },
  { id: "J7", price: 3000, daily: 115.00, videos: 40 },
];

export default function UpgradePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch Fresh User Data on Load
  const fetchUserData = async () => {
    try {
      const savedUser = localStorage.getItem("pv_user");
      if (!savedUser) return;
      const localUser = JSON.parse(savedUser);

      const res = await fetch(`/api/user?id=${localUser.id}`);
      const data = await res.json();
      
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("pv_user", JSON.stringify(data.user));
      } else {
        setUser(localUser); // Fallback to local if API fails
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpgrade = async (job: any) => {
    setError("");
    if (!user) return;
    
    const balance = parseFloat(user.balance);
    if (balance < job.price) {
      setError(`Insufficient Balance. GHS ${job.price} required.`);
      return;
    }

    const confirmAction = confirm(`Apply for Job ${job.id.replace('J','')}? GHS ${job.price} will be deducted from your balance.`);
    if (!confirmAction) return;

    setLoading(true);
    try {
      const res = await fetch("/api/upgrade", {
        method: "POST",
        body: JSON.stringify({ userId: user.id, newLevel: job.id }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      if (res.ok) {
        alert("Promotion Successful! Your new role is active.");
        // Refetch fresh data to ensure database and UI match perfectly
        await fetchUserData();
        window.location.href = "/dashboard/profile";
      } else {
        setError(data.message || "Upgrade failed.");
      }
    } catch (err) {
      setError("System connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-500" size={32} />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-yellow-500 italic uppercase tracking-tighter">Job Selection</h1>
        <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Status: {user.j_class || 'Intern'}
            </p>
        </div>
      </header>

      {/* Wallet Display */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] mb-8 flex justify-between items-center shadow-2xl shadow-yellow-500/5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
            <Wallet className="text-yellow-500" size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available Balance</span>
        </div>
        <p className="text-2xl font-black italic">GHS {parseFloat(user.balance).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
      </div>

      {error && (
        <div className="mb-6 p-5 bg-red-500/10 border border-red-500/20 rounded-[24px] text-red-500 text-[10px] font-black uppercase flex gap-3 items-center animate-bounce">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="grid gap-5">
        {JOB_BOARD.map((job) => {
          const isActive = user.j_class === job.id;
          return (
            <div key={job.id} className={`p-6 rounded-[35px] border transition-all duration-500 ${isActive ? 'border-yellow-500 bg-yellow-500/5 shadow-lg shadow-yellow-500/10' : 'border-zinc-800 bg-zinc-900/30'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${isActive ? 'bg-yellow-500 text-black' : 'bg-black border border-zinc-800 text-zinc-600'}`}>
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Job {job.id.replace('J','')}</h3>
                    <div className="flex gap-2 mt-1">
                        <span className="text-[9px] bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-400 font-bold">{job.videos} VIDEOS</span>
                        <span className="text-[9px] bg-yellow-500/10 px-2 py-0.5 rounded-md text-yellow-500 font-bold">DAILY: GHS {job.daily}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-500 uppercase font-black">Contract Fee</p>
                  <p className="text-xl font-black text-white italic">GHS {job.price}</p>
                </div>
              </div>

              <button 
                onClick={() => handleUpgrade(job)}
                disabled={loading || isActive}
                className={`w-full py-5 rounded-[20px] font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                  isActive 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-xl shadow-yellow-500/20'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : isActive ? <><ShieldCheck size={16}/> Current Active Role</> : <>Acquire Contract <ChevronRight size={16}/></>}
              </button>
            </div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}