"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  _id: string;
  username: string;
  name: string;
  profilePicture: string;
  bio: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_IP}/users/checkToken`,
          {
            credentials: "include",
          },
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error checking token:", err);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_IP}/users/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (response.ok) {
        setUser(null);
        router.push("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Blog
        </Link>
        <div className="flex gap-4 items-center">
          {loading ? (
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          ) : user ? (
            // User logged in
            <div className="flex items-center gap-4">
              <Image
                src={user.profilePicture}
                alt={user.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80"
                onClick={() => router.push("/userPanel")}
              />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            // Guest links
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
