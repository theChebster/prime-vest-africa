"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wallet, ArrowUpRight, ArrowDownLeft, LayoutDashboard, LogOut, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  // 1. Initial Load: Get user from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("pv_user");
    if (!savedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  // 2. THE SYNC LOGIC: Check for Admin Approvals/Rejects every 10 seconds
  useEffect(() => {
    if (!user?.id) return;

    const syncBalance = async () => {
      setIsSyncing(true);
      try {
        // Calls the new API we created: /api/user/balance
        const res = await fetch(`/api/user/balance?userId=${user.id}`);
        const data = await res.json();

        // If the database balance is different from our local state, update it!
        if (res.ok && data.balance !== user.balance) {
          const updatedUser = { ...user, balance: data.balance };
          
          // Update both Storage (for persistence) and State (for UI)
          localStorage.setItem("pv_user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          console.log("Balance synced with server.");
        }
      } catch (err) {
        console.error("Polling error:", err);
      } finally {
        // Small delay to prevent flickering
        setTimeout(() => setIsSyncing(false), 1000);
      }
    };

    // Start the interval
    const interval = setInterval(syncBalance, 10000); // 10 seconds

    // Cleanup: Stop checking if the user leaves the page
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("pv_user");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <nav className="p-6 flex justify-between items-center border-b border-zinc-900 bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center italic font-black text-xs">PV</div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Prime Vest</span>
        </div>
        <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-white transition">
          <LogOut size={20} />
        </button>
      </nav>

      <main className="p-6 max-w-lg mx-auto space-y-8">
        {/* Balance Card */}
        <section className="bg-zinc-900 rounded-[40px] p-10 border border-zinc-800 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/5 rounded-2xl">
                <Wallet className="text-zinc-400" size={24} />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-opacity duration-500 ${isSyncing ? 'opacity-100' : 'opacity-0'}`}>
                <RefreshCw size={10} className="animate-spin text-red-500" />
                <span className="text-red-500">Syncing</span>
              </div>
            </div>
            
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-1">Available Balance</p>
            <h2 className="text-5xl font-black italic tracking-tighter text-white">
              GHS {Number(user.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
          </div>
          
          {/* Subtle Background Decoration */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-red-600/10 blur-[80px] rounded-full"></div>
        </section>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => router.push("/dashboard/deposit")}
            className="bg-white text-black p-6 rounded-[32px] flex flex-col items-center gap-3 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-200 transition active:scale-95"
          >
            <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center text-black">
               <ArrowUpRight size={20} />
            </div>
            Deposit
          </button>
          
          <button 
            onClick={() => router.push("/dashboard/withdraw")}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] flex flex-col items-center gap-3 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition active:scale-95"
          >
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white">
               <ArrowDownLeft size={20} />
            </div>
            Withdraw
          </button>
        </div>

        {/* User Details */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-4">Account Stats</h3>
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-[32px] p-6 space-y-4">
            <div className="flex justify-between items-center">
               <span className="text-[10px] font-bold text-zinc-500 uppercase">User Status</span>
               <span className="text-[10px] font-black text-green-500 uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">Active Account</span>
            </div>
            <div className="h-[1px] bg-zinc-800/50 w-full"></div>
            <div className="flex justify-between items-center">
               <span className="text-[10px] font-bold text-zinc-500 uppercase">Total Earnings</span>
               <span className="text-sm font-black italic">GHS {user.total_earnings || "0.00"}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}