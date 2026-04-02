"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygon } from "wagmi/chains";
import { http } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const alchemyRpc =
  process.env.NEXT_PUBLIC_POLYGON_RPC ||
  "https://polygon-bor-rpc.publicnode.com";

export const wagmiConfig = getDefaultConfig({
  appName:        "Child First Platform",
  appDescription: "Transparent, accountable fundraising for children who need us most.",
  appUrl:         "https://childfirst.mensofgod.com",
  appIcon:        "https://childfirst.mensofgod.com/icon.png",
  projectId,
  chains: [polygon],
  transports: {
    [polygon.id]: http(alchemyRpc),
  },
  ssr: true,
});
