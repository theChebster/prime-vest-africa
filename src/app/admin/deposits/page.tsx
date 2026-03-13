"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Wallet, AlertTriangle } from "lucide-react";

// Define the shape of a deposit for TypeScript
interface Deposit {
  id: number;
  username: string;
  user_id: number;
  amount: number | string;
  reference_id: string;
  status: string;
}

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch("/api/admin/deposits");
      
      // Fixing the "data was underlined" issue by explicitly defining types
      const data: Deposit[] | { error: string } = await res.json();
      
      if (Array.isArray(data)) {
        setDeposits(data);
      } else if (typeof data === 'object' && data !== null && 'error' in data) {
        setApiError(data.error);
        setDeposits([]); 
      } else {
        setApiError("Unexpected response format");
        setDeposits([]);
      }
    } catch (err) {
      console.error("Failed to fetch deposits:", err);
      setApiError("Failed to connect to the server.");
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, status: 'completed' | 'failed') => {
    const confirmAction = confirm(`Are you sure you want to mark this as ${status}?`);
    if (!confirmAction) return;

    try {
      const res = await fetch(`/api/admin/deposits/update`, {
        method: "POST",
        body: JSON.stringify({ transactionId: id, status }),
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        alert("Transaction Updated!");
        fetchDeposits(); // Refresh the list
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || "Update failed"}`);
      }
    } catch (err) {
      alert("Error updating transaction. Check your connection.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-yellow-500 uppercase italic">Deposit Requests</h1>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Verify MoMo payments before approving</p>
      </header>

      {/* Error Alert Box */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-xs font-bold uppercase flex gap-2 items-center">
          <AlertTriangle size={16} /> ERROR: {apiError}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-zinc-900 rounded-3xl" />)}
        </div>
      ) : deposits.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
          <Clock className="mx-auto text-zinc-700 mb-4" size={40} />
          <p className="text-zinc-500 font-bold uppercase text-xs">No pending deposits</p>
          <button 
            onClick={fetchDeposits}
            className="mt-4 text-[10px] text-yellow-500 font-bold underline uppercase"
          >
            Refresh List
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {deposits.map((dep) => (
            <div key={dep.id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-4 items-center w-full">
                <div className="h-12 w-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500">
                  <Wallet size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black uppercase tracking-tight">{dep.username}</span>
                    <span className="text-[9px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono">USER ID: {dep.user_id}</span>
                  </div>
                  <p className="text-xl font-black text-white">GHS {dep.amount}</p>
                  <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-tighter">Reference: {dep.reference_id}</p>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => handleAction(dep.id, 'failed')}
                  className="flex-1 md:flex-none px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase text-[10px] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <XCircle size={14} /> Reject
                </button>
                <button 
                  onClick={() => handleAction(dep.id, 'completed')}
                  className="flex-1 md:flex-none px-6 py-3 bg-green-500 text-black rounded-2xl font-black uppercase text-[10px] hover:bg-yellow-500 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={14} /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}