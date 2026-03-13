"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal';
  amount: string;
  status: string;
  created_at: string;
}

interface UserData {
  id: number;
  name: string;
  balance: string;
  phone_number: string;
  j_class: string;      // Added for Task Tracking
  completedToday: number; // Added for Progress Bar
}

// Mapping for Max Videos based on your Income Structure
const TASK_LIMITS: Record<string, number> = {
  "Intern": 5, "J1": 10, "J2": 10, "J3": 20, "J4": 20, "J5": 25, "J6": 30, "J7": 40
};

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("pv_user");
    if (!savedUser) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(savedUser);

      // Fetch fresh user data (ensure your /api/user returns j_class and completedToday)
      fetch(`/api/user?userId=${parsedUser.id}`)
        .then((res) => res.json())
        .then((freshData) => {
          if (freshData && !freshData.error) {
            setUser(freshData);
            localStorage.setItem("pv_user", JSON.stringify(freshData));
          } else {
            setUser(parsedUser);
          }
        })
        .catch(() => setUser(parsedUser));

      fetch(`/api/transactions?userId=${parsedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setTransactions(data);
        })
        .catch((err) => console.error("History error:", err));
    }
  }, [router]);

  if (!user) return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center font-mono uppercase tracking-widest">
      Refreshing Session...
    </div>
  );

  // Calculate Progress Percentage
  const maxVideos = TASK_LIMITS[user.j_class] || 5;
  const progressPercent = Math.min((user.completedToday / maxVideos) * 100, 100);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-2xl font-black text-yellow-500 tracking-tighter italic">PRIME VEST</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Accra Financial Center</p>
          </div>
          <button 
            onClick={() => { localStorage.removeItem("pv_user"); router.push("/login"); }}
            className="text-[10px] bg-red-950/30 text-red-500 px-5 py-2 rounded-full border border-red-900/50 font-bold uppercase"
          >
            Logout
          </button>
        </header>

        <main className="space-y-6">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-8 rounded-[32px] text-black shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-black text-2xl mb-1 uppercase tracking-tight">Welcome, {user.name}</h3>
              <p className="text-xs font-bold uppercase opacity-80">Rank: {user.j_class}</p>
            </div>
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-yellow-400 opacity-20 rounded-full"></div>
          </div>

          {/* TASK PROGRESS CARD */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[32px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Daily Tasks</h3>
              <span className="text-[10px] text-yellow-500 font-bold uppercase">{user.j_class} Goal</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-black rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="h-full bg-yellow-500 transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-xs font-black">
                {user.completedToday || 0} / {maxVideos}
              </p>
            </div>
          </div>

          {/* Central Balance Hub */}
          <div className="bg-gray-900 p-10 rounded-[40px] border border-gray-800 flex flex-col items-center text-center">
            <p className="text-gray-500 uppercase text-[10px] tracking-[0.4em] mb-6 font-black">Available Capital</p>
            <h2 className="text-6xl font-black text-white mb-10 tracking-tight">
              <span className="text-yellow-500 text-2xl mr-2 font-bold italic">GHS</span>
              {parseFloat(user.balance || "0").toLocaleString('en-GH', { minimumFractionDigits: 2 })}
            </h2>

            <div className="flex gap-4 w-full max-w-sm">
              <button onClick={() => router.push("/dashboard/deposit")} className="flex-1 py-5 bg-yellow-500 text-black font-black rounded-2xl uppercase text-[11px] tracking-widest shadow-lg shadow-yellow-500/10 active:scale-95 transition">
                + Deposit
              </button>
              <button onClick={() => router.push("/dashboard/withdraw")} className="flex-1 py-5 bg-transparent text-white font-black rounded-2xl uppercase text-[11px] tracking-widest border border-gray-700 active:scale-95 transition">
                - Withdraw
              </button>
            </div>
          </div>

          {/* Account Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/40 p-6 rounded-3xl border border-gray-800/50">
              <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest mb-2">Total Yield</p>
              <p className="text-xl font-black text-green-500">+ 0.00%</p>
            </div>
            <div className="bg-gray-900/40 p-6 rounded-3xl border border-gray-800/50">
              <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest mb-2">Network ID</p>
              <p className="text-xl font-black text-white italic">PV-{user.id?.toString().padStart(4, '0')}</p>
            </div>
          </div>

          {/* Activity Section */}
          <div className="mt-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="bg-gray-900/20 border border-dashed border-gray-800 p-8 rounded-3xl text-center">
                  <p className="text-gray-600 text-xs italic">No transactions found.</p>
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800 flex justify-between items-center transition hover:border-gray-700">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-tight">
                        {tx.type === 'deposit' ? '💰 Deposit' : '💸 Withdrawal'}
                        <span className={`ml-2 text-[8px] px-2 py-0.5 rounded ${tx.status === 'pending' ? 'bg-yellow-900/40 text-yellow-500' : 'bg-green-900/40 text-green-500'}`}>
                          {tx.status}
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-600 font-mono">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`font-black text-lg ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.type === 'deposit' ? '+' : '-'} {parseFloat(tx.amount).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}