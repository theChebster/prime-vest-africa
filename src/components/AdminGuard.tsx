"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define the shape of the props
interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userJson = localStorage.getItem("pv_user");
    if (!userJson) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userJson);
      // Bulletproof check for admin status
      if (user.is_admin === true || user.is_admin === "true" || user.is_admin === 1) {
        setAuthorized(true);
      } else {
        router.push("/dashboard");
      }
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-yellow-500 font-black uppercase tracking-widest">
        Verifying Security Clearance...
      </div>
    );
  }

  return <>{children}</>;
}