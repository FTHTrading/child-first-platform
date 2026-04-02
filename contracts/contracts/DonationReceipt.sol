// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title DonationReceipt
/// @notice ERC-721 NFT issued to every donor as proof of their charitable donation.
///         All metadata is stored fully on-chain — no IPFS dependency.
/// @dev Only addresses holding MINTER_ROLE (granted to Campaign contracts by the factory)
///      can mint receipts. Tokens are non-transferable (soulbound — see _update override).
contract DonationReceipt is ERC721Enumerable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 private _nextTokenId;

    struct ReceiptData {
        string  campaignId;
        uint256 amount;      // in wei (MATIC)
        uint256 timestamp;
        address donor;
    }

    mapping(uint256 => ReceiptData) private _receipts;

    event ReceiptMinted(
        uint256 indexed tokenId,
        address indexed donor,
        string campaignId,
        uint256 amount
    );

    constructor(address admin, address minterAdmin) ERC721("Child First Donation Receipt", "CFDR") {
        // admin    — platform owner (human), holds DEFAULT_ADMIN_ROLE for governance
        // minterAdmin — CampaignFactory address, also holds DEFAULT_ADMIN_ROLE so it
        //               can grant MINTER_ROLE to newly deployed Campaign contracts
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        if (minterAdmin != admin) {
            _grantRole(DEFAULT_ADMIN_ROLE, minterAdmin);
        }
    }

    /// @notice Mint a donation receipt NFT. Called by registered Campaign contracts only.
    function mintReceipt(
        address donor,
        string calldata campaignId,
        uint256 amount,
        uint256 timestamp
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(donor != address(0), "DonationReceipt: zero address donor");
        require(amount > 0, "DonationReceipt: zero amount");
        require(bytes(campaignId).length > 0, "DonationReceipt: empty campaign ID");

        uint256 tokenId = _nextTokenId++;

        _receipts[tokenId] = ReceiptData({
            campaignId: campaignId,
            amount:     amount,
            timestamp:  timestamp,
            donor:      donor
        });

        _safeMint(donor, tokenId);
        emit ReceiptMinted(tokenId, donor, campaignId, amount);

        return tokenId;
    }

    /// @notice Returns fully on-chain base64-encoded JSON metadata with embedded SVG.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        ReceiptData memory r = _receipts[tokenId];

        string memory svg  = _buildSVG(tokenId, r);
        string memory json = string(abi.encodePacked(
            '{"name":"Donation Receipt #', Strings.toString(tokenId), '",',
            '"description":"Official on-chain donation receipt - Child First Platform",',
            '"image":"data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '",',
            '"attributes":[',
              '{"trait_type":"Campaign","value":"',    r.campaignId, '"},',
              '{"trait_type":"Amount (wei)","value":"', Strings.toString(r.amount), '"},',
              '{"trait_type":"Timestamp","value":',    Strings.toString(r.timestamp), '}',
            ']}'
        ));

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }

    /// @notice Read the stored receipt data for any token.
    function getReceiptData(uint256 tokenId) external view returns (ReceiptData memory) {
        _requireOwned(tokenId);
        return _receipts[tokenId];
    }

    // ─── Soulbound: receipts cannot be transferred after minting ────────────
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721Enumerable) returns (address) {
        address from = _ownerOf(tokenId);
        // Allow minting (from == address(0)) but block transfers
        require(from == address(0), "DonationReceipt: non-transferable");
        return super._update(to, tokenId, auth);
    }

    // ─── ERC-165 ────────────────────────────────────────────────────────────
    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // ─── Internal SVG builder ────────────────────────────────────────────────
    function _buildSVG(uint256 tokenId, ReceiptData memory r)
        private pure
        returns (string memory)
    {
        uint256 maticWhole = r.amount / 1e18;
        uint256 maticFrac  = (r.amount % 1e18) / 1e14; // 4 decimal places

        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">',
            '<defs>',
              '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" style="stop-color:#0f172a"/>',
                '<stop offset="100%" style="stop-color:#1e293b"/>',
              '</linearGradient>',
            '</defs>',
            '<rect width="420" height="420" fill="url(#bg)" rx="24"/>',
            '<rect x="18" y="18" width="384" height="384" fill="none" stroke="#3b82f6" stroke-width="1.5" rx="16" opacity="0.6"/>',
            // Header
            '<text x="210" y="62" font-family="system-ui,sans-serif" font-size="13" fill="#3b82f6" text-anchor="middle" font-weight="700" letter-spacing="3">CHILD FIRST PLATFORM</text>',
            '<text x="210" y="84" font-family="system-ui,sans-serif" font-size="10" fill="#64748b" text-anchor="middle" letter-spacing="1">OFFICIAL DONATION RECEIPT</text>',
            '<line x1="40" y1="100" x2="380" y2="100" stroke="#334155" stroke-width="1"/>',
            // Amount
            '<text x="210" y="158" font-family="system-ui,sans-serif" font-size="42" fill="#f8fafc" text-anchor="middle" font-weight="800">',
              Strings.toString(maticWhole), '.', _padFrac(maticFrac),
            '</text>',
            '<text x="210" y="184" font-family="system-ui,sans-serif" font-size="14" fill="#3b82f6" text-anchor="middle" font-weight="600">MATIC DONATED</text>',
            '<line x1="40" y1="204" x2="380" y2="204" stroke="#334155" stroke-width="1"/>',
            // Fields
            '<text x="44" y="236" font-family="system-ui,sans-serif" font-size="10" fill="#64748b">CAMPAIGN</text>',
            '<text x="376" y="236" font-family="system-ui,sans-serif" font-size="10" fill="#e2e8f0" text-anchor="end">', _truncate(r.campaignId, 28), '</text>',
            '<text x="44" y="266" font-family="system-ui,sans-serif" font-size="10" fill="#64748b">RECEIPT #</text>',
            '<text x="376" y="266" font-family="system-ui,sans-serif" font-size="10" fill="#e2e8f0" text-anchor="end">', Strings.toString(tokenId), '</text>',
            '<text x="44" y="296" font-family="system-ui,sans-serif" font-size="10" fill="#64748b">BLOCK TIME</text>',
            '<text x="376" y="296" font-family="system-ui,sans-serif" font-size="10" fill="#e2e8f0" text-anchor="end">', Strings.toString(r.timestamp), '</text>',
            '<line x1="40" y1="316" x2="380" y2="316" stroke="#334155" stroke-width="1"/>',
            // Footer
            '<text x="210" y="348" font-family="system-ui,sans-serif" font-size="9" fill="#22c55e" text-anchor="middle">&#10003; VERIFIED ON-CHAIN | POLYGON NETWORK</text>',
            '<text x="210" y="368" font-family="system-ui,sans-serif" font-size="8" fill="#475569" text-anchor="middle">This NFT is your immutable proof of contribution.</text>',
            '<text x="210" y="386" font-family="system-ui,sans-serif" font-size="8" fill="#475569" text-anchor="middle">Non-transferable. Soulbound to your wallet.</text>',
            '</svg>'
        ));
    }

    function _padFrac(uint256 frac) private pure returns (string memory) {
        string memory s = Strings.toString(frac);
        if (frac < 10)   return string(abi.encodePacked("000", s));
        if (frac < 100)  return string(abi.encodePacked("00",  s));
        if (frac < 1000) return string(abi.encodePacked("0",   s));
        return s;
    }

    /// @dev Truncate a string to maxLen chars for SVG display.
    function _truncate(string memory s, uint256 maxLen) private pure returns (string memory) {
        bytes memory b = bytes(s);
        if (b.length <= maxLen) return s;
        bytes memory result = new bytes(maxLen);
        for (uint256 i = 0; i < maxLen; i++) result[i] = b[i];
        return string(result);
    }
}
