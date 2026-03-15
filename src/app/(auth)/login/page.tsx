"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ phoneNumber: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        // 1. Save user data
        localStorage.setItem("pv_user", JSON.stringify(data.user));

        // 2. DEBUG LOG - Open your browser console (F12) to see this!
        console.log("Login Response User Data:", data.user);

        // 3. BULLETPROOF REDIRECT
        // We check for true as a boolean, a string "true", or the number 1
        const isAdmin = 
          data.user.is_admin === true || 
          data.user.is_admin === "true" || 
          data.user.is_admin === 1;

        if (isAdmin) {
          console.log("Redirecting to Admin Dashboard...");
          router.push("/admin");
        } else {
          console.log("Redirecting to User Dashboard...");
          router.push("/dashboard");
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      setLoading(false);
      console.error("Login sequence error:", err);
      alert("Network error. Please check your connection.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-black text-yellow-500 mb-8 uppercase italic tracking-tighter">
        Prime Vest Africa
      </h2>
      
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 bg-zinc-900/40 p-10 rounded-[40px] border border-zinc-800 shadow-2xl backdrop-blur-md">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">Secure Line</label>
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full p-5 rounded-2xl bg-black border border-zinc-800 outline-none focus:border-yellow-600 transition-all font-mono text-yellow-500"
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">Access Key</label>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-5 rounded-2xl bg-black border border-zinc-800 outline-none focus:border-yellow-600 transition-all font-mono text-yellow-500"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <button 
          disabled={loading}
          className="w-full p-5 bg-yellow-600 rounded-2xl font-black text-black uppercase hover:bg-yellow-500 transition-all active:scale-95 shadow-lg shadow-yellow-900/20 disabled:opacity-50 mt-4"
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>
      
      <p className="mt-8 text-zinc-700 text-[9px] uppercase tracking-[0.5em] font-bold">
        Security Layer: Active • Admin Override Enabled
      </p>
    </div>
  );
}