// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Mission.sol";
import "./MOGRegistry.sol";
import "./FaithBadge.sol";

/// @title MissionFactory — Men of God Ministry Mission Deployer
/// @notice Deploys per-ministry Mission contracts for the Men of God platform.
///         Creators must be registered in MOGRegistry.
///         Each mission gets its own on-chain vault for transparent fund management.
///         The factory grants missions the ability to mint BUILDER FaithBadges on completion.
contract MissionFactory is AccessControl {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    MOGRegistry public immutable registry;
    FaithBadge  public immutable faithBadge;

    address[]                  public missions;
    mapping(string => address) public missionById;
    mapping(address => bool)   public isMission;
    mapping(address => string) public missionIdByAddress;

    event MissionCreated(
        string  indexed missionId,
        address indexed missionAddress,
        address indexed creator,
        Mission.Category category,
        uint256 goalAmount,
        uint256 deadline
    );

    constructor(address admin, address registryAddr, address faithBadgeAddr) {
        require(registryAddr   != address(0), "MissionFactory: zero registry");
        require(faithBadgeAddr != address(0), "MissionFactory: zero faithBadge");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE,         admin);

        registry   = MOGRegistry(registryAddr);
        faithBadge = FaithBadge(faithBadgeAddr);
    }

    /// @notice Deploy a new Mission contract.
    /// @param missionId    Unique ID (e.g. "mission-001-atlanta-food-2026")
    /// @param metadataURI  Off-chain JSON metadata URL
    /// @param category     Mission category (FOOD, SHELTER, EDUCATION, etc.)
    /// @param goalAmount   Funding goal in wei
    /// @param deadline     Unix timestamp for donation deadline
    /// @param operator     Wallet that receives disbursals and approves milestones
    /// @param director     Independent director wallet for dual-sig approval
    function createMission(
        string   calldata missionId,
        string   calldata metadataURI,
        Mission.Category  category,
        uint256           goalAmount,
        uint256           deadline,
        address           operator,
        address           director
    ) external returns (address) {
        // Creator must be a registered Men of God member
        require(registry.isActiveMember(msg.sender), "MissionFactory: creator not in MOGRegistry");
        require(bytes(missionId).length > 0,          "MissionFactory: empty mission ID");
        require(missionById[missionId] == address(0), "MissionFactory: mission ID exists");
        require(goalAmount > 0,                        "MissionFactory: zero goal");
        require(deadline > block.timestamp,            "MissionFactory: deadline in past");
        require(operator != address(0) && director != address(0), "MissionFactory: zero address");

        Mission mission = new Mission(
            missionId,
            metadataURI,
            category,
            goalAmount,
            deadline,
            address(this),  // factory is admin
            operator,
            director,
            msg.sender,     // creator (for BUILDER badge)
            address(faithBadge)
        );

        address addr = address(mission);

        // Grant the new mission MINTER_ROLE on FaithBadge so it can award BUILDER badges
        faithBadge.grantRole(faithBadge.MINTER_ROLE(), addr);

        missions.push(addr);
        missionById[missionId]      = addr;
        missionIdByAddress[addr]    = missionId;
        isMission[addr]             = true;

        emit MissionCreated(missionId, addr, msg.sender, category, goalAmount, deadline);
        return addr;
    }

    // ─── Admin controls ───────────────────────────────────────────────

    /// @notice Complete a mission (admin action). Awards BUILDER badge to creator.
    function completeMission(string calldata missionId) external onlyRole(ADMIN_ROLE) {
        address addr = missionById[missionId];
        require(addr != address(0), "MissionFactory: mission not found");
        Mission(payable(addr)).completeMission();
    }

    /// @notice Cancel a mission with a reason.
    function cancelMission(string calldata missionId, string calldata reason)
        external
        onlyRole(ADMIN_ROLE)
    {
        address addr = missionById[missionId];
        require(addr != address(0), "MissionFactory: mission not found");
        Mission(payable(addr)).cancelMission(reason);
    }

    // ─── Views ────────────────────────────────────────────────────────

    function missionCount() external view returns (uint256) { return missions.length; }

    function getAllMissions() external view returns (address[] memory) { return missions; }

    function getMission(string calldata missionId) external view returns (address) {
        return missionById[missionId];
    }
}
