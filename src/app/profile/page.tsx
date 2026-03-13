"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form, setForm] = useState({ fullName: "", phoneNumber: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert("Registration Successful! Welcome to Prime Vest.");
        router.push("/login");
      } else {
        alert(data.message || data.details || "Registration failed");
      }
    } catch (err) {
      setLoading(false);
      alert("Network error. Please check if your server is running.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">PRIME VEST AFRICA</h1>
      <form onSubmit={handleRegister} className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white"
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone Number (MoMo)"
          className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white"
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-yellow-600 hover:bg-yellow-500 rounded font-bold transition text-black"
        >
          {loading ? "PROMPTING DATA..." : "JOIN THE TEAM"}
        </button>
      </form>
    </div>
  );
}