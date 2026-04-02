// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title FaithBadge — Men of God Ministry Achievement NFT
/// @notice Soulbound (non-transferable) ERC-721 NFTs recognizing ministry milestones.
///         Minted on: member registration, tier promotion, mission completion, ordination, etc.
///         All metadata is stored fully on-chain. No IPFS dependency.
contract FaithBadge is ERC721Enumerable, AccessControl {
    using Strings for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Badge categories that represent significant spiritual and ministry milestones
    enum BadgeType {
        MEMBER,       // 0 — Joined Men of God community
        TITHER,       // 1 — Faithful tither (completed a tithe cycle)
        BUILDER,      // 2 — Completed a ministry mission
        MISSIONARY,   // 3 — Active field missionary
        ELDER,        // 4 — Promoted to Elder tier
        PROPHET,      // 5 — Promoted to Prophet tier
        APOSTLE,      // 6 — Promoted to Apostle tier
        ORDAINED,     // 7 — Ordained minister
        GUARDIAN,     // 8 — Child protection guardian (donated to Child First Platform)
        INTERCESSOR   // 9 — Answered 10+ prayer requests
    }

    struct BadgeData {
        BadgeType badgeType;
        uint256   issuedAt;
        address   recipient;
        string    label;      // Human-readable contextual label (e.g. mission name, campaign ID)
    }

    uint256 private _nextTokenId;

    mapping(uint256 => BadgeData) private _badges;
    mapping(address => mapping(BadgeType => bool)) public hasBadge; // one per type per address

    // Badge colors per type — used in on-chain SVG
    string[10] private _badgeColors = [
        "#3b82f6", // MEMBER      — blue
        "#f59e0b", // TITHER      — gold
        "#8b5cf6", // BUILDER     — purple
        "#10b981", // MISSIONARY  — emerald
        "#6366f1", // ELDER       — indigo
        "#a855f7", // PROPHET     — violet
        "#c9a84c", // APOSTLE     — deep gold
        "#ef4444", // ORDAINED    — red
        "#22c55e", // GUARDIAN    — green
        "#0ea5e9"  // INTERCESSOR — sky
    ];

    string[10] private _badgeNames = [
        "Member", "Faithful Tither", "Mission Builder", "Missionary",
        "Elder", "Prophet", "Apostle", "Ordained Minister", "Child Guardian", "Intercessor"
    ];

    string[10] private _badgeSymbols = [
        unicode"✝", unicode"₿", unicode"⚒", unicode"✈",
        unicode"★", unicode"◈", unicode"✦", unicode"⚜", unicode"❤", unicode"🙏"
    ];

    event BadgeMinted(
        uint256   indexed tokenId,
        address   indexed recipient,
        BadgeType indexed badgeType,
        string    label
    );

    constructor(address admin) ERC721("Faith Badge", "FTHBDG") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    /// @notice Mint a FaithBadge to a recipient. One badge per type per address.
    /// @param to        Recipient address
    /// @param badgeType Badge category
    /// @param label     Contextual label (e.g. "Mission: Atlanta Food Drive 2026")
    function mintBadge(address to, BadgeType badgeType, string calldata label)
        external
        onlyRole(MINTER_ROLE)
        returns (uint256 tokenId)
    {
        require(to != address(0), "FaithBadge: zero address");
        require(!hasBadge[to][badgeType], "FaithBadge: already has this badge");

        tokenId = _nextTokenId++;
        _badges[tokenId] = BadgeData({
            badgeType:  badgeType,
            issuedAt:   block.timestamp,
            recipient:  to,
            label:      label
        });
        hasBadge[to][badgeType] = true;

        _safeMint(to, tokenId);
        emit BadgeMinted(tokenId, to, badgeType, label);
    }

    /// @notice Force re-mint if a badge was burned. Admin only.
    function remintBadge(address to, BadgeType badgeType, string calldata label)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (uint256 tokenId)
    {
        require(to != address(0), "FaithBadge: zero address");
        hasBadge[to][badgeType] = false; // reset so mintBadge works
        return this.mintBadge(to, badgeType, label);
    }

    /// @notice Retrieve badge data for a token.
    function badgeOf(uint256 tokenId) external view returns (BadgeData memory) {
        require(_ownerOf(tokenId) != address(0), "FaithBadge: nonexistent token");
        return _badges[tokenId];
    }

    /// @notice Return all badge token IDs held by an address.
    function badgesOf(address owner) external view returns (uint256[] memory) {
        uint256 count = balanceOf(owner);
        uint256[] memory ids = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            ids[i] = tokenOfOwnerByIndex(owner, i);
        }
        return ids;
    }

    // ─── On-chain SVG metadata ────────────────────────────────────────

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "FaithBadge: nonexistent token");
        BadgeData memory b = _badges[tokenId];
        uint256 typeIdx = uint256(b.badgeType);

        string memory svg = _buildSVG(typeIdx, b.label, tokenId);
        string memory json = string(abi.encodePacked(
            '{"name":"', _badgeNames[typeIdx], ' #', tokenId.toString(), '"',
            '"description":"Men of God FaithBadge - ', _badgeNames[typeIdx], '"',
            ',"attributes":[',
                '{"trait_type":"Badge Type","value":"', _badgeNames[typeIdx], '"},',
                '{"trait_type":"Soulbound","value":"true"},',
                '{"trait_type":"Issued","value":"', b.issuedAt.toString(), '"}',
            ']',
            ',"image":"data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '"}'
        ));
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    function _buildSVG(uint256 typeIdx, string memory label, uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        string memory color = _badgeColors[typeIdx];
        string memory symbol = _badgeSymbols[typeIdx];
        string memory name = _badgeNames[typeIdx];

        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">',
            '<defs><radialGradient id="bg" cx="50%" cy="50%">',
            '<stop offset="0%" stop-color="#1e293b"/>',
            '<stop offset="100%" stop-color="#0f172a"/>',
            '</radialGradient></defs>',
            '<rect width="300" height="300" rx="16" fill="url(#bg)" stroke="', color, '" stroke-width="2"/>',
            '<circle cx="150" cy="90" r="48" fill="none" stroke="', color, '" stroke-width="2" opacity="0.4"/>',
            '<circle cx="150" cy="90" r="36" fill="', color, '" opacity="0.15"/>',
            '<text x="150" y="102" text-anchor="middle" font-size="32" fill="', color, '">', symbol, '</text>',
            '<text x="150" y="158" text-anchor="middle" font-size="15" fill="#f1f5f9" font-family="sans-serif">', name, '</text>',
            '<text x="150" y="180" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="sans-serif">Men of God Platform</text>',
            '<line x1="40" y1="196" x2="260" y2="196" stroke="', color, '" stroke-width="0.5" opacity="0.4"/>',
            '<text x="150" y="218" text-anchor="middle" font-size="8" fill="#64748b" font-family="sans-serif">', _truncate(label, 36), '</text>',
            '<text x="150" y="268" text-anchor="middle" font-size="8" fill="#334155" font-family="sans-serif">Token #', tokenId.toString(), ' | Soulbound | Polygon</text>',
            '</svg>'
        ));
    }

    function _truncate(string memory s, uint256 maxLen) internal pure returns (string memory) {
        bytes memory b = bytes(s);
        if (b.length <= maxLen) return s;
        bytes memory out = new bytes(maxLen);
        for (uint256 i = 0; i < maxLen; i++) out[i] = b[i];
        return string(out);
    }

    // ─── Soulbound: block all transfers ──────────────────────────────

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721Enumerable)
        returns (address)
    {
        address from = _ownerOf(tokenId);
        // Allow minting (from == 0) and burning (to == 0), block transfers
        require(from == address(0) || to == address(0), "FaithBadge: soulbound - non-transferable");
        return super._update(to, tokenId, auth);
    }

    // ─── Interface support ────────────────────────────────────────────

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
