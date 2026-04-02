"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg">
            <span className="text-blue-600 text-2xl">&#9733;</span>
            Child First
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/campaigns" className="hover:text-blue-600 transition-colors">
              Campaigns
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              How It Works
            </Link>
            <Link href="/transparency" className="hover:text-blue-600 transition-colors">
              Transparency
            </Link>
          </div>

          {/* Wallet */}
          <ConnectButton
            label="Connect Wallet"
            showBalance={false}
            chainStatus="icon"
            accountStatus="avatar"
          />
        </div>
      </div>
    </nav>
  );
}
