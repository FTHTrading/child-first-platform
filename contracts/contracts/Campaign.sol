// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

interface IDonationReceipt {
    function mintReceipt(
        address donor,
        string calldata campaignId,
        uint256 amount,
        uint256 timestamp
    ) external returns (uint256);
}

/// @title Campaign
/// @notice Single fundraising campaign contract.
///         - Accepts MATIC donations; mints a soulbound NFT receipt per donation.
///         - Milestone-based disbursement: both Operator AND Director must approve
///           before any funds leave the contract.
///         - Pausable by Director (emergency stop) or Admin.
///         - Deposits accumulate on-chain; pull payment pattern for disbursements.
contract Campaign is AccessControl, ReentrancyGuard, Pausable {

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant DIRECTOR_ROLE = keccak256("DIRECTOR_ROLE");

    // ─── Campaign metadata ─────────────────────────────────────────────
    string  public campaignId;
    string  public metadataURI;  // points to off-chain JSON (title, description, image)
    uint256 public goalAmount;   // in wei
    uint256 public immutable deadline;
    bool    public closed;

    // ─── Financials ────────────────────────────────────────────────────
    uint256 public totalRaised;
    uint256 public totalDisbursed;

    IDonationReceipt public immutable receiptContract;

    // ─── Milestone tracking ────────────────────────────────────────────
    struct Milestone {
        string          description;
        uint256         targetAmount;  // in wei
        address payable recipient;
        bool            operatorApproved;
        bool            directorApproved;
        bool            disbursed;
    }

    Milestone[] private _milestones;

    // ─── Donor totals ─────────────────────────────────────────────────
    mapping(address => uint256) public donorTotals;

    // ─── Events ───────────────────────────────────────────────────────
    event DonationReceived(address indexed donor, uint256 amount, uint256 receiptTokenId);
    event MilestoneAdded(uint256 indexed index, string description, uint256 targetAmount, address recipient);
    event MilestoneApproved(uint256 indexed index, string role);
    event MilestoneDisbursed(uint256 indexed index, address indexed recipient, uint256 amount);
    event CampaignClosed(uint256 totalRaised, uint256 totalDisbursed);
    event MetadataUpdated(string newURI);

    // ─── Modifiers ───────────────────────────────────────────────────
    modifier notClosed() {
        require(!closed, "Campaign: closed");
        _;
    }

    // ─── Constructor ─────────────────────────────────────────────────
    constructor(
        string memory _campaignId,
        string memory _metadataURI,
        uint256       _goalAmount,
        uint256       _deadline,
        address       _admin,
        address       _operator,
        address       _director,
        address       _receiptContract
    ) {
        require(_deadline > block.timestamp,        "Campaign: deadline in past");
        require(_goalAmount > 0,                   "Campaign: zero goal");
        require(_receiptContract != address(0),    "Campaign: zero receipt contract");
        require(_operator != address(0),           "Campaign: zero operator");
        require(_director != address(0),           "Campaign: zero director");
        require(bytes(_campaignId).length > 0,     "Campaign: empty campaign ID");

        campaignId       = _campaignId;
        metadataURI      = _metadataURI;
        goalAmount       = _goalAmount;
        deadline         = _deadline;
        receiptContract  = IDonationReceipt(_receiptContract);

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(OPERATOR_ROLE,      _operator);
        _grantRole(DIRECTOR_ROLE,      _director);
    }

    // ─── Donation ─────────────────────────────────────────────────────

    /// @notice Donate MATIC to this campaign. Mints a soulbound NFT receipt to the sender.
    function donate() external payable nonReentrant whenNotPaused notClosed {
        require(block.timestamp < deadline, "Campaign: deadline passed");
        require(msg.value > 0,             "Campaign: zero donation");

        donorTotals[msg.sender] += msg.value;
        totalRaised             += msg.value;

        uint256 tokenId = receiptContract.mintReceipt(
            msg.sender,
            campaignId,
            msg.value,
            block.timestamp
        );

        emit DonationReceived(msg.sender, msg.value, tokenId);
    }

    // ─── Milestone management ─────────────────────────────────────────

    /// @notice Add a disbursement milestone. Operator only.
    function addMilestone(
        string calldata description,
        uint256         targetAmount,
        address payable recipient
    ) external onlyRole(OPERATOR_ROLE) notClosed {
        require(recipient   != address(0), "Campaign: zero recipient");
        require(targetAmount > 0,          "Campaign: zero target");
        require(
            targetAmount <= _availableFunds(),
            "Campaign: target exceeds available funds"
        );

        _milestones.push(Milestone({
            description:       description,
            targetAmount:      targetAmount,
            recipient:         recipient,
            operatorApproved:  false,
            directorApproved:  false,
            disbursed:         false
        }));

        emit MilestoneAdded(_milestones.length - 1, description, targetAmount, recipient);
    }

    /// @notice Operator signs off on a milestone.
    function operatorApproveMilestone(uint256 index) external onlyRole(OPERATOR_ROLE) notClosed {
        require(index < _milestones.length,   "Campaign: bad index");
        require(!_milestones[index].disbursed, "Campaign: already disbursed");
        _milestones[index].operatorApproved = true;
        emit MilestoneApproved(index, "OPERATOR");
    }

    /// @notice Independent Director signs off on a milestone.
    function directorApproveMilestone(uint256 index) external onlyRole(DIRECTOR_ROLE) notClosed {
        require(index < _milestones.length,   "Campaign: bad index");
        require(!_milestones[index].disbursed, "Campaign: already disbursed");
        _milestones[index].directorApproved = true;
        emit MilestoneApproved(index, "DIRECTOR");
    }

    /// @notice Execute a fully dual-approved milestone disbursement. Callable by anyone.
    ///         Uses pull pattern: state updated before transfer (CEI pattern).
    function disburseMilestone(uint256 index) external nonReentrant notClosed {
        require(index < _milestones.length, "Campaign: bad index");

        Milestone storage m = _milestones[index];
        require(!m.disbursed,          "Campaign: already disbursed");
        require(m.operatorApproved,    "Campaign: operator approval pending");
        require(m.directorApproved,    "Campaign: director approval pending");
        require(
            address(this).balance >= m.targetAmount,
            "Campaign: insufficient balance"
        );

        // State update before external call (CEI)
        m.disbursed      = true;
        totalDisbursed  += m.targetAmount;

        uint256 amount   = m.targetAmount;
        address payable  recipient = m.recipient;

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Campaign: transfer failed");

        emit MilestoneDisbursed(index, recipient, amount);
    }

    // ─── Admin controls ───────────────────────────────────────────────

    /// @notice Pause all donations. Director or Admin.
    function pause() external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
            hasRole(DIRECTOR_ROLE,      msg.sender),
            "Campaign: not authorized to pause"
        );
        _pause();
    }

    /// @notice Unpause. Admin only.
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /// @notice Mark campaign closed — no more donations. Admin only.
    function closeCampaign() external onlyRole(DEFAULT_ADMIN_ROLE) {
        closed = true;
        emit CampaignClosed(totalRaised, totalDisbursed);
    }

    /// @notice Update the off-chain metadata URI. Admin only.
    function updateMetadataURI(string calldata newURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        metadataURI = newURI;
        emit MetadataUpdated(newURI);
    }

    // ─── View helpers ─────────────────────────────────────────────────

    function getMilestoneCount() external view returns (uint256) {
        return _milestones.length;
    }

    function getMilestone(uint256 index) external view returns (Milestone memory) {
        require(index < _milestones.length, "Campaign: bad index");
        return _milestones[index];
    }

    function getAllMilestones() external view returns (Milestone[] memory) {
        return _milestones;
    }

    /// @notice Funds not committed to un-disbursed milestones.
    function availableFunds() external view returns (uint256) {
        return _availableFunds();
    }

    // ─── Internal ─────────────────────────────────────────────────────

    function _availableFunds() private view returns (uint256) {
        uint256 committed;
        for (uint256 i = 0; i < _milestones.length; i++) {
            if (!_milestones[i].disbursed) {
                committed += _milestones[i].targetAmount;
            }
        }
        uint256 bal = address(this).balance;
        return bal > committed ? bal - committed : 0;
    }

    /// @dev Block direct ETH sends — donors must call donate() for receipt minting.
    receive() external payable {
        revert("Campaign: use donate()");
    }

    fallback() external payable {
        revert("Campaign: use donate()");
    }
}
