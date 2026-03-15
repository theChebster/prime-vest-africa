"use client";
import { useEffect, useState } from "react";

// Defining an Interface stops the underlines
interface Transaction {
  id: number;
  user_id: number;
  amount: string;
  network: string;
  reference_id: string;
  status: string;
}

export default function AdminManageDeposits() {
  const [pending, setPending] = useState<Transaction[]>([]); // Added Type here
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await fetch("/api/transactions?status=pending");
      const data = await res.json();
      // TypeScript now knows 'data' should match our Transaction interface
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
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        body: JSON.stringify({ transactionId: id }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) { alert("Approved!"); fetchPending(); }
    } catch (err) { alert("Error approving."); }
  };

  // NEW: Reject Function
  const handleReject = async (id: number) => {
    if (!confirm("Reject this transaction? This will delete the request.")) return;
    try {
      const res = await fetch("/api/admin/reject", {
        method: "POST",
        body: JSON.stringify({ transactionId: id }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) { alert("Rejected & Removed."); fetchPending(); }
    } catch (err) { alert("Error rejecting."); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 border-b border-gray-800 pb-6 flex justify-between items-center">
          <h1 className="text-2xl font-black text-yellow-500 uppercase tracking-tighter">Admin: Deposit Manager</h1>
          <span className="bg-yellow-900/30 text-yellow-500 text-[10px] px-3 py-1 rounded-full border border-yellow-900 uppercase font-bold">
            {pending.length} Pending
          </span>
        </header>

        {loading ? (
          <p className="text-gray-500 italic">Scanning database...</p>
        ) : (
          <div className="grid gap-4">
            {pending.length === 0 && <p className="text-gray-700">No pending deposits found.</p>}
            {pending.map((tx) => (
              <div key={tx.id} className="bg-gray-900 border border-gray-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-black">User ID: {tx.user_id}</p>
                  <h3 className="text-2xl font-black text-white">GHS {tx.amount}</h3>
                  <div className="flex gap-2">
                    <span className="bg-blue-900/30 text-blue-400 text-[9px] px-2 py-0.5 rounded border border-blue-900 font-bold uppercase">{tx.network}</span>
                    <span className="bg-gray-800 text-gray-300 text-[9px] px-2 py-0.5 rounded border border-gray-700 font-mono italic">ID: {tx.reference_id}</span>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={() => handleReject(tx.id)} className="flex-1 md:flex-none px-6 py-3 bg-red-950 text-red-500 font-black rounded-xl uppercase text-xs border border-red-900 hover:bg-red-900 hover:text-white transition">
                    Reject
                  </button>
                  <button onClick={() => handleApprove(tx.id)} className="flex-1 md:flex-none px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl uppercase text-xs shadow-lg shadow-yellow-500/10">
                    Confirm & Add Balance
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