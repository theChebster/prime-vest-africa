"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Smartphone, Lock, Loader2 } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ fullName: "", phoneNumber: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API Path check: matches src/app/api/auth/register/route.ts
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert("Registration Successful! Welcome to Prime Vest.");
        router.push("/login"); // Corrected path
      } else {
        alert(data.message || data.details || "Registration failed");
      }
    } catch (err) {
      setLoading(false);
      alert("Network error. Please check your connection.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="w-full max-w-sm">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-black text-yellow-500 italic uppercase tracking-tighter">
            Prime Vest Africa
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2">
            Asset Growth Protocol
          </p>
        </header>

        <form onSubmit={handleRegister} className="space-y-4 bg-zinc-900/40 p-8 rounded-[40px] border border-zinc-800 backdrop-blur-md">
          {/* Full Name Input */}
          <div className="relative">
            <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-5 pl-12 rounded-2xl bg-black border border-zinc-800 outline-none focus:border-yellow-600 text-yellow-500 transition-all placeholder:text-zinc-700"
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>

          {/* Phone Number Input */}
          <div className="relative">
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Phone Number (MoMo)"
              className="w-full p-5 pl-12 rounded-2xl bg-black border border-zinc-800 outline-none focus:border-yellow-600 text-yellow-500 transition-all placeholder:text-zinc-700"
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="password"
              placeholder="Create Password"
              className="w-full p-5 pl-12 rounded-2xl bg-black border border-zinc-800 outline-none focus:border-yellow-600 text-yellow-500 transition-all placeholder:text-zinc-700"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-5 bg-yellow-600 hover:bg-yellow-500 rounded-2xl font-black text-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Initializing...
              </>
            ) : (
              "Join the Team"
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-zinc-500 text-xs font-bold uppercase tracking-tight">
          Already a member?{" "}
          <button 
            onClick={() => router.push("/login")}
            className="text-yellow-500 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}