"use client";
import { useState, useEffect } from "react";
import { X, CheckCircle2, RefreshCw, Banknote, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the shape of our transaction data to stop TypeScript warnings
interface WithdrawalRequest {
  id: number;
  user_id: number;
  amount: string | number;
  status: string;
  created_at: string;
}

export default function AdminWithdrawals() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const router = useRouter();

  // 1. Fetch pending withdrawals from /api/admin/withdrawals
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/withdrawals");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("List fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. Handle Approve/Reject using /api/admin/withdrawals/update
  const handleAction = async (transactionId: number, newStatus: 'completed' | 'failed') => {
    setActionLoading(transactionId);
    try {
      // MATCHES YOUR FOLDER: src/app/api/admin/withdrawals/update/route.ts
      const res = await fetch("/api/admin/withdrawals/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: transactionId, 
          status: newStatus 
        }),
      });

      if (res.ok) {
        // Success: Remove from UI list immediately
        setRequests((prev) => prev.filter((r) => r.id !== transactionId));
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || "Update failed"));
      }
    } catch (err) {
      alert("Connection Failed. Make sure you deleted any route.ts in the parent folder!");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition mb-4 uppercase text-[10px] font-bold tracking-widest"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <h1 className="text-4xl font-black uppercase italic text-yellow-500 tracking-tighter">Payout Control</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">Pending Requests</p>
          </div>
          
          <button 
            onClick={fetchRequests} 
            disabled={loading}
            className="p-4 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition active:scale-95 border border-zinc-800 shadow-xl"
          >
            <RefreshCw size={20} className={loading ? "animate-spin text-yellow-500" : "text-white"} />
          </button>
        </header>

        {loading && requests.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-[40px] p-24 text-center">
            <Banknote className="mx-auto text-zinc-800 mb-6" size={60} />
            <p className="text-zinc-600 font-black uppercase text-xs tracking-widest">No pending payouts found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => (
              <div 
                key={req.id} 
                className="bg-zinc-900 border border-zinc-800 p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between group hover:border-zinc-700 transition-all duration-300"
              >
                <div className="mb-6 md:mb-0">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-3xl font-black text-white font-mono tracking-tighter">GHS {req.amount}</span>
                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[9px] font-black uppercase rounded-full border border-yellow-500/20">Pending Approval</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Transaction ID: <span className="text-zinc-300">{req.id}</span></p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">User Reference: <span className="text-zinc-300">{req.user_id}</span></p>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    disabled={actionLoading !== null}
                    onClick={() => handleAction(req.id, 'failed')}
                    className="flex-1 md:flex-none h-14 px-8 bg-zinc-800 text-red-500 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                  >
                    {actionLoading === req.id ? "..." : <X size={20} />}
                  </button>
                  <button 
                    disabled={actionLoading !== null}
                    onClick={() => handleAction(req.id, 'completed')}
                    className="flex-[2] md:flex-none h-14 px-10 bg-green-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-green-500 transition-all shadow-lg shadow-green-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === req.id ? "Processing..." : (
                      <>
                        <CheckCircle2 size={18} /> Approve
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}