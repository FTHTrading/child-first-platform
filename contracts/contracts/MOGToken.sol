// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Nonces.sol";

/// @title MOGToken — Men of God Platform Governance & Reward Token
/// @notice ERC-20 token used for DAO governance, ministry rewards, and tithing incentives.
///         Supply is capped at 21,000,000 MOG (21M — a number of completion, like Scripture).
///         Earned through: donating, completing missions, registering as a member, tithe activity.
///         Compatible with OpenZeppelin Governor (ERC20Votes).
contract MOGToken is ERC20, ERC20Permit, ERC20Votes, AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public constant MAX_SUPPLY = 21_000_000 * 10 ** 18; // 21 million MOG

    event TokensMinted(address indexed to, uint256 amount, string reason);

    constructor(address admin) ERC20("Men of God Token", "MOG") ERC20Permit("Men of God Token") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);

        // Mint 1,000,000 MOG to admin for initial distribution and liquidity
        _mint(admin, 1_000_000 * 10 ** 18);
        emit TokensMinted(admin, 1_000_000 * 10 ** 18, "Genesis allocation");
    }

    /// @notice Mint new MOG tokens. Capped at MAX_SUPPLY.
    /// @param to     Recipient address
    /// @param amount Amount in wei (18 decimals)
    /// @param reason Human-readable mint reason for event log
    function mint(address to, uint256 amount, string calldata reason)
        external
        onlyRole(MINTER_ROLE)
    {
        require(to != address(0), "MOGToken: zero address");
        require(amount > 0, "MOGToken: zero amount");
        require(totalSupply() + amount <= MAX_SUPPLY, "MOGToken: cap exceeded");
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }

    // ─── Required overrides ───────────────────────────────────────────

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
