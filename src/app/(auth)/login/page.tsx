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
        // Store user in local storage to use on the dashboard
        localStorage.setItem("pv_user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (err) {
      setLoading(false);
      alert("Network error.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-black text-yellow-500 mb-8 uppercase">Prime Vest Login</h2>
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 bg-gray-900 p-8 rounded-3xl border border-gray-800">
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-4 rounded-xl bg-black border border-gray-700 outline-none focus:border-yellow-500"
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 rounded-xl bg-black border border-gray-700 outline-none focus:border-yellow-500"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="w-full p-4 bg-yellow-600 rounded-xl font-bold text-black uppercase hover:bg-yellow-500 transition">
          {loading ? "Verifying..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}