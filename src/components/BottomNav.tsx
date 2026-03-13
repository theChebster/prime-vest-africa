"use client";
import { useRouter, usePathname } from "next/navigation";
import { Home, PlayCircle, TrendingUp, User, Info } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/dashboard", icon: <Home size={20} /> },
    { name: "About", path: "/dashboard/about", icon: <Info size={20} /> },
    { name: "Watch", path: "/dashboard/watch", icon: <PlayCircle size={20} /> },
    { name: "Upgrade", path: "/dashboard/upgrade", icon: <TrendingUp size={20} /> },
    { name: "Profile", path: "/dashboard/profile", icon: <User size={20} /> },
  ];

  const handleNavigation = (path: string) => {
    // Force the router to move, but use a hard link if it's the upgrade page
    // to bypass any weird routing cache
    if (path === "/dashboard/upgrade") {
      window.location.href = path;
    } else {
      router.push(path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-gray-800 pb-6 pt-3 px-2 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.name}
              type="button" // Added type button to prevent accidental form submits
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center gap-1 flex-1 transition-all ${
                isActive ? "text-yellow-500 scale-110" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}