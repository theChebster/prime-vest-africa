"use client";
import { useRouter } from "next/navigation";
import { Play, ShieldCheck, Zap, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-white/5">
        <h1 className="text-xl font-black tracking-tighter text-yellow-500 italic">PRIME VEST</h1>
        
        <div className="flex gap-3">
          {/* LOGIN BUTTON */}
          <button 
            onClick={() => router.push("/login")}
            className="text-[10px] font-black uppercase tracking-widest px-5 py-2 hover:text-yellow-500 transition border border-transparent"
          >
            Login
          </button>
          
          {/* JOIN / REGISTER BUTTON */}
          <button 
            onClick={() => router.push("/register")}
            className="bg-yellow-500 text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition shadow-lg shadow-yellow-500/20"
          >
            Join Now
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="py-24 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
            <p className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.3em]">Official Launch 2026</p>
        </div>
        
        <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] uppercase">
          Digital <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-700">Wealth</span> <br/>
          Simplified.
        </h2>
        
        <p className="text-gray-500 text-sm md:text-lg mb-12 max-w-xl mx-auto font-medium leading-relaxed">
          Watch, Invest, and Earn. Access global brands like Apple and Samsung through our tiered J-Class investment ecosystem.
        </p>

        {/* MAIN CALL TO ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <button 
            onClick={() => router.push("/register")}
            className="w-full md:w-auto px-12 py-6 bg-yellow-500 text-black font-black rounded-[24px] uppercase text-xs tracking-[0.2em] hover:bg-white transition transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
          >
            Get Started <ArrowRight size={16} />
          </button>
          
          <button 
            onClick={() => router.push("/login")}
            className="w-full md:w-auto px-12 py-6 bg-gray-900 text-white font-black rounded-[24px] uppercase text-xs tracking-[0.2em] border border-gray-800 hover:bg-gray-800 transition"
          >
            Existing Member
          </button>
        </div>
      </header>

      {/* --- PROMO VIDEO SECTION --- */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto bg-gray-900/30 border border-gray-800 p-4 rounded-[40px] shadow-2xl">
          <div className="aspect-video bg-black rounded-[32px] overflow-hidden relative group">
             <iframe 
                className="w-full h-full opacity-80 group-hover:opacity-100 transition duration-700"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="Prime Vest Intro"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-gray-900 text-center">
        <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.5em]">
          PRIME VEST AFRICA • SECURE INVESTMENT PROTOCOL
        </p>
      </footer>
    </div>
  );
}