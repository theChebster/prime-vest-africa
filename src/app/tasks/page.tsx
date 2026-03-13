"use client"
import { useState } from 'react';
import VideoTask from '@/components/tasks/VideoTask';

export default function TasksPage() {
  const [tasksDone, setTasksDone] = useState(0);
  const totalTasks = 10; // For J1 Level
  const earningsPerTask = 0.575; // 5.75 GHS total / 10 videos

  const handleTaskCompletion = () => {
    if (tasksDone < totalTasks) {
      setTasksDone(prev => prev + 1);
    }
  };

  return (
    <main className="min-h-screen bg-black p-6 pb-32">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Daily Tasks</h1>
        <div className="flex justify-between items-end mt-2">
          <p className="text-zinc-500 text-sm">Progress: {tasksDone} / {totalTasks}</p>
          <p className="text-yellow-500 font-mono font-bold">J1 CLASS</p>
        </div>
        
        {/* The Progress Bar */}
        <div className="w-full bg-zinc-800 h-3 mt-4 rounded-full overflow-hidden border border-zinc-700/50">
          <div 
            className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full transition-all duration-700 ease-out"
            style={{ width: `${(tasksDone / totalTasks) * 100}%` }}
          />
        </div>
      </header>

      <div className="space-y-6">
        {/* Earnings Card */}
        <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800 flex justify-between items-center shadow-2xl">
          <div>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Accumulated Today</p>
            <p className="text-2xl font-black text-green-400">
              GHS {(tasksDone * earningsPerTask).toFixed(2)}
            </p>
          </div>
          <div className="bg-zinc-800 h-12 w-[1px]" />
          <div className="text-right">
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Status</p>
            <p className="text-white font-bold text-sm">Active</p>
          </div>
        </div>

        {/* The Video Engine */}
        {tasksDone < totalTasks ? (
          <VideoTask onComplete={handleTaskCompletion} />
        ) : (
          <div className="text-center py-12 bg-zinc-900/50 rounded-3xl border border-green-500/20 backdrop-blur-sm">
            <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-500 text-2xl">✔</span>
            </div>
            <h3 className="text-white text-xl font-bold">Quota Reached</h3>
            <p className="text-zinc-500 text-sm mt-2 px-6">
              You've completed all tasks for today. Your J1 earnings have been credited.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}