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

// ── MOG Ecosystem Addresses ───────────────────────────────────────────────────

export const MOG_TOKEN_ADDRESS =
  (process.env.NEXT_PUBLIC_MOG_TOKEN_ADDRESS ?? "0x1Bb149A1e5d858081dc2EAb714069194521Ef0C5") as `0x${string}`;

export const FAITH_BADGE_ADDRESS =
  (process.env.NEXT_PUBLIC_FAITH_BADGE_ADDRESS ?? "0xeE4dFE543f948bb4fa316c361cfa5B5433215BdF") as `0x${string}`;

export const PRAYER_WALL_ADDRESS =
  (process.env.NEXT_PUBLIC_PRAYER_WALL_ADDRESS ?? "0x79110B6cC743c3000829457a0201077aAca82d08") as `0x${string}`;

export const TITHING_VAULT_ADDRESS =
  (process.env.NEXT_PUBLIC_TITHING_VAULT_ADDRESS ?? "0xD4A6382cFA89b8Aa82D5c23eC3280FA6082f64EF") as `0x${string}`;

export const MOG_REGISTRY_ADDRESS =
  (process.env.NEXT_PUBLIC_MOG_REGISTRY_ADDRESS ?? "0xD8544885f6dbA51834dE5F8D93935a1e6Aa30A4F") as `0x${string}`;

export const MOG_TIMELOCK_ADDRESS =
  (process.env.NEXT_PUBLIC_MOG_TIMELOCK_ADDRESS ?? "0xA937444bD799Ab6a16BFF9c3e9048473BB31959B") as `0x${string}`;

export const MOG_GOVERNOR_ADDRESS =
  (process.env.NEXT_PUBLIC_MOG_GOVERNOR_ADDRESS ?? "0xca9E53610B50509D44923C78cf51AE3caC844D92") as `0x${string}`;

export const MISSION_FACTORY_ADDRESS =
  (process.env.NEXT_PUBLIC_MISSION_FACTORY_ADDRESS ?? "0x617C11FaBe683D2047Ade9E7CbD2150dD176867E") as `0x${string}`;

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
    // ERC721Enumerable — iterate tokens owned by a wallet
    name: "tokenOfOwnerByIndex",
    type: "function", stateMutability: "view",
    inputs: [
      { name: "owner", type: "address"  },
      { name: "index", type: "uint256"  },
    ],
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

// ── MOGToken ABI (subset) ─────────────────────────────────────────────────────

export const MOG_TOKEN_ABI = [
  { name: "name",        type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "symbol",      type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "decimals",    type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8"  }] },
  { name: "totalSupply", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "MAX_SUPPLY",  type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    name: "balanceOf",
    type: "function", stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "getVotes",
    type: "function", stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "TokensMinted",
    type: "event",
    inputs: [
      { name: "to",     type: "address", indexed: true  },
      { name: "amount", type: "uint256", indexed: false },
      { name: "reason", type: "string",  indexed: false },
    ],
  },
] as const;

// ── MOGRegistry ABI (subset) ─────────────────────────────────────────────────

export const MOG_REGISTRY_ABI = [
  {
    name: "memberCount",
    type: "function", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint256" }],
  },
  {
    name: "isMember",
    type: "function", stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "members",
    type: "function", stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{
      type: "tuple",
      components: [
        { name: "wallet",       type: "address" },
        { name: "name",         type: "string"  },
        { name: "denomination", type: "string"  },
        { name: "region",       type: "string"  },
        { name: "ministryType", type: "string"  },
        { name: "tier",         type: "uint8"   },
        { name: "registeredAt", type: "uint256" },
        { name: "promotedAt",   type: "uint256" },
        { name: "active",       type: "bool"    },
      ],
    }],
  },
  {
    name: "register",
    type: "function", stateMutability: "nonpayable",
    inputs: [
      { name: "name",         type: "string" },
      { name: "denomination", type: "string" },
      { name: "region",       type: "string" },
      { name: "ministryType", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "MemberRegistered",
    type: "event",
    inputs: [
      { name: "wallet",       type: "address", indexed: true  },
      { name: "name",         type: "string",  indexed: false },
      { name: "denomination", type: "string",  indexed: false },
      { name: "region",       type: "string",  indexed: false },
    ],
  },
] as const;

// ── PrayerWall ABI (subset) ──────────────────────────────────────────────────

export const PRAYER_WALL_ABI = [
  {
    name: "prayerCount",
    type: "function", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint256" }],
  },
  {
    name: "prayers",
    type: "function", stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{
      type: "tuple",
      components: [
        { name: "submitter",        type: "address" },
        { name: "contentHash",      type: "bytes32" },
        { name: "subject",          type: "string"  },
        { name: "category",         type: "uint8"   },
        { name: "status",           type: "uint8"   },
        { name: "submittedAt",      type: "uint256" },
        { name: "expiresAt",        type: "uint256" },
        { name: "intercessionCount",type: "uint256" },
      ],
    }],
  },
  {
    name: "getActivePrayers",
    type: "function", stateMutability: "view",
    inputs: [
      { name: "offset", type: "uint256" },
      { name: "limit",  type: "uint256" },
    ],
    outputs: [{ name: "ids", type: "uint256[]" }],
  },
  {
    name: "hasInterceded",
    type: "function", stateMutability: "view",
    inputs: [
      { name: "", type: "uint256" },
      { name: "", type: "address" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    name: "submitPrayer",
    type: "function", stateMutability: "nonpayable",
    inputs: [
      { name: "contentHash", type: "bytes32" },
      { name: "subject",     type: "string"  },
      { name: "category",    type: "uint8"   },
      { name: "daysOpen",    type: "uint256" },
    ],
    outputs: [{ name: "prayerId", type: "uint256" }],
  },
  {
    name: "intercede",
    type: "function", stateMutability: "nonpayable",
    inputs: [{ name: "prayerId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "markAnswered",
    type: "function", stateMutability: "nonpayable",
    inputs: [{ name: "prayerId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "PrayerSubmitted",
    type: "event",
    inputs: [
      { name: "prayerId",  type: "uint256", indexed: true  },
      { name: "submitter", type: "address", indexed: true  },
      { name: "category",  type: "uint8",   indexed: false },
      { name: "subject",   type: "string",  indexed: false },
    ],
  },
  {
    name: "PrayerIntercession",
    type: "event",
    inputs: [
      { name: "prayerId",    type: "uint256", indexed: true  },
      { name: "intercessor", type: "address", indexed: true  },
      { name: "total",       type: "uint256", indexed: false },
    ],
  },
] as const;

// ── TithingVault ABI (subset) ────────────────────────────────────────────────

export const TITHING_VAULT_ABI = [
  {
    name: "contribute",
    type: "function", stateMutability: "payable",
    inputs: [
      { name: "ctype", type: "uint8"  },
      { name: "note",  type: "string" },
    ],
    outputs: [],
  },
  {
    name: "totalTithedBy",
    type: "function", stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "ContributionReceived",
    type: "event",
    inputs: [
      { name: "id",          type: "uint256", indexed: true  },
      { name: "contributor", type: "address", indexed: true  },
      { name: "amount",      type: "uint256", indexed: false },
      { name: "ctype",       type: "uint8",   indexed: false },
      { name: "fiscalYear",  type: "uint256", indexed: false },
    ],
  },
] as const;

// ── MissionFactory ABI (subset) ──────────────────────────────────────────────

export const MISSION_FACTORY_ABI = [
  {
    name: "missions",
    type: "function", stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    name: "missionById",
    type: "function", stateMutability: "view",
    inputs: [{ name: "", type: "string" }],
    outputs: [{ type: "address" }],
  },
  {
    name: "isMission",
    type: "function", stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "MissionCreated",
    type: "event",
    inputs: [
      { name: "missionId",      type: "string",  indexed: true  },
      { name: "missionAddress", type: "address", indexed: true  },
      { name: "creator",        type: "address", indexed: true  },
      { name: "category",       type: "uint8",   indexed: false },
      { name: "goalAmount",     type: "uint256", indexed: false },
      { name: "deadline",       type: "uint256", indexed: false },
    ],
  },
] as const;

// ── MOGGovernor ABI (subset) ─────────────────────────────────────────────────

export const MOG_GOVERNOR_ABI = [
  {
    name: "name",
    type: "function", stateMutability: "view",
    inputs: [], outputs: [{ type: "string" }],
  },
  {
    name: "proposalCount",
    type: "function", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint256" }],
  },
  {
    name: "votingDelay",
    type: "function", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint256" }],
  },
  {
    name: "votingPeriod",
    type: "function", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint256" }],
  },
  {
    name: "proposalThreshold",
    type: "function", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint256" }],
  },
  {
    name: "quorumNumerator",
    type: "function", stateMutability: "view",
    inputs: [{ name: "blockNumber", type: "uint256" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "state",
    type: "function", stateMutability: "view",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [{ type: "uint8" }],
  },
  {
    name: "ProposalCreated",
    type: "event",
    inputs: [
      { name: "proposalId",  type: "uint256",   indexed: false },
      { name: "proposer",    type: "address",   indexed: false },
      { name: "targets",     type: "address[]", indexed: false },
      { name: "values",      type: "uint256[]", indexed: false },
      { name: "signatures",  type: "string[]",  indexed: false },
      { name: "calldatas",   type: "bytes[]",   indexed: false },
      { name: "voteStart",   type: "uint256",   indexed: false },
      { name: "voteEnd",     type: "uint256",   indexed: false },
      { name: "description", type: "string",    indexed: false },
    ],
  },
] as const;
