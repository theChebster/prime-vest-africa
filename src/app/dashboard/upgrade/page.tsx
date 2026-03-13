"use client";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { Briefcase, ShieldCheck, Wallet, AlertCircle, ChevronRight } from "lucide-react";

// This is your official Job Structure. 
// No more Samsung/Apple. No more "Investments".
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
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("pv_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleUpgrade = async (job: any) => {
    setError("");
    if (!user) return;
    
    const balance = parseFloat(user.balance);
    if (balance < job.price) {
      setError(`Insufficient Balance. GHS ${job.price} required for Job ${job.id.replace('J','')}.`);
      return;
    }

    const confirmAction = confirm(`Apply for Job ${job.id}? GHS ${job.price} will be deducted.`);
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
        alert("Promotion Successful!");
        const updatedUser = { ...user, j_class: job.id, balance: (balance - job.price).toFixed(2) };
        localStorage.setItem("pv_user", JSON.stringify(updatedUser));
        window.location.href = "/dashboard/profile";
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("System error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-yellow-500 italic uppercase">Job Selection</h1>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Employee Status: {user.j_class || 'Intern'}</p>
      </header>

      {/* Real-time Balance Display */}
      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Wallet className="text-yellow-500" size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Wallet</span>
        </div>
        <p className="text-xl font-black">GHS {parseFloat(user.balance).toFixed(2)}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-xs font-bold uppercase flex gap-2 items-center">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="space-y-4">
        {JOB_BOARD.map((job) => {
          const isActive = user.j_class === job.id;
          return (
            <div key={job.id} className={`p-6 rounded-[32px] border transition-all ${isActive ? 'border-yellow-500 bg-yellow-500/5' : 'border-zinc-800 bg-zinc-900/40'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <Briefcase size={22} className={isActive ? "text-yellow-500" : "text-gray-600"} />
                  <div>
                    <h3 className="text-xl font-black uppercase italic">Job {job.id.replace('J','')}</h3>
                    <p className="text-[9px] text-gray-500 uppercase font-bold">{job.videos} Daily Tasks</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-500 uppercase font-black">Deposit</p>
                  <p className="text-lg font-black text-yellow-500 font-mono">GHS {job.price}</p>
                </div>
              </div>

              <button 
                onClick={() => handleUpgrade(job)}
                disabled={loading || isActive}
                className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                  isActive ? 'bg-green-600/20 text-green-500 border border-green-600/30' : 'bg-white text-black hover:bg-yellow-500'
                }`}
              >
                {isActive ? <><ShieldCheck size={14}/> Current Role</> : <>Apply for Role <ChevronRight size={14}/></>}
              </button>
            </div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}