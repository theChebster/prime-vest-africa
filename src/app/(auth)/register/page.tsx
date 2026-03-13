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
      // Use a relative path. Do NOT include http://localhost
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
      });

      // CHECK: Did the server return HTML instead of JSON?
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textError = await res.text();
        console.error("Server returned non-JSON:", textError);
        throw new Error("The server sent back a webpage instead of data. Check your API folder path.");
      }

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert("Success! Welcome to Prime Vest Africa.");
        router.push("/login"); 
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err: any) {
      setLoading(false);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl font-black mb-8 text-yellow-500 uppercase italic">Prime Vest</h1>
      <form onSubmit={handleRegister} className="w-full max-w-md space-y-4 bg-gray-900 p-8 rounded-3xl border border-gray-800">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-4 rounded-xl bg-black border border-gray-700 focus:border-yellow-500 outline-none"
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-4 rounded-xl bg-black border border-gray-700 focus:border-yellow-500 outline-none"
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 rounded-xl bg-black border border-gray-700 focus:border-yellow-500 outline-none"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 bg-yellow-600 hover:bg-yellow-500 text-black font-black rounded-xl uppercase"
        >
          {loading ? "Processing..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}