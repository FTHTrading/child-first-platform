// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MOGToken.sol";
import "./FaithBadge.sol";

/// @title MOGRegistry — On-Chain Men of God Member Registry
/// @notice Records verified members of the Men of God platform on Polygon.
///         Members can register with denomination, region, and ministry type.
///         A tiered system (MEMBER → ELDER → PROPHET → APOSTLE) recognizes spiritual authority.
///         Tier promotions automatically issue FaithBadge NFTs and MOG token rewards.
contract MOGRegistry is AccessControl, ReentrancyGuard {

    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    bytes32 public constant PROMOTER_ROLE  = keccak256("PROMOTER_ROLE");

    MOGToken   public immutable mogToken;
    FaithBadge public immutable faithBadge;

    enum Tier { MEMBER, ELDER, PROPHET, APOSTLE }

    struct Member {
        address wallet;
        string  name;           // Public name or ministry name
        string  denomination;   // e.g. "Baptist", "Pentecostal", "Non-denominational"
        string  region;         // e.g. "Southeast US", "West Africa", "Latin America"
        string  ministryType;   // e.g. "Evangelism", "Youth", "Food Ministry", "Prayer"
        Tier    tier;
        uint256 registeredAt;
        uint256 promotedAt;
        bool    active;
    }

    uint256 public memberCount;
    mapping(address => Member)  public members;
    mapping(address => bool)    public isMember;
    address[]                   private _memberList;

    // MOG rewards per action
    uint256 public constant REGISTRATION_REWARD = 100 * 10 ** 18;   // 100 MOG
    uint256 public constant ELDER_REWARD         = 500 * 10 ** 18;   // 500 MOG
    uint256 public constant PROPHET_REWARD       = 1000 * 10 ** 18;  // 1,000 MOG
    uint256 public constant APOSTLE_REWARD       = 2500 * 10 ** 18;  // 2,500 MOG

    event MemberRegistered(address indexed wallet, string name, string denomination, string region);
    event MemberPromoted(address indexed wallet, Tier oldTier, Tier newTier);
    event MemberDeactivated(address indexed wallet, string reason);
    event MemberReactivated(address indexed wallet);

    constructor(address admin, address mogTokenAddr, address faithBadgeAddr) {
        require(mogTokenAddr  != address(0), "MOGRegistry: zero mogToken");
        require(faithBadgeAddr != address(0), "MOGRegistry: zero faithBadge");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRAR_ROLE,     admin);
        _grantRole(PROMOTER_ROLE,      admin);

        mogToken   = MOGToken(mogTokenAddr);
        faithBadge = FaithBadge(faithBadgeAddr);
    }

    // ─── Registration ─────────────────────────────────────────────────

    /// @notice Self-register as a Men of God member.
    function register(
        string calldata name,
        string calldata denomination,
        string calldata region,
        string calldata ministryType
    ) external nonReentrant {
        require(!isMember[msg.sender],         "MOGRegistry: already registered");
        require(bytes(name).length > 0,        "MOGRegistry: empty name");
        require(bytes(denomination).length > 0,"MOGRegistry: empty denomination");
        require(bytes(region).length > 0,      "MOGRegistry: empty region");

        members[msg.sender] = Member({
            wallet:       msg.sender,
            name:         name,
            denomination: denomination,
            region:       region,
            ministryType: ministryType,
            tier:         Tier.MEMBER,
            registeredAt: block.timestamp,
            promotedAt:   block.timestamp,
            active:       true
        });
        isMember[msg.sender] = true;
        _memberList.push(msg.sender);
        memberCount++;

        // Issue registration MOG reward
        _tryMintMOG(msg.sender, REGISTRATION_REWARD, "Member registration reward");

        // Issue MEMBER FaithBadge
        _tryMintBadge(msg.sender, FaithBadge.BadgeType.MEMBER,
            string(abi.encodePacked("MOG Member: ", name)));

        emit MemberRegistered(msg.sender, name, denomination, region);
    }

    /// @notice Admin-register a member on behalf of another wallet (e.g. onboarding).
    function registerFor(
        address wallet,
        string calldata name,
        string calldata denomination,
        string calldata region,
        string calldata ministryType
    ) external onlyRole(REGISTRAR_ROLE) nonReentrant {
        require(wallet != address(0),           "MOGRegistry: zero address");
        require(!isMember[wallet],              "MOGRegistry: already registered");
        require(bytes(name).length > 0,         "MOGRegistry: empty name");

        members[wallet] = Member({
            wallet:       wallet,
            name:         name,
            denomination: denomination,
            region:       region,
            ministryType: ministryType,
            tier:         Tier.MEMBER,
            registeredAt: block.timestamp,
            promotedAt:   block.timestamp,
            active:       true
        });
        isMember[wallet] = true;
        _memberList.push(wallet);
        memberCount++;

        _tryMintMOG(wallet, REGISTRATION_REWARD, "Member registration reward");
        _tryMintBadge(wallet, FaithBadge.BadgeType.MEMBER,
            string(abi.encodePacked("MOG Member: ", name)));

        emit MemberRegistered(wallet, name, denomination, region);
    }

    // ─── Tier promotion ───────────────────────────────────────────────

    /// @notice Promote a member to the next tier. Requires PROMOTER_ROLE.
    function promote(address wallet) external onlyRole(PROMOTER_ROLE) {
        require(isMember[wallet],          "MOGRegistry: not a member");
        Member storage m = members[wallet];
        require(m.active,                  "MOGRegistry: member not active");
        require(m.tier != Tier.APOSTLE,    "MOGRegistry: already at highest tier");

        Tier oldTier = m.tier;
        Tier newTier = Tier(uint256(m.tier) + 1);
        m.tier       = newTier;
        m.promotedAt = block.timestamp;

        // Tier-specific rewards and badges
        if (newTier == Tier.ELDER) {
            _tryMintMOG(wallet, ELDER_REWARD, "Promoted to Elder");
            _tryMintBadge(wallet, FaithBadge.BadgeType.ELDER,
                string(abi.encodePacked("Elder: ", m.name)));
        } else if (newTier == Tier.PROPHET) {
            _tryMintMOG(wallet, PROPHET_REWARD, "Promoted to Prophet");
            _tryMintBadge(wallet, FaithBadge.BadgeType.PROPHET,
                string(abi.encodePacked("Prophet: ", m.name)));
        } else if (newTier == Tier.APOSTLE) {
            _tryMintMOG(wallet, APOSTLE_REWARD, "Promoted to Apostle");
            _tryMintBadge(wallet, FaithBadge.BadgeType.APOSTLE,
                string(abi.encodePacked("Apostle: ", m.name)));
        }

        emit MemberPromoted(wallet, oldTier, newTier);
    }

    // ─── Administration ───────────────────────────────────────────────

    function deactivate(address wallet, string calldata reason) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(isMember[wallet],  "MOGRegistry: not a member");
        members[wallet].active = false;
        emit MemberDeactivated(wallet, reason);
    }

    function reactivate(address wallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(isMember[wallet],  "MOGRegistry: not a member");
        members[wallet].active = true;
        emit MemberReactivated(wallet);
    }

    // ─── Views ────────────────────────────────────────────────────────

    function getMember(address wallet) external view returns (Member memory) {
        require(isMember[wallet], "MOGRegistry: not a member");
        return members[wallet];
    }

    function getAllMembers() external view returns (address[] memory) {
        return _memberList;
    }

    function tierOf(address wallet) external view returns (Tier) {
        require(isMember[wallet], "MOGRegistry: not a member");
        return members[wallet].tier;
    }

    function isActiveMember(address wallet) external view returns (bool) {
        return isMember[wallet] && members[wallet].active;
    }

    // ─── Internal helpers ─────────────────────────────────────────────

    /// @dev Attempt MOG mint — silently skips if token contract lacks minter permission or cap hit
    function _tryMintMOG(address to, uint256 amount, string memory reason) internal {
        try mogToken.mint(to, amount, reason) {} catch {}
    }

    /// @dev Attempt FaithBadge mint — silently skips if already has badge or lacks minter role
    function _tryMintBadge(address to, FaithBadge.BadgeType badgeType, string memory label) internal {
        try faithBadge.mintBadge(to, badgeType, label) {} catch {}
    }
}
