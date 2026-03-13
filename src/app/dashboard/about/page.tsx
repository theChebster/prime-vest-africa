"use client";
import BottomNav from "@/components/BottomNav";

export default function AboutPage() {
  const structure = [
    { tier: "Intern", deposit: "Free", videos: 5, daily: 9.00, monthly: 45.00, profit: "45.00 (Trial)" },
    { tier: "J1", deposit: 150, videos: 10, daily: 5.75, monthly: 172.50, profit: "+22.50" },
    { tier: "J2", deposit: 300, videos: 10, daily: 11.50, monthly: 345.00, profit: "+45.00" },
    { tier: "J3", deposit: 600, videos: 20, daily: 23.00, monthly: 690.00, profit: "+90.00" },
    { tier: "J4", deposit: 1000, videos: 20, daily: 38.33, monthly: 1150.00, profit: "+150.00" },
    { tier: "J5", deposit: 1500, videos: 25, daily: 57.50, monthly: 1725.00, profit: "+225.00" },
    { tier: "J6", deposit: 2000, videos: 30, daily: 76.66, monthly: 2300.00, profit: "+300.00" },
    { tier: "J7", deposit: 3000, videos: 40, daily: 115.00, monthly: 3450.00, profit: "+450.00" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-32">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-black text-yellow-500 mb-2 uppercase italic tracking-tighter">Income Structure</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mb-8">Official Prime Vest Africa Salary Table</p>
        
        <div className="space-y-4">
          {structure.map((item, i) => (
            <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[28px] relative overflow-hidden">
               <div className="flex justify-between items-center relative z-10">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic">{item.tier}</h3>
                  <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-widest">{item.videos} Daily Videos</p>
                </div>
                <div className="text-right">
                   <p className="text-sm font-bold text-gray-400 uppercase">Daily Income</p>
                   <p className="text-xl font-black text-white">GHS {item.daily.toFixed(2)}</p>
                </div>
               </div>
               
               <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <span>Monthly: GHS {item.monthly.toFixed(2)}</span>
                  <span className="text-green-500">Net: {item.profit}</span>
               </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}