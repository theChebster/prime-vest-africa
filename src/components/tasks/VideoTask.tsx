"use client"
import { useState, useEffect } from 'react';
import { Play, CheckCircle2, Clock } from 'lucide-react';

export default function VideoTask({ onComplete }: { onComplete: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsFinished(true);
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-4">
      <div className="aspect-video bg-black rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
        {/* Placeholder for Video - In production, use an iframe or video tag */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent" />
        
        {!isPlaying && !isFinished && (
          <button 
            onClick={() => setIsPlaying(true)}
            className="z-10 bg-yellow-500 text-black p-4 rounded-full hover:scale-110 transition-transform"
          >
            <Play fill="black" size={32} />
          </button>
        )}

        {isPlaying && (
          <div className="z-10 flex flex-col items-center">
            <div className="text-4xl font-mono font-bold text-yellow-500">{timeLeft}s</div>
            <p className="text-zinc-400 text-sm">Validating View...</p>
          </div>
        )}

        {isFinished && (
          <div className="z-10 flex flex-col items-center text-green-400">
            <CheckCircle2 size={48} />
            <p className="mt-2 font-bold uppercase tracking-widest">Task Ready</p>
          </div>
        )}
      </div>

      {isFinished ? (
        <button 
          onClick={() => {
            onComplete();
            setIsFinished(false);
            setTimeLeft(15);
          }}
          className="w-full bg-green-500 text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)]"
        >
          CLAIM GHS REWARD
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 text-zinc-500 py-4">
          <Clock size={18} />
          <span className="text-sm font-medium">Watch 15s to earn</span>
        </div>
      )}
    </div>
  );
}