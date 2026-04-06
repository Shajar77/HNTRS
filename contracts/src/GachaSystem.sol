// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/**
 * @title GachaSystem
 * @dev Anime NFT gacha/luck system - 50 MATIC per pull with weighted odds
 */
contract GachaSystem is ReentrancyGuard, Ownable, Pausable, IERC721Receiver {
    
    // NFT Contract reference (stored as address for flexibility)
    address public nftContract;
    
    // Token ID => Card data mapping
    mapping(uint256 => CardData) public tokenCardData;
    
    // Next token ID for minting
    uint256 public nextTokenId;
    
    // User => token IDs they own (tracked by this contract)
    mapping(address => uint256[]) public userTokens;
    mapping(uint256 => bool) public tokenExists;
    
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
    event TokenMintRequested(uint256 indexed tokenId, address indexed to, uint8 tier, uint8 cardIndex, string uri);
    
    constructor(address _nftContract) {
        require(_nftContract != address(0), "Invalid NFT contract");
        nftContract = _nftContract;
        nextTokenId = 1;
        
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
    function _userOwnsCard(address _user, uint8 _tier, uint8 _cardIndex) internal view returns (bool) {
        uint256[] storage tokens = userTokens[_user];
        for (uint256 i = 0; i < tokens.length; i++) {
            CardData storage cardData = tokenCardData[tokens[i]];
            if (cardData.tier == _tier && cardData.cardIndex == _cardIndex) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Internal: Mint card NFT - generates token ID and tracks ownership
     * The actual NFT minting happens through the external NFT contract
     * This function emits an event that can be used by backend services
     */
    function _mintCard(address _to, uint8 _tier, uint8 _cardIndex) internal returns (uint256) {
        // Generate a unique token ID
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        
        // Store card data for this token
        CardData storage card = cards[_tier][_cardIndex];
        tokenCardData[tokenId] = CardData({
            tier: _tier,
            cardIndex: _cardIndex,
            name: card.name,
            anime: card.anime,
            power: card.power,
            quote: card.quote,
            imageURI: card.imageURI
        });
        
        // Track ownership
        userTokens[_to].push(tokenId);
        tokenExists[tokenId] = true;
        
        // Emit event for external NFT contract to mint
        emit TokenMintRequested(tokenId, _to, _tier, _cardIndex, _generateTokenURI(_tier, _cardIndex));
        
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
     * @dev Generate token URI for a card by tier and index
     */
    function _generateTokenURI(uint8 _tier, uint8 _cardIndex) internal view returns (string memory) {
        CardData storage card = cards[_tier][_cardIndex];
        return string(abi.encodePacked(
            "https://api.hntrs.io/gacha/",
            tierNames[_tier],
            "/",
            card.name
        ));
    }
    
    /**
     * @dev Convert uint to string
     */
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        return string(bstr);
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
    
    /**
     * @dev ERC721Receiver hook - allows contract to receive NFTs
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
    
    receive() external payable {}
    fallback() external payable {}
}
