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
        localStorage.setItem("pv_user", JSON.stringify(data.user));

        // Detect Admin Status
        const isAdmin = 
          data.user.is_admin === true || 
          data.user.is_admin === "true" || 
          data.user.is_admin === 1;

        if (isAdmin) {
          // REDIRECT FIX: Points to src/app/admin/admin/page.tsx
          router.push("/admin"); 
        } else {
          router.push("/dashboard");
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      setLoading(false);
      alert("Network error. Please check your connection.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-black text-yellow-500 mb-8 uppercase italic tracking-tighter">Prime Vest Africa</h2>
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 bg-zinc-900/40 p-10 rounded-[40px] border border-zinc-800 backdrop-blur-md">
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-5 rounded-2xl bg-black border border-zinc-800 outline-none focus:border-yellow-600 text-yellow-500"
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-5 rounded-2xl bg-black border border-zinc-800 outline-none focus:border-yellow-600 text-yellow-500"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button disabled={loading} className="w-full p-5 bg-yellow-600 rounded-2xl font-black text-black uppercase hover:bg-yellow-500 transition-all">
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}