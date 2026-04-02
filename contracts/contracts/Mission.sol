// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./FaithBadge.sol";

/// @title Mission — Individual Ministry Mission Vault
/// @notice A per-mission donation vault for Men of God ministry work.
///         Accepts MATIC/POL donations and releases funds through milestone-based dual-signature
///         authorization (OPERATOR_ROLE + DIRECTOR_ROLE). Non-milestone refunds require admin.
///         On mission completion the creator earns a BUILDER FaithBadge.
contract Mission is AccessControl, ReentrancyGuard {

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant DIRECTOR_ROLE = keccak256("DIRECTOR_ROLE");
    bytes32 public constant DONOR_ROLE    = keccak256("DONOR_ROLE");

    enum Category { FOOD, SHELTER, EDUCATION, EVANGELISM, MEDICAL, COMMUNITY, PRAYER, OTHER }
    enum MissionStatus { ACTIVE, COMPLETED, CANCELLED }

    struct Milestone {
        string  description;
        uint256 targetAmount;     // MATIC in wei needed to unlock this milestone
        bool    operatorApproved;
        bool    directorApproved;
        bool    disbursed;
    }

    // ─── Immutable mission params ──────────────────────────────────────

    string        public missionId;
    string        public metadataURI;   // Off-chain JSON: title, description, images
    Category      public category;
    uint256       public goalAmount;    // Total fundraising goal in wei
    uint256       public deadline;
    address       public creator;       // Mission creator — receives BUILDER badge on completion
    address       public operatorAddress; // Explicit operator wallet for fund disbursal

    FaithBadge    public immutable faithBadge;

    // ─── State ────────────────────────────────────────────────────────

    MissionStatus public status;
    uint256       public totalRaised;
    uint256       public totalDisbursed;

    Milestone[]   public milestones;

    mapping(address => uint256) public donorTotals;
    address[]                   private _donorList;
    mapping(address => bool)    private _isDonor;

    event DonationReceived(address indexed donor, uint256 amount, uint256 total);
    event MilestoneApproved(uint256 indexed milestoneId, address approver, string role);
    event MilestoneDisbursed(uint256 indexed milestoneId, address recipient, uint256 amount);
    event MissionCompleted(address indexed creator, uint256 totalRaised);
    event MissionCancelled(string reason);
    event RefundIssued(address indexed donor, uint256 amount);

    constructor(
        string memory  _missionId,
        string memory  _metadataURI,
        Category       _category,
        uint256        _goalAmount,
        uint256        _deadline,
        address        _admin,
        address        _operator,
        address        _director,
        address        _creator,
        address        _faithBadge
    ) {
        require(_goalAmount > 0,                    "Mission: zero goal");
        require(_deadline > block.timestamp,        "Mission: deadline in past");
        require(_operator != address(0),            "Mission: zero operator");
        require(_director != address(0),            "Mission: zero director");
        require(_creator  != address(0),            "Mission: zero creator");
        require(_faithBadge != address(0),          "Mission: zero faithBadge");

        missionId   = _missionId;
        metadataURI = _metadataURI;
        category    = _category;
        goalAmount  = _goalAmount;
        deadline    = _deadline;
        creator         = _creator;
        operatorAddress = _operator;
        faithBadge  = FaithBadge(_faithBadge);
        status      = MissionStatus.ACTIVE;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(OPERATOR_ROLE,      _operator);
        _grantRole(DIRECTOR_ROLE,      _director);
    }

    // ─── Donate ───────────────────────────────────────────────────────

    /// @notice Donate MATIC to this mission.
    function donate() external payable nonReentrant {
        require(status == MissionStatus.ACTIVE,   "Mission: not active");
        require(block.timestamp <= deadline,       "Mission: deadline passed");
        require(msg.value > 0,                    "Mission: zero donation");

        if (!_isDonor[msg.sender]) {
            _donorList.push(msg.sender);
            _isDonor[msg.sender] = true;
        }
        donorTotals[msg.sender] += msg.value;
        totalRaised             += msg.value;

        emit DonationReceived(msg.sender, msg.value, donorTotals[msg.sender]);
    }

    // ─── Milestones ───────────────────────────────────────────────────

    /// @notice Add a milestone (admin only, before any disbursals).
    function addMilestone(string calldata description, uint256 targetAmount)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(status == MissionStatus.ACTIVE, "Mission: not active");
        require(bytes(description).length > 0,  "Mission: empty description");
        require(targetAmount > 0,               "Mission: zero target");
        milestones.push(Milestone({
            description:      description,
            targetAmount:     targetAmount,
            operatorApproved: false,
            directorApproved: false,
            disbursed:        false
        }));
    }

    /// @notice Approve a milestone for disbursal (OPERATOR or DIRECTOR).
    function approveMilestone(uint256 milestoneId) external {
        require(milestoneId < milestones.length,          "Mission: invalid milestone");
        Milestone storage m = milestones[milestoneId];
        require(!m.disbursed,                              "Mission: already disbursed");
        require(address(this).balance >= m.targetAmount,  "Mission: insufficient funds");

        if (hasRole(OPERATOR_ROLE, msg.sender)) {
            require(!m.operatorApproved, "Mission: operator already approved");
            m.operatorApproved = true;
            emit MilestoneApproved(milestoneId, msg.sender, "OPERATOR");
        } else if (hasRole(DIRECTOR_ROLE, msg.sender)) {
            require(!m.directorApproved, "Mission: director already approved");
            m.directorApproved = true;
            emit MilestoneApproved(milestoneId, msg.sender, "DIRECTOR");
        } else {
            revert("Mission: not authorized");
        }

        // Both approvals in → disburse to operator
        if (m.operatorApproved && m.directorApproved) {
            _disburseMilestone(milestoneId, m);
        }
    }

    // ─── Complete / Cancel ────────────────────────────────────────────

    /// @notice Mark the mission as completed after all milestones are disbursed.
    function completeMission() external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(status == MissionStatus.ACTIVE, "Mission: not active");
        status = MissionStatus.COMPLETED;

        // Award BUILDER FaithBadge to the mission creator
        try faithBadge.mintBadge(
            creator,
            FaithBadge.BadgeType.BUILDER,
            string(abi.encodePacked("Mission Builder: ", missionId))
        ) {} catch {}

        emit MissionCompleted(creator, totalRaised);
    }

    function cancelMission(string calldata reason) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(status == MissionStatus.ACTIVE, "Mission: not active");
        require(bytes(reason).length > 0,        "Mission: empty reason");
        status = MissionStatus.CANCELLED;
        emit MissionCancelled(reason);
    }

    // ─── Emergency refund ─────────────────────────────────────────────

    /// @notice Refund a specific donor. Admin only. Used only if mission is cancelled.
    function refundDonor(address donor) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(status == MissionStatus.CANCELLED, "Mission: not cancelled");
        uint256 amount = donorTotals[donor];
        require(amount > 0,                        "Mission: nothing to refund");
        require(address(this).balance >= amount,   "Mission: insufficient balance");

        donorTotals[donor] = 0;
        (bool ok, ) = payable(donor).call{value: amount}("");
        require(ok, "Mission: refund transfer failed");
        emit RefundIssued(donor, amount);
    }

    // ─── Views ────────────────────────────────────────────────────────

    function milestoneCount() external view returns (uint256) { return milestones.length; }
    function getMilestone(uint256 id) external view returns (Milestone memory) {
        require(id < milestones.length, "Mission: invalid milestone");
        return milestones[id];
    }
    function getDonors() external view returns (address[] memory) { return _donorList; }
    function vaultBalance() external view returns (uint256) { return address(this).balance; }

    // ─── Internal ─────────────────────────────────────────────────────

    function _disburseMilestone(uint256 id, Milestone storage m) internal {
        uint256 amount = m.targetAmount;
        m.disbursed    = true;
        totalDisbursed += amount;

        (bool ok, ) = payable(operatorAddress).call{value: amount}("");
        require(ok, "Mission: disbursal failed");
        emit MilestoneDisbursed(id, operatorAddress, amount);
    }
}
