"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WatchPage() {
  const [seconds, setSeconds] = useState(30);
  const [canClaim, setCanClaim] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => setSeconds(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setCanClaim(true);
    }
  }, [seconds]);

  const handleClaim = async () => {
    setLoading(true);
    const savedUser = localStorage.getItem("pv_user");
    if (!savedUser) return router.push("/login");
    
    const user = JSON.parse(savedUser);
    
    try {
      const res = await fetch("/api/earn/video", {
        method: "POST",
        body: JSON.stringify({ userId: user.id, amount: 0.50 }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (res.ok) {
        alert("Success! GHS 0.50 added to your capital.");
        router.push("/dashboard");
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-900 rounded-[40px] border border-gray-800 p-8 shadow-2xl text-center">
        <h2 className="text-2xl font-black text-yellow-500 uppercase mb-2 tracking-tighter">Prime Watch</h2>
        <p className="text-[10px] text-gray-500 mb-8 uppercase tracking-[0.3em] font-bold">Earn GHS 0.50 per video</p>

        <div className="aspect-video bg-black rounded-3xl border border-gray-800 flex items-center justify-center relative overflow-hidden mb-8 shadow-inner">
            <iframe 
                className="w-full h-full pointer-events-none"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&mute=1" 
                allow="autoplay"
            ></iframe>
        </div>

        <div className="space-y-4">
          {!canClaim ? (
            <div className="py-4 px-8 bg-gray-800/50 rounded-2xl inline-block border border-gray-700">
              <span className="text-3xl font-black text-white">{seconds}s</span>
              <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mt-1">Watching...</p>
            </div>
          ) : (
            <button 
              onClick={handleClaim}
              disabled={loading}
              className="w-full py-5 bg-yellow-500 text-black font-black rounded-2xl uppercase tracking-widest hover:bg-yellow-400 transition transform active:scale-95"
            >
              {loading ? "Verifying..." : "Claim Reward Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}