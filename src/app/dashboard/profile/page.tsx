"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { User, Phone, Shield, LogOut, CreditCard, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("pv_user");
    if (!savedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("pv_user");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <header className="flex flex-col items-center mb-8 pt-6">
          <div className="w-24 h-24 bg-gradient-to-tr from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center border-4 border-gray-900 shadow-xl mb-4">
            <User size={48} className="text-black" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">{user.name}</h2>
          <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em]">Official Member</p>
        </header>

        {/* Member Details Card */}
        <div className="bg-gray-900/50 rounded-[32px] border border-gray-800 p-6 mb-6">
          <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-6">Account Verification</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black rounded-2xl text-yellow-500 border border-gray-800">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-black">Registered Number</p>
                  <p className="text-sm font-bold">{user.phone_number}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black rounded-2xl text-yellow-500 border border-gray-800">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-black">Security Level</p>
                  <p className="text-sm font-bold">J-Class {user.j_class || 1}</p>
                </div>
              </div>
              <button 
                onClick={() => router.push("/dashboard/invest")}
                className="text-[10px] bg-yellow-500 text-black px-4 py-1.5 rounded-full font-black uppercase"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>

        {/* Action List */}
        <div className="space-y-3 mb-10">
          <button className="w-full bg-gray-900/30 border border-gray-800 p-5 rounded-2xl flex items-center justify-between group hover:border-gray-600 transition">
            <div className="flex items-center gap-4">
              <CreditCard size={20} className="text-gray-500" />
              <span className="text-xs font-black uppercase tracking-widest">Bank Details</span>
            </div>
            <ChevronRight size={16} className="text-gray-700 group-hover:text-yellow-500" />
          </button>

          <button 
            onClick={handleLogout}
            className="w-full bg-red-950/10 border border-red-900/20 p-5 rounded-2xl flex items-center justify-between group hover:bg-red-600 transition"
          >
            <div className="flex items-center gap-4">
              <LogOut size={20} className="text-red-500 group-hover:text-white" />
              <span className="text-xs font-black uppercase tracking-widest text-red-500 group-hover:text-white">Secure Logout</span>
            </div>
          </button>
        </div>

        {/* Version Info */}
        <div className="text-center">
          <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.4em]">Prime Vest Africa v1.0.4</p>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}