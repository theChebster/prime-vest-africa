"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Play, CheckCircle2, Timer, Tv, Clock, XCircle, CheckCircle } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";

interface Transaction {
  id: number;
  user_id: string;
  amount: string;
  network: string;
  reference_id: string;
  status: string;
  type: string;
  created_at: string;
}

export default function AdminManageDeposits() {
  const [pending, setPending] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Unified fetch: Specifically looking for 'deposit' type and 'pending' status
  const fetchPending = async () => {
    try {
      const res = await fetch("/api/admin/transactions?type=deposit&status=pending");
      const data = await res.json();
      setPending(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (id: number) => {
    if (!confirm("Confirm this payment? Money will be added to user balance.")) return;
    try {
      const res = await fetch("/api/admin/approve-transaction", {
        method: "POST",
        body: JSON.stringify({ transactionId: id }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) { 
        alert("Approved!"); 
        fetchPending(); 
      }
    } catch (err) { 
      alert("Error approving."); 
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("Reject this transaction? This will mark it as rejected.")) return;
    try {
      // Pointing to a unified reject endpoint
      const res = await fetch("/api/admin/reject-transaction", {
        method: "POST",
        body: JSON.stringify({ transactionId: id }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) { 
        alert("Rejected & Removed."); 
        fetchPending(); 
      }
    } catch (err) { 
      alert("Error rejecting."); 
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10 border-b border-zinc-800 pb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-yellow-500 uppercase tracking-tighter italic">Deposit Manager</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Reviewing Incoming Transfers</p>
            </div>
            <span className="bg-yellow-900/30 text-yellow-500 text-[10px] px-3 py-1 rounded-full border border-yellow-900 uppercase font-bold">
              {pending.length} Pending
            </span>
          </header>

          {loading ? (
            <div className="flex items-center gap-3">
              <Clock className="animate-spin text-yellow-500" size={18} />
              <p className="text-zinc-500 italic text-sm">Scanning database...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pending.length === 0 ? (
                <div className="p-20 border-2 border-dashed border-zinc-900 rounded-[40px] text-center">
                  <Clock className="mx-auto mb-4 text-zinc-800" size={48} />
                  <p className="text-zinc-700 font-bold uppercase tracking-widest text-xs">No pending deposits found.</p>
                </div>
              ) : (
                pending.map((tx) => (
                  <div key={tx.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-zinc-700 transition-all">
                    <div className="space-y-1">
                      <p className="text-[10px] text-zinc-500 uppercase font-black">User Account: {tx.user_id}</p>
                      <h3 className="text-2xl font-black text-white italic">GHS {parseFloat(tx.amount).toFixed(2)}</h3>
                      <div className="flex gap-2 mt-2">
                        <span className="bg-blue-900/30 text-blue-400 text-[9px] px-2 py-0.5 rounded border border-blue-900 font-black uppercase">
                          {tx.network || "MOMO"}
                        </span>
                        <span className="bg-zinc-800 text-zinc-300 text-[9px] px-2 py-0.5 rounded border border-zinc-700 font-mono italic">
                          REF: {tx.reference_id || "N/A"}
                        </span>
                        <span className="text-zinc-600 text-[9px] font-bold uppercase py-0.5">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => handleReject(tx.id)} 
                        className="flex-1 md:flex-none p-4 bg-zinc-800 text-red-500 rounded-2xl border border-zinc-700 hover:bg-red-950 transition-all"
                      >
                        <XCircle size={20} />
                      </button>
                      <button 
                        onClick={() => handleApprove(tx.id)} 
                        className="flex-1 md:flex-none px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-2xl uppercase text-xs shadow-lg shadow-yellow-500/10 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <CheckCircle size={18} /> Confirm Payment
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}