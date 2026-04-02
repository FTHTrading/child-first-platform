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
          <footer className="bg-gray-900 text-gray-400 text-sm py-14 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
                {/* Brand */}
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-white font-bold text-base mb-2">&#9733; Child First</p>
                  <p className="text-xs leading-relaxed">
                    Transparent, accountable charitable fundraising on Polygon. Every donation
                    on-chain. Every disbursement dual-approved.
                  </p>
                  <p className="mt-4 text-xs">
                    0% admin fees &bull; Soulbound NFT receipts &bull; Open-source contracts
                  </p>
                </div>

                {/* Platform */}
                <div>
                  <p className="text-white font-semibold text-xs uppercase tracking-widest mb-3">Platform</p>
                  <ul className="space-y-2 text-xs">
                    <li><a href="/campaigns"    className="hover:text-white transition-colors">All Campaigns</a></li>
                    <li><a href="/about"         className="hover:text-white transition-colors">How It Works</a></li>
                    <li><a href="/transparency"  className="hover:text-white transition-colors">Transparency Report</a></li>
                    <li><a href="/governance"    className="hover:text-white transition-colors">Governance</a></li>
                  </ul>
                </div>

                {/* Learn */}
                <div>
                  <p className="text-white font-semibold text-xs uppercase tracking-widest mb-3">Learn</p>
                  <ul className="space-y-2 text-xs">
                    <li><a href="/whitepaper"   className="hover:text-white transition-colors">Whitepaper</a></li>
                    <li><a href="/tokenomics"   className="hover:text-white transition-colors">Tokenomics</a></li>
                    <li>
                      <a
                        href="https://polygonscan.com/address/0x7868D0D5aD5DB9a462093D06cAE2e8c7D3Cbf386"
                        target="_blank" rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                      >
                        Factory Contract &#8599;
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://polygonscan.com/address/0x2Bd17aD3abE1783B2006B47A9d415457178C2422"
                        target="_blank" rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                      >
                        Receipt NFT Contract &#8599;
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <p className="text-white font-semibold text-xs uppercase tracking-widest mb-3">Legal &amp; Policy</p>
                  <ul className="space-y-2 text-xs">
                    <li><a href="/whitepaper#legal" className="hover:text-white transition-colors">Legal &amp; Compliance</a></li>
                    <li><a href="/whitepaper#risk"  className="hover:text-white transition-colors">Risk Factors</a></li>
                    <li>
                      <a
                        href="https://github.com/FTHTrading/child-first-platform"
                        target="_blank" rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                      >
                        GitHub (open-source) &#8599;
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs">
                <p>
                  &copy; {new Date().getFullYear()} Child First Platform. Smart contracts are open-source
                  under the MIT licence.
                </p>
                <p className="text-gray-600">
                  Polygon mainnet &bull; Chain ID 137 &bull; Not financial advice
                </p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
