"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, CheckCircle2, Timer, Tv } from "lucide-react";
import BottomNav from "@/components/BottomNav";

// 1. Your Video Library (You can add more here)
const VIDEO_LIBRARY = [
  { id: "v1", title: "Global Market Trends", videoId: "qOVAbKKSH10", duration: 30 },
  { id: "v2", title: "Digital Asset Growth", videoId: "2g811Eo7K8U", duration: 30 },
  { id: "v3", title: "Prime Vest Strategy", videoId: "9Wp7pS0_4S8", duration: 45 },
];

export default function WatchPage() {
  const [selectedVideo, setSelectedVideo] = useState(VIDEO_LIBRARY[0]);
  const [seconds, setSeconds] = useState(selectedVideo.duration);
  const [canClaim, setCanClaim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  // Handle Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && seconds > 0) {
      timer = setInterval(() => setSeconds(prev => prev - 1), 1000);
    } else if (seconds === 0) {
      setCanClaim(true);
    }
    return () => clearInterval(timer);
  }, [seconds, isPlaying]);

  // Reset when video changes
  const changeVideo = (video: typeof VIDEO_LIBRARY[0]) => {
    setSelectedVideo(video);
    setSeconds(video.duration);
    setCanClaim(false);
    setIsPlaying(false);
  };

  const handleClaim = async () => {
    setLoading(true);
    const savedUser = localStorage.getItem("pv_user");
    if (!savedUser) return router.push("/login");
    const user = JSON.parse(savedUser);
    
    try {
      const res = await fetch("/api/earn/video", {
        method: "POST",
        body: JSON.stringify({ userId: user.id, amount: 0.50, videoId: selectedVideo.id }),
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        alert("Success! GHS 0.50 added to your capital.");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-yellow-500 uppercase italic tracking-tighter">Prime Player</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Watch & Earn Protocol</p>
          </div>
          <div className="text-right">
             <p className="text-[9px] text-zinc-600 font-black uppercase">Session Reward</p>
             <p className="text-xl font-black text-white">GHS 0.50</p>
          </div>
        </header>

        {/* --- THE PLAYER BOX --- */}
        <div className="relative aspect-video bg-zinc-900 rounded-[32px] overflow-hidden border border-zinc-800 shadow-2xl mb-8">
          {!isPlaying ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-900/90 backdrop-blur-sm">
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="p-6 bg-yellow-500 text-black rounded-full hover:scale-110 transition-transform shadow-xl shadow-yellow-500/20"
                >
                  <Play fill="black" size={32} />
                </button>
                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Click to Start Session</p>
            </div>
          ) : (
            <>
              {/* Security Shield: Prevents user from interacting with YouTube controls */}
              <div className="absolute inset-0 z-10 bg-transparent" /> 
              
              <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&controls=0&mute=0&rel=0&modestbranding=1`} 
                allow="autoplay"
              />
            </>
          )}
        </div>

        {/* --- TIMER & CLAIM ACTION --- */}
        <div className="flex flex-col items-center mb-12">
            {!canClaim ? (
               <div className="flex flex-col items-center gap-2">
                 <div className="flex items-center gap-3 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-3xl">
                    <Timer className={isPlaying ? "text-yellow-500 animate-pulse" : "text-zinc-700"} />
                    <span className="text-3xl font-mono font-black">{seconds}s</span>
                 </div>
                 <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Remaining Duration</p>
               </div>
            ) : (
                <button 
                  onClick={handleClaim}
                  disabled={loading}
                  className="w-full max-w-sm py-5 bg-white text-black font-black rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-yellow-500 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "Verifying..." : <><CheckCircle2 size={18}/> Claim GHS 0.50</>}
                </button>
            )}
        </div>

        {/* --- VIDEO SELECTOR (The Gallery) --- */}
        <div>
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Tv size={14}/> Available Channels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VIDEO_LIBRARY.map((video) => (
              <button
                key={video.id}
                onClick={() => changeVideo(video)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedVideo.id === video.id 
                  ? 'border-yellow-500 bg-yellow-500/5' 
                  : 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800'
                }`}
              >
                <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Channel {video.id}</p>
                <h4 className="text-sm font-bold truncate">{video.title}</h4>
              </button>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}