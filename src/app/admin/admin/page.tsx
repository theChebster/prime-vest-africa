"use client";
import { useEffect, useState } from "react";
import { Users, Landmark, ArrowUpCircle, ArrowDownCircle, ShieldAlert } from "lucide-react";

// FIXED PATH: Go up 3 levels to get out of dashboard/admin and into src/components
import AdminGuard from "../../../components/AdminGuard"; 

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0
  });

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Admin fetch error", err));
  }, []);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-12">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-yellow-500 italic uppercase tracking-tighter">Command Center</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.3em]">System Oversight • Prime Vest</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Members" value={stats.totalUsers} icon={<Users className="text-blue-500" />} />
          <StatCard title="System Liability" value={`GHS ${stats.totalBalance?.toLocaleString() || 0}`} icon={<Landmark className="text-yellow-500" />} />
          <StatCard title="Pending Deposits" value={stats.pendingDeposits} icon={<ArrowUpCircle className="text-green-500" />} />
          <StatCard title="Pending Payouts" value={stats.pendingWithdrawals} icon={<ArrowDownCircle className="text-red-500" />} />
        </div>
        
        {/* Rest of your UI code... */}
      </div>
    </AdminGuard>
  );
}

// Ensure StatCard and AdminLink functions are defined below...
function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[32px]">
      <div className="mb-4">{icon}</div>
      <p className="text-[10px] text-zinc-500 font-black">{title}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}