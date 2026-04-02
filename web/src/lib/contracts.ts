/**
 * Contract ABIs and addresses for Child First Platform.
 *
 * Addresses are loaded from environment variables set after deployment.
 * ABIs contain only the functions/events used by the frontend.
 */

// ── Addresses ────────────────────────────────────────────────────────────────

export const FACTORY_ADDRESS =
  (process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS ?? "") as `0x${string}`;

export const RECEIPT_ADDRESS =
  (process.env.NEXT_PUBLIC_DONATION_RECEIPT_ADDRESS ?? "") as `0x${string}`;

// ── CampaignFactory ABI (subset) ─────────────────────────────────────────────

export const CAMPAIGN_FACTORY_ABI = [
  // read
  {
    name:    "getCampaignSummaries",
    type:    "function",
    stateMutability: "view",
    inputs:  [],
    outputs: [
      { name: "addrs",      type: "address[]" },
      { name: "ids",        type: "string[]"  },
      { name: "goals",      type: "uint256[]" },
      { name: "raised",     type: "uint256[]" },
      { name: "deadlines",  type: "uint256[]" },
      { name: "closed",     type: "bool[]"    },
    ],
  },
  {
    name:    "getCampaignCount",
    type:    "function",
    stateMutability: "view",
    inputs:  [],
    outputs: [{ type: "uint256" }],
  },
  {
    name:    "campaignById",
    type:    "function",
    stateMutability: "view",
    inputs:  [{ name: "campaignId", type: "string" }],
    outputs: [{ type: "address" }],
  },
  {
    name:    "isCampaign",
    type:    "function",
    stateMutability: "view",
    inputs:  [{ name: "addr", type: "address" }],
    outputs: [{ type: "bool" }],
  },
  // write (owner only — called from admin UI)
  {
    name:    "createCampaign",
    type:    "function",
    stateMutability: "nonpayable",
    inputs:  [
      { name: "campaignId",   type: "string"  },
      { name: "metadataURI",  type: "string"  },
      { name: "goalAmount",   type: "uint256" },
      { name: "deadline",     type: "uint256" },
      { name: "operator",     type: "address" },
      { name: "director",     type: "address" },
    ],
    outputs: [{ type: "address" }],
  },
  // events
  {
    name: "CampaignCreated",
    type: "event",
    inputs: [
      { name: "campaignId",       type: "string",  indexed: true  },
      { name: "campaignAddress",  type: "address", indexed: true  },
      { name: "operator",         type: "address", indexed: false },
      { name: "director",         type: "address", indexed: false },
      { name: "goalAmount",       type: "uint256", indexed: false },
      { name: "deadline",         type: "uint256", indexed: false },
    ],
  },
] as const;

// ── Campaign ABI (subset) ─────────────────────────────────────────────────────

export const CAMPAIGN_ABI = [
  // reads
  { name: "campaignId",    type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "metadataURI",   type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "goalAmount",    type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "deadline",      type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "totalRaised",   type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "totalDisbursed",type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "closed",        type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "bool"    }] },
  { name: "availableFunds",type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    name: "donorTotals",
    type: "function", stateMutability: "view",
    inputs: [{ name: "donor", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "getMilestoneCount",
    type: "function", stateMutability: "view",
    inputs: [],    outputs: [{ type: "uint256" }],
  },
  {
    name: "getMilestone",
    type: "function", stateMutability: "view",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [{
      type: "tuple",
      components: [
        { name: "description",      type: "string"  },
        { name: "targetAmount",     type: "uint256" },
        { name: "recipient",        type: "address" },
        { name: "operatorApproved", type: "bool"    },
        { name: "directorApproved", type: "bool"    },
        { name: "disbursed",        type: "bool"    },
      ],
    }],
  },
  // writes
  {
    name: "donate",
    type: "function", stateMutability: "payable",
    inputs: [], outputs: [],
  },
  // events
  {
    name: "DonationReceived",
    type: "event",
    inputs: [
      { name: "donor",          type: "address", indexed: true  },
      { name: "amount",         type: "uint256", indexed: false },
      { name: "receiptTokenId", type: "uint256", indexed: false },
    ],
  },
  {
    name: "MilestoneDisbursed",
    type: "event",
    inputs: [
      { name: "index",     type: "uint256", indexed: true  },
      { name: "recipient", type: "address", indexed: true  },
      { name: "amount",    type: "uint256", indexed: false },
    ],
  },
] as const;

// ── DonationReceipt ABI (subset) ──────────────────────────────────────────────

export const RECEIPT_ABI = [
  {
    name: "balanceOf",
    type: "function", stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "tokenURI",
    type: "function", stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "string" }],
  },
  {
    name: "getReceiptData",
    type: "function", stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{
      type: "tuple",
      components: [
        { name: "campaignId", type: "string"  },
        { name: "amount",     type: "uint256" },
        { name: "timestamp",  type: "uint256" },
        { name: "donor",      type: "address" },
      ],
    }],
  },
  {
    name: "ReceiptMinted",
    type: "event",
    inputs: [
      { name: "tokenId",    type: "uint256", indexed: true  },
      { name: "donor",      type: "address", indexed: true  },
      { name: "campaignId", type: "string",  indexed: false },
      { name: "amount",     type: "uint256", indexed: false },
    ],
  },
] as const;
