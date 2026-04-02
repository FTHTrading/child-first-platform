"use client";

import { useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const primaryLinks = [
  { href: "/campaigns",    label: "Campaigns" },
  { href: "/certificates", label: "Certificates" },
  { href: "/about",        label: "How It Works" },
  { href: "/transparency", label: "Transparency" },
];

const learnLinks = [
  { href: "/tokenomics",  label: "Tokenomics" },
  { href: "/governance",  label: "Governance" },
  { href: "/whitepaper",  label: "Whitepaper" },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [learnOpen,  setLearnOpen]  = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Child First" width={32} height={32} className="rounded-full" />
            Child First
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            {primaryLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-blue-600 transition-colors">
                {l.label}
              </Link>
            ))}

            {/* Learn dropdown */}
            <div className="relative">
              <button
                onClick={() => setLearnOpen((v) => !v)}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors focus:outline-none"
              >
                Learn
                <svg
                  className={`w-3 h-3 transition-transform ${learnOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {learnOpen && (
                <div
                  className="absolute top-8 right-0 bg-white border border-gray-200 rounded-xl shadow-lg w-44 py-2 z-50"
                  onMouseLeave={() => setLearnOpen(false)}
                >
                  {learnLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setLearnOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Wallet + mobile hamburger */}
          <div className="flex items-center gap-3">
            <ConnectButton
              label="Connect Wallet"
              showBalance={false}
              chainStatus="icon"
              accountStatus="avatar"
            />
            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {[...primaryLinks, ...learnLinks].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
