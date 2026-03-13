"use client"
import { useState } from 'react';
import { Copy, Users, TrendingUp, DollarSign } from 'lucide-react';

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "PRIME777"; // This will be dynamic later

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://primevestafrica.com/register?ref=${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-black p-6 pb-32">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Team</h1>
        <p className="text-zinc-500 text-sm">Earn 10% from Level 1 referrals</p>
      </header>

      {/* Referral Link Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-6">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Your Referral Link</p>
        <div className="flex gap-2">
          <div className="bg-black border border-zinc-800 rounded-xl px-4 py-3 flex-1 text-zinc-300 text-sm truncate font-mono">
            pva.com/ref={referralCode}
          </div>
          <button 
            onClick={copyToClipboard}
            className="bg-yellow-500 text-black px-4 rounded-xl font-bold active:scale-95 transition-transform"
          >
            {copied ? "Saved!" : <Copy size={20} />}
          </button>
        </div>
      </div>

      {/* Team Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <Users className="text-yellow-500 mb-2" size={20} />
          <p className="text-zinc-500 text-[10px] uppercase">Team Size</p>
          <p className="text-xl font-bold text-white">0</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <TrendingUp className="text-green-500 mb-2" size={20} />
          <p className="text-zinc-500 text-[10px] uppercase">Commissions</p>
          <p className="text-xl font-bold text-white">GHS 0.00</p>
        </div>
      </div>

      {/* Level Breakdown */}
      <div className="space-y-3">
        <h3 className="text-zinc-400 font-bold text-sm px-1">Bonus Structure</h3>
        {[
          { level: "Level 1", percent: "10%", desc: "Direct Invites" },
          { level: "Level 2", percent: "5%", desc: "Indirect Invites" },
          { level: "Level 3", percent: "2%", desc: "Community Invites" },
        ].map((item, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-2xl flex justify-between items-center">
            <div>
              <p className="text-white font-bold text-sm">{item.level}</p>
              <p className="text-zinc-500 text-xs">{item.desc}</p>
            </div>
            <div className="text-yellow-500 font-black">{item.percent}</div>
          </div>
        ))}
      </div>
    </main>
  );
}