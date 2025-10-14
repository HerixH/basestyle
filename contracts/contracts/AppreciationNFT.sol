// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AppreciationNFT
 * @dev NFT contract for Baselifestyle - Mint appreciation NFTs for posts
 */
contract AppreciationNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    // Mapping from token ID to post ID
    mapping(uint256 => string) public tokenToPost;
    
    // Mapping from token ID to appreciation data
    struct AppreciationData {
        string postId;
        address sender;
        address recipient;
        uint256 timestamp;
    }
    
    mapping(uint256 => AppreciationData) public appreciations;
    
    // Events
    event AppreciationMinted(
        uint256 indexed tokenId,
        string postId,
        address indexed sender,
        address indexed recipient,
        string tokenURI
    );

    constructor() ERC721("Baselifestyle Appreciation", "BAPP") Ownable(msg.sender) {}

    /**
     * @dev Mint an appreciation NFT
     * @param recipient Address to receive the NFT
     * @param postId ID of the post being appreciated
     * @param uri Metadata URI for the NFT
     */
    function mintAppreciation(
        address recipient,
        string memory postId,
        string memory uri
    ) public returns (uint256) {
        require(recipient != address(0), "Cannot mint to zero address");
        require(bytes(postId).length > 0, "Post ID required");
        require(bytes(uri).length > 0, "Token URI required");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, uri);

        tokenToPost[tokenId] = postId;
        appreciations[tokenId] = AppreciationData({
            postId: postId,
            sender: msg.sender,
            recipient: recipient,
            timestamp: block.timestamp
        });

        emit AppreciationMinted(tokenId, postId, msg.sender, recipient, uri);

        return tokenId;
    }

    /**
     * @dev Get appreciation data for a token
     */
    function getAppreciation(uint256 tokenId) 
        public 
        view 
        returns (AppreciationData memory) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return appreciations[tokenId];
    }

    /**
     * @dev Get total number of minted tokens
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

