"use client"

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useAuthInit } from "@/hooks/useAuthInit";

export default function AuthSection() {
  const { user, isAuthenticated, signOut } = useAuthStore();
  const { isInitialized } = useAuthInit(); // Initialize auth state

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated && user ? (
        // User is logged in - show user info and logout
        <div className="flex items-center space-x-4">
          {/* User Profile Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
              {user.picture ? (
                <Image
                  src={user.picture}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border-2 border-gray-200"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
              <span className="font-medium">{user.name}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link href="/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                  Profilim
                </Link>
                <Link href="/derslerim" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                  Derslerim
                </Link>
                <Link href="/ayarlar" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                  Ayarlar
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // User is not logged in - show login/signup buttons
        <>
          <Link href="/giris">
            <Button variant="ghost" className="text-text hover:text-primary font-medium transition-colors">
              Giriş Yap
            </Button>
          </Link>
          <Link href="/kayit-ol">
            <Button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Üye Ol
            </Button>
          </Link>
        </>
      )}
    </div>
  );
} 