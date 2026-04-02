import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">

        <div className="inline-block bg-blue-500 bg-opacity-40 text-blue-100 text-sm font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide">
          BUILT ON POLYGON &bull; FULLY ON-CHAIN
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Every child deserves a meal.
          <br />
          <span className="text-blue-200">Every dollar is traceable.</span>
        </h1>

        <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
          Donate with your crypto wallet. Receive a permanent NFT receipt.
          Watch your funds reach children through milestone-verified disbursements —
          every step recorded on-chain forever.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/campaigns"
            className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition shadow-lg text-lg"
          >
            Browse Campaigns
          </Link>
          <Link
            href="/about"
            className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-blue-700 transition text-lg"
          >
            How It Works
          </Link>
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-center">
          {[
            { stat: "0%",    label: "Admin fee fraud risk",  sub: "Smart contracts enforce every rule"  },
            { stat: "100%",  label: "On-chain transparency", sub: "Every donation verifiable forever"    },
            { stat: "2-sig", label: "Dual-approval disburse",sub: "Both operator + director must sign"  },
          ].map((item) => (
            <div key={item.stat} className="bg-white bg-opacity-10 rounded-2xl p-6">
              <div className="text-3xl font-black text-white mb-1">{item.stat}</div>
              <div className="text-blue-100 font-semibold text-sm mb-1">{item.label}</div>
              <div className="text-blue-200 text-xs">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
