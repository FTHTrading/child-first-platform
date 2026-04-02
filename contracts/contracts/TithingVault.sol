// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MOGToken.sol";
import "./FaithBadge.sol";

/// @title TithingVault — Men of God Transparent Tithe & Offering Ledger
/// @notice Accepts MATIC/POL tithes and offerings from members, records them on-chain,
///         and enables authorized distribution to approved ministry destinations.
///         Every dollar in and out is permanently recorded. No hidden flows.
///         Contributors earn MOG rewards and FaithBadge NFTs for faithful tithing.
contract TithingVault is AccessControl, ReentrancyGuard {

    bytes32 public constant OPERATOR_ROLE   = keccak256("OPERATOR_ROLE");
    bytes32 public constant DIRECTOR_ROLE   = keccak256("DIRECTOR_ROLE");

    MOGToken   public immutable mogToken;
    FaithBadge public immutable faithBadge;

    enum ContributionType { TITHE, OFFERING, MISSIONS, BUILDING_FUND, OTHER }

    struct Contribution {
        address          contributor;
        uint256          amount;      // in wei
        ContributionType ctype;
        string           note;        // optional memo (e.g. "First Fruits — April 2026")
        uint256          timestamp;
        uint256          fiscalYear;  // year of contribution (for annual tracking)
    }

    struct Distribution {
        address recipient;      // on-chain recipient (address(0) if off-chain)
        string  label;          // human-readable destination (e.g. "Atlanta Food Ministry")
        uint256 amount;
        string  purpose;
        uint256 timestamp;
        address approvedBy;
        bool    executed;
    }

    // Pending distribution requires both OPERATOR + DIRECTOR approval
    struct DistributionRequest {
        address recipient;
        string  label;
        uint256 amount;
        string  purpose;
        bool    operatorApproved;
        bool    directorApproved;
        bool    executed;
        bool    cancelled;
        uint256 createdAt;
    }

    Contribution[]         public contributions;
    Distribution[]         public distributions;
    DistributionRequest[]  public distributionRequests;

    mapping(address => uint256) public totalTithedBy;     // lifetime total per contributor
    mapping(address => mapping(uint256 => uint256)) public annualTithe; // addr => year => amount
    mapping(address => bool) public hasEarnedTitherBadge;

    // 10 MOG per MATIC donated — tithing reward rate
    uint256 public constant MOG_PER_MATIC = 10 * 10 ** 18; // 10 MOG per 1 MATIC (1e18 wei)

    event ContributionReceived(
        uint256 indexed id,
        address indexed contributor,
        uint256 amount,
        ContributionType ctype,
        uint256 fiscalYear
    );
    event DistributionRequested(uint256 indexed id, address recipient, string label, uint256 amount);
    event DistributionApproved(uint256 indexed id, address approver, string role);
    event DistributionExecuted(uint256 indexed id, address recipient, uint256 amount);
    event DistributionCancelled(uint256 indexed id);

    constructor(address admin, address mogTokenAddr, address faithBadgeAddr) {
        require(mogTokenAddr   != address(0), "TithingVault: zero mogToken");
        require(faithBadgeAddr != address(0), "TithingVault: zero faithBadge");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE,      admin);
        _grantRole(DIRECTOR_ROLE,      admin);

        mogToken   = MOGToken(mogTokenAddr);
        faithBadge = FaithBadge(faithBadgeAddr);
    }

    // ─── Receive contributions ────────────────────────────────────────

    /// @notice Contribute MATIC/POL as a tithe or offering.
    /// @param ctype Contribution type (TITHE, OFFERING, etc.)
    /// @param note  Optional memo for the contribution
    function contribute(ContributionType ctype, string calldata note)
        external
        payable
        nonReentrant
    {
        require(msg.value > 0, "TithingVault: zero contribution");

        uint256 year = _fiscalYear();
        uint256 id   = contributions.length;

        contributions.push(Contribution({
            contributor: msg.sender,
            amount:      msg.value,
            ctype:       ctype,
            note:        note,
            timestamp:   block.timestamp,
            fiscalYear:  year
        }));

        totalTithedBy[msg.sender] += msg.value;
        annualTithe[msg.sender][year] += msg.value;

        // MOG reward: proportional to contribution (10 MOG per MATIC)
        uint256 reward = (msg.value * MOG_PER_MATIC) / 1e18;
        if (reward > 0) {
            _tryMintMOG(msg.sender, reward, "Tithe/offering reward");
        }

        // First-time tither: issue TITHER FaithBadge
        if (!hasEarnedTitherBadge[msg.sender] && totalTithedBy[msg.sender] >= 0.1 ether) {
            hasEarnedTitherBadge[msg.sender] = true;
            _tryMintBadge(msg.sender, FaithBadge.BadgeType.TITHER, "Faithful Tither - Men of God");
        }

        emit ContributionReceived(id, msg.sender, msg.value, ctype, year);
    }

    // ─── Distribution (dual-sig) ──────────────────────────────────────

    /// @notice Request a distribution. Operator or Director can initiate.
    function requestDistribution(
        address recipient,
        string  calldata label,
        uint256 amount,
        string  calldata purpose
    ) external returns (uint256 id) {
        require(hasRole(OPERATOR_ROLE, msg.sender) || hasRole(DIRECTOR_ROLE, msg.sender),
            "TithingVault: not authorized");
        require(amount > 0,               "TithingVault: zero amount");
        require(amount <= address(this).balance, "TithingVault: insufficient balance");
        require(bytes(label).length > 0,  "TithingVault: empty label");
        require(bytes(purpose).length > 0,"TithingVault: empty purpose");

        id = distributionRequests.length;
        distributionRequests.push(DistributionRequest({
            recipient:         recipient,
            label:             label,
            amount:            amount,
            purpose:           purpose,
            operatorApproved:  hasRole(OPERATOR_ROLE, msg.sender),
            directorApproved:  hasRole(DIRECTOR_ROLE, msg.sender),
            executed:          false,
            cancelled:         false,
            createdAt:         block.timestamp
        }));

        emit DistributionRequested(id, recipient, label, amount);
    }

    /// @notice Approve a distribution request. Requires the other role from the requestor.
    function approveDistribution(uint256 id) external nonReentrant {
        require(id < distributionRequests.length,     "TithingVault: invalid id");
        DistributionRequest storage r = distributionRequests[id];
        require(!r.executed && !r.cancelled,           "TithingVault: not pending");

        if (hasRole(OPERATOR_ROLE, msg.sender)) {
            require(!r.operatorApproved, "TithingVault: already approved by operator");
            r.operatorApproved = true;
            emit DistributionApproved(id, msg.sender, "OPERATOR");
        } else if (hasRole(DIRECTOR_ROLE, msg.sender)) {
            require(!r.directorApproved, "TithingVault: already approved by director");
            r.directorApproved = true;
            emit DistributionApproved(id, msg.sender, "DIRECTOR");
        } else {
            revert("TithingVault: not authorized");
        }

        // Execute when both approvals are in
        if (r.operatorApproved && r.directorApproved) {
            _executeDistribution(id, r);
        }
    }

    function cancelDistribution(uint256 id) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(id < distributionRequests.length, "TithingVault: invalid id");
        DistributionRequest storage r = distributionRequests[id];
        require(!r.executed && !r.cancelled,       "TithingVault: not pending");
        r.cancelled = true;
        emit DistributionCancelled(id);
    }

    // ─── Views ────────────────────────────────────────────────────────

    function vaultBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function contributionCount() external view returns (uint256) {
        return contributions.length;
    }

    function distributionCount() external view returns (uint256) {
        return distributions.length;
    }

    function getContribution(uint256 id) external view returns (Contribution memory) {
        require(id < contributions.length, "TithingVault: invalid id");
        return contributions[id];
    }

    function getDistribution(uint256 id) external view returns (Distribution memory) {
        require(id < distributions.length, "TithingVault: invalid id");
        return distributions[id];
    }

    function getDistributionRequest(uint256 id) external view returns (DistributionRequest memory) {
        require(id < distributionRequests.length, "TithingVault: invalid id");
        return distributionRequests[id];
    }

    function _fiscalYear() internal view returns (uint256) {
        return 1970 + (block.timestamp / 365 days);
    }

    // ─── Internal ─────────────────────────────────────────────────────

    function _executeDistribution(uint256 id, DistributionRequest storage r) internal {
        require(address(this).balance >= r.amount, "TithingVault: balance dropped");

        uint256 distId = distributions.length;
        distributions.push(Distribution({
            recipient:  r.recipient,
            label:      r.label,
            amount:     r.amount,
            purpose:    r.purpose,
            timestamp:  block.timestamp,
            approvedBy: msg.sender,
            executed:   true
        }));

        r.executed = true;

        if (r.recipient != address(0)) {
            (bool ok, ) = payable(r.recipient).call{value: r.amount}("");
            require(ok, "TithingVault: transfer failed");
        }
        // If recipient is address(0), funds are logged as off-chain distribution (manual wire/cash)

        emit DistributionExecuted(distId, r.recipient, r.amount);
    }

    function _tryMintMOG(address to, uint256 amount, string memory reason) internal {
        try mogToken.mint(to, amount, reason) {} catch {}
    }

    function _tryMintBadge(address to, FaithBadge.BadgeType badgeType, string memory label) internal {
        try faithBadge.mintBadge(to, badgeType, label) {} catch {}
    }

    receive() external payable {
        // Direct sends are accepted but not tracked — use contribute() for proper accounting
    }
}
