// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title GachaSystem
 * @dev Anime NFT gacha/luck system - 50 MATIC per pull with weighted odds
 */
contract GachaSystem is ReentrancyGuard, Ownable, Pausable {
    
    // NFT Contract reference (stored as address for flexibility)
    address public nftContract;
    
    // Pull cost: 50 MATIC
    uint256 public constant PULL_COST = 50 ether;
    
    // Maximum re-roll attempts for duplicates
    uint256 public constant MAX_REROLLS = 3;
    
    // Tier weights (out of 100)
    // Common: 65%, Rare: 20%, Epic: 10%, Legendary: 5%
    uint8[4] public tierWeights = [65, 20, 10, 5];
    
    // Card counts per tier
    uint8[4] public cardsPerTier = [4, 3, 2, 1];
    
    // Tier names for metadata
    string[4] public tierNames = ["Common", "Rare", "Epic", "Legendary"];
    
    // Card data structure
    struct CardData {
        uint8 tier;      // 0=Common, 1=Rare, 2=Epic, 3=Legendary
        uint8 cardIndex; // Index within tier (0-3 for Common, 0-2 for Rare, etc.)
        string name;
        string anime;
        string power;
        string quote;
        string imageURI;
    }
    
    // All cards data indexed by tier and cardIndex
    mapping(uint8 => mapping(uint8 => CardData)) public cards;
    
    // Track minted cards (tier => cardIndex => minted count)
    mapping(uint8 => mapping(uint8 => uint256)) public mintedCards;
    
    // User pull history
    mapping(address => uint256) public userPullCount;
    mapping(address => uint256[]) public userPullHistory;
    
    // Events
    event CardPulled(
        address indexed user,
        uint256 indexed tokenId,
        uint8 tier,
        uint8 cardIndex,
        string cardName,
        uint256 cost
    );
    event ReRollTriggered(
        address indexed user,
        uint8 originalTier,
        uint8 originalIndex,
        uint8 attempt
    );
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event NFTContractUpdated(address indexed newContract);
    
    constructor(address _nftContract) {
        // Allow zero address for testing (will be set later)
        nftContract = _nftContract;
        
        // Initialize card data
        _initializeCards();
    }
    
    /**
     * @dev Initialize all card data
     */
    function _initializeCards() internal {
        // Common Tier (0) - 4 cards
        cards[0][0] = CardData(0, 0, "Killua", "Hunter x Hunter", "Godspeed", "I want to be your friend", "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80");
        cards[0][1] = CardData(0, 1, "Zenitsu", "Demon Slayer", "Thunder Breathing", "I must be brave", "https://images.unsplash.com/photo-1607604276583-eef5a0b9a281?w=600&q=80");
        cards[0][2] = CardData(0, 2, "Bakugo", "My Hero Academia", "Explosion", "I will surpass All Might", "https://images.unsplash.com/photo-1620332373994-3c329830e393?w=600&q=80");
        cards[0][3] = CardData(0, 3, "Nobara", "Jujutsu Kaisen", "Straw Doll Technique", "I am here to save your life", "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&q=80");
        
        // Rare Tier (1) - 3 cards
        cards[1][0] = CardData(1, 0, "Deku", "My Hero Academia", "One For All", "I will save everyone", "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80");
        cards[1][1] = CardData(1, 1, "Itachi", "Naruto", "Mangekyo Sharingan", "People live their lives bound by what they accept", "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&q=80");
        cards[1][2] = CardData(1, 2, "Tanjiro", "Demon Slayer", "Sun Breathing", "I will save my sister", "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=600&q=80");
        
        // Epic Tier (2) - 2 cards
        cards[2][0] = CardData(2, 0, "Levi", "Attack on Titan", "Ackerman Bloodline", "Give up on your dreams and die", "https://images.unsplash.com/photo-1620332373994-3c329830e393?w=600&q=80");
        cards[2][1] = CardData(2, 1, "Gojo", "Jujutsu Kaisen", "Limitless & Six Eyes", "I am the strongest", "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&q=80");
        
        // Legendary Tier (3) - 1 card
        cards[3][0] = CardData(3, 0, "Goku", "Dragon Ball", "Ultra Instinct", "I am the hope of the universe", "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&q=80");
    }
    
    /**
     * @dev Main pull function - 50 MATIC for random card
     */
    function pull() public payable nonReentrant whenNotPaused returns (uint256) {
        require(msg.value >= PULL_COST, "Insufficient payment: 50 MATIC required");
        
        // Generate random number using multiple sources for better randomness
        uint256 randomNumber = _generateRandomNumber();
        
        // Select card based on weighted probability
        (uint8 tier, uint8 cardIndex) = _selectCard(randomNumber);
        
        // Check for duplicates and re-roll if needed
        uint256 attempt = 0;
        while (_userOwnsCard(msg.sender, tier, cardIndex) && attempt < MAX_REROLLS) {
            emit ReRollTriggered(msg.sender, tier, cardIndex, uint8(attempt + 1));
            randomNumber = _generateRandomNumber() + attempt + 1;
            (tier, cardIndex) = _selectCard(randomNumber);
            attempt++;
        }
        
        // Mint the card
        uint256 tokenId = _mintCard(msg.sender, tier, cardIndex);
        
        // Update tracking
        userPullCount[msg.sender]++;
        userPullHistory[msg.sender].push(tokenId);
        mintedCards[tier][cardIndex]++;
        
        emit CardPulled(msg.sender, tokenId, tier, cardIndex, cards[tier][cardIndex].name, PULL_COST);
        
        // Refund excess payment if any
        if (msg.value > PULL_COST) {
            (bool success, ) = msg.sender.call{value: msg.value - PULL_COST}("");
            require(success, "Refund failed");
        }
        
        return tokenId;
    }
    
    /**
     * @dev Generate pseudo-random number using block data
     * NOTE: For production, consider Chainlink VRF for true randomness
     */
    function _generateRandomNumber() internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            userPullCount[msg.sender],
            block.number
        )));
    }
    
    /**
     * @dev Select card tier and index based on weighted probability
     */
    function _selectCard(uint256 randomNumber) internal view returns (uint8 tier, uint8 cardIndex) {
        uint256 random = randomNumber % 100; // 0-99
        
        // Determine tier based on weights
        if (random < tierWeights[3]) {
            // Legendary: 0-4 (5%)
            tier = 3;
        } else if (random < tierWeights[3] + tierWeights[2]) {
            // Epic: 5-14 (10%)
            tier = 2;
        } else if (random < tierWeights[3] + tierWeights[2] + tierWeights[1]) {
            // Rare: 15-34 (20%)
            tier = 1;
        } else {
            // Common: 35-99 (65%)
            tier = 0;
        }
        
        // Select random card within tier
        cardIndex = uint8((randomNumber / 100) % cardsPerTier[tier]);
        
        return (tier, cardIndex);
    }
    
    /**
     * @dev Check if user already owns a specific card
     */
    function _userOwnsCard(address user, uint8 tier, uint8 cardIndex) internal view returns (bool) {
        // Get user's tokens from NFT contract
        // This would call the NFT contract's balanceOf and tokenOfOwnerByIndex
        // For demo, simplified to return empty array
        uint256[] memory userTokens = new uint256[](0);
        
        // Check each token's metadata to see if it matches the card
        for (uint256 i = 0; i < userTokens.length; i++) {
            // In a real implementation, you'd compare card attributes
            // For this demo, we'll use a simpler approach with token ID mapping
            if (_tokenMatchesCard(userTokens[i], tier, cardIndex)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * @dev Check if a token ID represents a specific card
     * This is a simplified check - in production you'd use a mapping
     */
    function _tokenMatchesCard(uint256 tokenId, uint8 tier, uint8 cardIndex) internal pure returns (bool) {
        // Generate deterministic token ID from tier and card index
        // Token ID format: (tier * 1000) + cardIndex + startingOffset
        uint256 expectedStart = uint256(tier) * 1000 + uint256(cardIndex) * 100;
        uint256 expectedEnd = expectedStart + 99;
        
        return tokenId >= expectedStart && tokenId <= expectedEnd;
    }
    
    /**
     * @dev Mint card NFT to user
     */
    function _mintCard(address to, uint8 tier, uint8 cardIndex) internal returns (uint256) {
        CardData memory card = cards[tier][cardIndex];
        
        // Create metadata URI with card data
        string memory metadataURI = _generateMetadataURI(card);
        
        // Generate deterministic token ID
        uint256 tokenIdBase = uint256(tier) * 1000 + uint256(cardIndex) * 100;
        uint256 tokenId = tokenIdBase + mintedCards[tier][cardIndex];
        
        // Mint via NFT contract - need to call as owner/minter
        // In production, this contract should have MINTER_ROLE
        // For now, we'll emit the event and handle minting off-chain or via separate call
        
        return tokenId;
    }
    
    /**
     * @dev Generate metadata URI for a card (simplified for demo)
     */
    function _generateMetadataURI(CardData memory card) internal view returns (string memory) {
        // Return a simple URI that points to off-chain metadata
        // In production, this would be an IPFS hash or API endpoint
        return string(abi.encodePacked(
            "https://api.hntrs.io/metadata/",
            tierNames[card.tier],
            "/",
            card.name
        ));
    }
    
    /**
     * @dev Owner: Withdraw accumulated funds
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    /**
     * @dev Owner: Update NFT contract address
     */
    function setNFTContract(address _nftContract) public onlyOwner {
        require(_nftContract != address(0), "Invalid address");
        nftContract = _nftContract;
        emit NFTContractUpdated(_nftContract);
    }
    
    /**
     * @dev Owner: Pause/Unpause the contract
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Owner: Update tier weights (for balancing)
     */
    function setTierWeights(uint8[4] memory _weights) public onlyOwner {
        uint256 total = uint256(_weights[0]) + _weights[1] + _weights[2] + _weights[3];
        require(total == 100, "Weights must sum to 100");
        tierWeights = _weights;
    }
    
    /**
     * @dev Get card data
     */
    function getCardData(uint8 tier, uint8 cardIndex) public view returns (CardData memory) {
        require(tier < 4 && cardIndex < cardsPerTier[tier], "Invalid card");
        return cards[tier][cardIndex];
    }
    
    /**
     * @dev Get user's pull history
     */
    function getUserPullHistory(address user) public view returns (uint256[] memory) {
        return userPullHistory[user];
    }
    
    /**
     * @dev Get contract balance
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Get pull odds for display
     */
    function getPullOdds() public view returns (
        uint8 commonOdds,
        uint8 rareOdds,
        uint8 epicOdds,
        uint8 legendaryOdds
    ) {
        return (
            tierWeights[0],
            tierWeights[1],
            tierWeights[2],
            tierWeights[3]
        );
    }
    
    receive() external payable {}
    fallback() external payable {}
}
