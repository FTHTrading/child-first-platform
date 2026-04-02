// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title PrayerWall — Men of God On-Chain Prayer Network
/// @notice Enables members to submit, intercede for, and mark answered prayers on-chain.
///         Prayer text is NEVER stored on-chain — only a keccak256 commitment hash is stored.
///         This preserves privacy while providing cryptographic proof of the prayer request.
///         Anyone can intercede; anyone can submit; only the submitter can mark answered.
contract PrayerWall is AccessControl, ReentrancyGuard {

    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");

    enum Category {
        HEALING,     // 0
        PROVISION,   // 1
        GUIDANCE,    // 2
        PROTECTION,  // 3
        SALVATION,   // 4
        PRAISE,      // 5
        FAMILY,      // 6
        MISSIONS,    // 7
        NATION,      // 8
        OTHER        // 9
    }

    enum PrayerStatus {
        ACTIVE,    // 0 — Open for intercession
        ANSWERED,  // 1 — Marked answered by submitter
        EXPIRED,   // 2 — Past expiry date
        REMOVED    // 3 — Moderator-removed (violates policy)
    }

    struct Prayer {
        address     submitter;
        bytes32     contentHash;    // keccak256 of prayer text — NOT stored plaintext
        string      subject;        // Short public subject (max 100 chars) — intentionally readable
        Category    category;
        PrayerStatus status;
        uint256     submittedAt;
        uint256     expiresAt;
        uint256     intercessionCount;
    }

    uint256 public prayerCount;
    mapping(uint256 => Prayer)            public prayers;
    mapping(uint256 => address[])         private _intercessors;   // who interceded
    mapping(uint256 => mapping(address => bool)) public hasInterceded;
    mapping(address => uint256)           public intercessionTotal; // total intercessions per member

    // Member with 10+ intercessions earns INTERCESSOR badge (tracked externally)
    uint256 public constant INTERCESSOR_THRESHOLD = 10;

    event PrayerSubmitted(uint256 indexed prayerId, address indexed submitter, Category category, string subject);
    event PrayerIntercession(uint256 indexed prayerId, address indexed intercessor, uint256 total);
    event PrayerAnswered(uint256 indexed prayerId, address indexed submitter);
    event PrayerRemoved(uint256 indexed prayerId, address indexed moderator, string reason);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MODERATOR_ROLE,     admin);
    }

    // ─── Submit ───────────────────────────────────────────────────────

    /// @notice Submit a prayer request.
    /// @param contentHash  keccak256 hash of the private prayer text (computed off-chain)
    /// @param subject      Short public subject (shown on prayer wall)
    /// @param category     Prayer category
    /// @param daysOpen     How many days to keep the prayer active (max 180)
    function submitPrayer(
        bytes32  contentHash,
        string   calldata subject,
        Category category,
        uint256  daysOpen
    ) external nonReentrant returns (uint256 prayerId) {
        require(contentHash != bytes32(0),        "PrayerWall: empty content hash");
        require(bytes(subject).length > 0,        "PrayerWall: empty subject");
        require(bytes(subject).length <= 100,     "PrayerWall: subject too long");
        require(daysOpen >= 1 && daysOpen <= 180, "PrayerWall: invalid duration");

        prayerId = prayerCount++;
        prayers[prayerId] = Prayer({
            submitter:        msg.sender,
            contentHash:      contentHash,
            subject:          subject,
            category:         category,
            status:           PrayerStatus.ACTIVE,
            submittedAt:      block.timestamp,
            expiresAt:        block.timestamp + (daysOpen * 1 days),
            intercessionCount: 0
        });

        emit PrayerSubmitted(prayerId, msg.sender, category, subject);
    }

    // ─── Intercede ────────────────────────────────────────────────────

    /// @notice Intercede for a prayer request.
    function intercede(uint256 prayerId) external nonReentrant {
        require(prayerId < prayerCount,               "PrayerWall: nonexistent prayer");
        Prayer storage p = prayers[prayerId];
        require(p.status == PrayerStatus.ACTIVE,      "PrayerWall: prayer not active");
        require(block.timestamp < p.expiresAt,        "PrayerWall: prayer expired");
        require(!hasInterceded[prayerId][msg.sender],  "PrayerWall: already interceded");
        require(p.submitter != msg.sender,             "PrayerWall: cannot self-intercede");

        hasInterceded[prayerId][msg.sender] = true;
        _intercessors[prayerId].push(msg.sender);
        p.intercessionCount++;
        intercessionTotal[msg.sender]++;

        emit PrayerIntercession(prayerId, msg.sender, p.intercessionCount);
    }

    // ─── Mark answered ────────────────────────────────────────────────

    /// @notice Mark a prayer as answered. Only by the original submitter.
    function markAnswered(uint256 prayerId) external {
        require(prayerId < prayerCount,          "PrayerWall: nonexistent prayer");
        Prayer storage p = prayers[prayerId];
        require(p.submitter == msg.sender,        "PrayerWall: not your prayer");
        require(p.status == PrayerStatus.ACTIVE,  "PrayerWall: prayer not active");

        p.status = PrayerStatus.ANSWERED;
        emit PrayerAnswered(prayerId, msg.sender);
    }

    // ─── Moderation ───────────────────────────────────────────────────

    function removePrayer(uint256 prayerId, string calldata reason)
        external
        onlyRole(MODERATOR_ROLE)
    {
        require(prayerId < prayerCount,    "PrayerWall: nonexistent prayer");
        require(bytes(reason).length > 0,  "PrayerWall: empty reason");
        prayers[prayerId].status = PrayerStatus.REMOVED;
        emit PrayerRemoved(prayerId, msg.sender, reason);
    }

    // ─── Views ────────────────────────────────────────────────────────

    function getPrayer(uint256 prayerId) external view returns (Prayer memory) {
        require(prayerId < prayerCount, "PrayerWall: nonexistent prayer");
        return prayers[prayerId];
    }

    function getIntercessors(uint256 prayerId) external view returns (address[] memory) {
        require(prayerId < prayerCount, "PrayerWall: nonexistent prayer");
        return _intercessors[prayerId];
    }

    /// @notice Return all active prayer IDs (up to `limit` starting from `offset`)
    function getActivePrayers(uint256 offset, uint256 limit)
        external
        view
        returns (uint256[] memory ids)
    {
        uint256 count = 0;
        uint256 total = prayerCount;
        uint256 end   = offset + limit > total ? total : offset + limit;

        // First pass: count
        for (uint256 i = offset; i < end; i++) {
            if (prayers[i].status == PrayerStatus.ACTIVE && block.timestamp < prayers[i].expiresAt) {
                count++;
            }
        }

        ids = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = offset; i < end; i++) {
            if (prayers[i].status == PrayerStatus.ACTIVE && block.timestamp < prayers[i].expiresAt) {
                ids[idx++] = i;
            }
        }
    }

    /// @notice Check if a member qualifies for the INTERCESSOR badge
    function isIntercessorEligible(address member) external view returns (bool) {
        return intercessionTotal[member] >= INTERCESSOR_THRESHOLD;
    }
}
