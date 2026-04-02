import type { Metadata } from "next";
import "./globals.css";
import { Providers }   from "@/components/providers";
import { Navigation }  from "@/components/Navigation";

export const metadata: Metadata = {
  title:       "Child First Platform",
  description: "Transparent, accountable fundraising for children. Every donation on-chain. Every disbursement dual-approved.",
  openGraph: {
    title:       "Child First Platform",
    description: "Donate MATIC. Receive an NFT receipt. Watch funds reach children through verifiable milestones.",
    type:        "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-gray-900 text-gray-400 text-sm py-10 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <p className="text-white font-bold text-base mb-1">Child First Platform</p>
                <p className="text-xs">Transparent charitable fundraising on Polygon.</p>
              </div>
              <div className="text-xs space-y-1">
                <p>Smart contracts audited &bull; 0% admin fees</p>
                <p>All donations recorded on-chain forever.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
