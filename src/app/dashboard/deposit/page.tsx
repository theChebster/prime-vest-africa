"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const NETWORKS = {
  MTN: [{ number: "0541234567", name: "PRIME VEST ENT" }],
  TELECEL: [{ number: "0201112223", name: "PRIME VEST OFFICIAL" }],
  AIRTELTIGO: [{ number: "0275556667", name: "PV PAYMENTS" }]
};

export default function DepositPage() {
  const [step, setStep] = useState(1); 
  const [amount, setAmount] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [adminDetail, setAdminDetail] = useState({ number: "", name: "" });
  const [trxId, setTrxId] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("pv_user");
    if (!savedUser) router.push("/login");
    else setUser(JSON.parse(savedUser));
  }, [router]);

  const handleNextToDetails = (network: string) => {
    setSelectedNetwork(network);
    const options = NETWORKS[network as keyof typeof NETWORKS];
    const randomChoice = options[Math.floor(Math.random() * options.length)];
    setAdminDetail(randomChoice);
    setStep(3);
  };

  const handleSubmitDeposit = async () => {
    if (!trxId) return alert("Please enter the Transaction ID");
    setLoading(true);
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        body: JSON.stringify({ 
          userId: user.id, 
          amount: parseFloat(amount),
          network: selectedNetwork,
          referenceId: trxId 
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setStep(4); // Move to Success Screen
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-[32px] border border-gray-800 shadow-2xl">
        
        {/* STEP 1: AMOUNT */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-xl font-black uppercase text-yellow-500">Deposit Amount</h2>
            <p className="text-xs text-gray-500 uppercase">Enter how much you wish to fund</p>
            <input 
              type="number" className="w-full p-4 bg-black border border-gray-700 rounded-xl text-2xl font-bold outline-none focus:border-yellow-500 text-yellow-500"
              placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={() => setStep(2)} disabled={!amount} className="w-full py-4 bg-yellow-500 text-black font-black rounded-xl uppercase hover:bg-yellow-400 disabled:opacity-50 transition">Continue</button>
          </div>
        )}

        {/* STEP 2: CHOOSE NETWORK */}
        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <h2 className="text-xl font-black uppercase text-yellow-500">Select Network</h2>
            {Object.keys(NETWORKS).map((net) => (
              <button key={net} onClick={() => handleNextToDetails(net)} className="w-full p-5 bg-black border border-gray-800 rounded-2xl font-bold hover:border-yellow-500 transition text-left flex justify-between items-center group">
                {net} <span className="text-yellow-500 group-hover:translate-x-2 transition-transform">→</span>
              </button>
            ))}
          </div>
        )}

        {/* STEP 3: PAYMENT DETAILS */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-black p-5 rounded-2xl border border-yellow-500/20">
              <p className="text-[10px] text-gray-500 uppercase mb-2 font-bold tracking-widest">Send GHS {amount} to:</p>
              <p className="text-2xl font-black text-yellow-500 mb-1">{adminDetail.number}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Name: {adminDetail.name}</p>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-2">Transaction ID / Reference</label>
              <input 
                type="text" className="w-full p-4 bg-black border border-gray-700 rounded-xl outline-none focus:border-yellow-500 text-white font-mono"
                placeholder="Paste ID here" value={trxId} onChange={(e) => setTrxId(e.target.value)}
              />
            </div>

            <button onClick={handleSubmitDeposit} disabled={loading} className="w-full py-4 bg-yellow-500 text-black font-black rounded-xl uppercase shadow-lg shadow-yellow-500/10 active:scale-95 transition">
              {loading ? "Verifying..." : "I Have Sent the Money"}
            </button>
          </div>
        )}

        {/* STEP 4: SUCCESS SCREEN */}
        {step === 4 && (
          <div className="text-center space-y-6 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/50 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl text-green-500">✓</span>
            </div>
            <h2 className="text-2xl font-black uppercase text-white">Submitted!</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your deposit of <span className="text-white font-bold text-yellow-500">GHS {amount}</span> is being reviewed. 
              Balance will update within 5-30 minutes.
            </p>
            <button 
              onClick={() => router.push("/dashboard")} 
              className="w-full py-4 bg-white text-black font-black rounded-xl uppercase text-xs"
            >
              Back to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}