// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Campaign.sol";
import "./DonationReceipt.sol";

/// @title CampaignFactory
/// @notice Deploys Campaign contracts and manages the DonationReceipt NFT registry.
///         Only the owner (Platform Owner wallet) can create campaigns.
///         Automatically grants new campaigns MINTER_ROLE on the shared NFT contract.
contract CampaignFactory is Ownable {

    DonationReceipt public immutable receiptContract;

    address[]                    public campaigns;
    mapping(string => address)   public campaignById;
    mapping(address => bool)     public isCampaign;
    mapping(address => string)   public campaignIdByAddress;

    event CampaignCreated(
        string  indexed campaignId,
        address indexed campaignAddress,
        address         operator,
        address         director,
        uint256         goalAmount,
        uint256         deadline
    );

    constructor(address admin) Ownable(admin) {
        // Deploy the shared DonationReceipt NFT contract.
        // Pass address(this) as minterAdmin so the factory can grant MINTER_ROLE
        // to new Campaign contracts without requiring a separate grantRole tx.
        receiptContract = new DonationReceipt(admin, address(this));
    }

    // ─── Campaign creation ────────────────────────────────────────────

    /// @notice Create a new fundraising campaign.
    /// @param campaignId    Unique human-readable ID (e.g. "camp-001-food-atlanta")
    /// @param metadataURI   URL to off-chain JSON with title, description, image
    /// @param goalAmount    Fundraising target in wei (MATIC)
    /// @param deadline      Unix timestamp when donations close
    /// @param operator      Wallet address of the Campaign Operator (NGO / org)
    /// @param director      Wallet address of the Independent Director
    function createCampaign(
        string  calldata campaignId,
        string  calldata metadataURI,
        uint256          goalAmount,
        uint256          deadline,
        address          operator,
        address          director
    ) external onlyOwner returns (address) {
        require(bytes(campaignId).length > 0,                "Factory: empty campaign ID");
        require(campaignById[campaignId] == address(0),      "Factory: campaign ID exists");
        require(goalAmount > 0,                              "Factory: zero goal");
        require(deadline > block.timestamp,                  "Factory: deadline in past");
        require(operator != address(0) && director != address(0), "Factory: zero address");

        Campaign campaign = new Campaign(
            campaignId,
            metadataURI,
            goalAmount,
            deadline,
            owner(),     // admin = factory owner
            operator,
            director,
            address(receiptContract)
        );

        address addr = address(campaign);

        // Allow this campaign to mint donation receipt NFTs
        receiptContract.grantRole(receiptContract.MINTER_ROLE(), addr);

        campaigns.push(addr);
        campaignById[campaignId]      = addr;
        campaignIdByAddress[addr]     = campaignId;
        isCampaign[addr]              = true;

        emit CampaignCreated(campaignId, addr, operator, director, goalAmount, deadline);

        return addr;
    }

    // ─── View helpers ─────────────────────────────────────────────────

    function getCampaignCount() external view returns (uint256) {
        return campaigns.length;
    }

    function getCampaigns() external view returns (address[] memory) {
        return campaigns;
    }

    /// @notice Return on-chain metadata for all campaigns in one call.
    function getCampaignSummaries() external view returns (
        address[] memory addrs,
        string[]  memory ids,
        uint256[] memory goals,
        uint256[] memory raised,
        uint256[] memory deadlines,
        bool[]    memory closed
    ) {
        uint256 len = campaigns.length;
        addrs     = new address[](len);
        ids       = new string[](len);
        goals     = new uint256[](len);
        raised    = new uint256[](len);
        deadlines = new uint256[](len);
        closed    = new bool[](len);

        for (uint256 i = 0; i < len; i++) {
            Campaign c = Campaign(payable(campaigns[i]));
            addrs[i]     = campaigns[i];
            ids[i]       = c.campaignId();
            goals[i]     = c.goalAmount();
            raised[i]    = c.totalRaised();
            deadlines[i] = c.deadline();
            closed[i]    = c.closed();
        }
    }
}
