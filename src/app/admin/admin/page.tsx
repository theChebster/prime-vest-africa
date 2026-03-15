"use client";
import { useEffect, useState } from "react";
// PATH FIX: Go up 3 times to get out of admin/admin/app to reach src/components
import AdminGuard from "../../../components/AdminGuard"; 

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0
  });

  useEffect(() => {
    setMounted(true);
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Admin fetch error", err));
  }, []);

  if (!mounted) return null;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-black text-white p-6 lg:p-12">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-yellow-500 italic uppercase">Command Center</h1>
          <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">System Oversight</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Example Stat Card */}
          <div className="bg-zinc-900/40 p-6 rounded-[32px] border border-zinc-800">
            <p className="text-[10px] text-zinc-500 uppercase font-black">Members</p>
            <p className="text-2xl font-black font-mono">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[40px]">
          <h3 className="text-lg font-black uppercase mb-6 text-yellow-500">Administrative Tasks</h3>
          <div className="space-y-4">
            {/* These paths must also be deep if your files are deep */}
            <a href="/admin/admin/deposits" className="block p-5 bg-black rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition-all font-bold">
              Review Deposits
            </a>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}