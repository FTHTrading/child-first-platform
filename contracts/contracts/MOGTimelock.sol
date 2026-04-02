// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/// @title MOGTimelock — Men of God DAO Execution Timelock
/// @notice All governance-approved proposals are queued here before execution.
///         Minimum delay: 2 days. Gives the community time to react before changes take effect.
///         Proposers: MOGGovernor (set after deployment via grantRole)
///         Executors: anyone (address(0) = open execution after delay passes)
///         Admin:     deployer (should renounce after MOGGovernor is set up)
contract MOGTimelock is TimelockController {

    /// @param minDelay      Minimum time before a queued proposal can execute (e.g. 2 days)
    /// @param proposers     Initial proposer addresses (typically [] — set after governor deploy)
    /// @param executors     Executor addresses (use [address(0)] for open execution)
    /// @param admin         Initial admin (deployer) — should be renounced post-setup
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    )
        TimelockController(minDelay, proposers, executors, admin)
    {}
}
