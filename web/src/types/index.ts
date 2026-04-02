export interface CampaignSummary {
  address:  string;
  id:       string;
  goal:     bigint;   // wei
  raised:   bigint;   // wei
  deadline: bigint;   // unix timestamp
  closed:   boolean;
}

export interface CampaignMeta {
  title:            string;
  description:      string;
  imageUrl?:        string;
  location?:        string;
  organizationName?: string;
}

export interface MilestoneData {
  description:      string;
  targetAmount:     bigint;
  recipient:        string;
  operatorApproved: boolean;
  directorApproved: boolean;
  disbursed:        boolean;
}

// DB-backed campaign (from API route)
export interface CampaignRecord extends CampaignMeta {
  campaignId:       string;
  contractAddress?: string;
  goalAmount:       string;   // MATIC as decimal string
  deadline:         string;   // ISO timestamp
  status:           "PENDING_REVIEW" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CLOSED";
  donationCount?:   number;
  createdAt:        string;
}
