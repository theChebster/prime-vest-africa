"use client";
import { useEffect, useState } from "react";
import { Users, Landmark, ArrowUpCircle, ArrowDownCircle, ShieldAlert } from "lucide-react";
import AdminGuard from "@/components/AdminGuard"; // Added this

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
    <AdminGuard> {/* Wrapped everything in the Guard */}
      <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-12">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-yellow-500 italic uppercase tracking-tighter">Command Center</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.3em]">System Oversight • Prime Vest</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Members" value={stats.totalUsers} icon={<Users className="text-blue-500" />} />
          <StatCard title="System Liability" value={`GHS ${stats.totalBalance?.toLocaleString() || 0}`} icon={<Landmark className="text-yellow-500" />} />
          <StatCard title="Pending Deposits" value={stats.pendingDeposits} icon={<ArrowUpCircle className="text-green-500" />} />
          <StatCard title="Pending Payouts" value={stats.pendingWithdrawals} icon={<ArrowDownCircle className="text-red-500" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[40px]">
            <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
              <ShieldAlert size={20} className="text-yellow-500" /> Administrative Tasks
            </h3>
            <div className="space-y-4">
              <AdminLink href="/admin/deposits" label="Review Deposit Proofs" count={stats.pendingDeposits} color="bg-green-500" />
              <AdminLink href="/admin/withdrawals" label="Process Withdrawal Requests" count={stats.pendingWithdrawals} color="bg-red-500" />
              <AdminLink href="/admin/users" label="Manage User Database" count={null} color="bg-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}

// Sub-components remain the same...
function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[32px] hover:border-zinc-700 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-black rounded-2xl border border-zinc-800">{icon}</div>
      </div>
      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-black font-mono">{value}</p>
    </div>
  );
}

function AdminLink({ href, label, count, color }: any) {
  return (
    <a href={href} className="flex justify-between items-center p-5 bg-black border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all">
      <span className="text-sm font-bold uppercase tracking-tight">{label}</span>
      {count !== null && count > 0 && (
        <span className={`${color} text-black text-[10px] font-black px-3 py-1 rounded-full`}>
          {count} PENDING
        </span>
      )}
    </a>
  );
}