// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title CardMarketplace
 * @dev Popularity-based card marketplace with dynamic pricing
 * All cards start at equal base price, prices adjust based on on-chain metrics
 */
contract CardMarketplaceV2 is ReentrancyGuard, Ownable, Pausable {
    
    // NFT Contract reference
    IERC721 public nftContract;
    
    // Base price for all cards (25 MATIC)
    uint256 public constant BASE_PRICE = 25 ether;
    uint256 public constant MIN_PRICE = 10 ether;
    uint256 public constant MAX_PRICE = 200 ether;
    
    // Platform fee (2.5%)
    uint256 public constant PLATFORM_FEE_BPS = 250;
    uint256 public constant MAX_DAILY_PRICE_CHANGE = 20; // 20% max daily change
    
    // Card popularity metrics
    struct CardMetrics {
        uint256 mintCount;
        uint256 tradeVolume;
        uint256 uniqueOwners;
        uint256 lastPriceUpdate;
        uint256 currentPrice;
        uint256 lastDailyVolume;
    }
    
    // Marketplace listing
    struct Listing {
        uint256 listingId;
        string cardId;
        uint256 tokenId;
        address seller;
        uint256 price;
        uint256 listedAt;
        bool active;
    }
    
    // Mappings
    mapping(string => CardMetrics) public cardMetrics;
    mapping(uint256 => Listing) public listings;
    mapping(string => uint256[]) public cardListings; // cardId => array of active listing IDs
    mapping(address => uint256[]) public userListings; // seller => array of their listing IDs
    mapping(string => mapping(address => bool)) public hasOwnedCard; // Track unique owners
    
    uint256 public nextListingId = 1;
    
    // Events
    event CardPurchased(address indexed buyer, string indexed cardId, uint256 tokenId, uint256 price);
    event CardListed(uint256 indexed listingId, string indexed cardId, uint256 tokenId, address seller, uint256 price);
    event CardDelisted(uint256 indexed listingId, string indexed cardId);
    event CardSold(uint256 indexed listingId, string indexed cardId, uint256 tokenId, address seller, address buyer, uint256 price);
    event PriceUpdated(string indexed cardId, uint256 oldPrice, uint256 newPrice);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    constructor(address _nftContract) {
        require(_nftContract != address(0), "Invalid NFT contract");
        nftContract = IERC721(_nftContract);
    }
    
    /**
     * @dev Buy card directly from store at current dynamic price
     */
    function buyCard(string memory _cardId) external payable nonReentrant whenNotPaused returns (uint256) {
        uint256 currentPrice = getCurrentPrice(_cardId);
        require(msg.value >= currentPrice, "Insufficient payment");
        
        // Calculate platform fee
        uint256 platformFee = (currentPrice * PLATFORM_FEE_BPS) / 10000;
        uint256 sellerAmount = currentPrice - platformFee;
        
        // Update metrics
        _updateMetricsOnBuy(_cardId, msg.sender);
        
        // Mint or transfer NFT (simplified - in production this would call NFT contract)
        uint256 tokenId = _mintCard(_cardId, msg.sender);
        
        // Transfer platform fee to contract balance (withdrawable by owner)
        // Platform fee stays in contract for owner to withdraw
        
        // Transfer remaining payment to seller
        (bool success, ) = payable(msg.sender).call{value: sellerAmount}("");
        require(success, "Transfer failed");
        
        emit CardPurchased(msg.sender, _cardId, tokenId, currentPrice);
        
        // Refund excess payment
        if (msg.value > currentPrice) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - currentPrice}("");
            require(refundSuccess, "Refund failed");
        }
        
        return tokenId;
    }
    
    /**
     * @dev List a card for sale on the marketplace
     */
    function listCard(string memory _cardId, uint256 _tokenId, uint256 _price) external nonReentrant whenNotPaused {
        require(_price >= MIN_PRICE, "Price below minimum");
        require(_price <= MAX_PRICE * 10, "Price above maximum"); // Allow higher for rare listings
        require(nftContract.ownerOf(_tokenId) == msg.sender, "Not card owner");
        
        // Transfer NFT to marketplace (escrow)
        nftContract.transferFrom(msg.sender, address(this), _tokenId);
        
        uint256 listingId = nextListingId++;
        listings[listingId] = Listing({
            listingId: listingId,
            cardId: _cardId,
            tokenId: _tokenId,
            seller: msg.sender,
            price: _price,
            listedAt: block.timestamp,
            active: true
        });
        
        cardListings[_cardId].push(listingId);
        userListings[msg.sender].push(listingId);
        
        emit CardListed(listingId, _cardId, _tokenId, msg.sender, _price);
    }
    
    /**
     * @dev Delist a card from the marketplace
     */
    function delistCard(uint256 _listingId) external nonReentrant {
        Listing storage listing = listings[_listingId];
        require(listing.seller == msg.sender, "Not listing owner");
        require(listing.active, "Listing not active");
        
        listing.active = false;
        
        // Return NFT to seller
        nftContract.transferFrom(address(this), msg.sender, listing.tokenId);
        
        emit CardDelisted(_listingId, listing.cardId);
    }
    
    /**
     * @dev Buy a card from the marketplace
     */
    function buyFromMarketplace(uint256 _listingId) external payable nonReentrant whenNotPaused {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");
        
        uint256 platformFee = (listing.price * PLATFORM_FEE_BPS) / 10000;
        uint256 sellerAmount = listing.price - platformFee;
        
        // Update metrics
        _updateMetricsOnTrade(listing.cardId, listing.seller, msg.sender);
        
        // Transfer NFT to buyer
        nftContract.transferFrom(address(this), msg.sender, listing.tokenId);
        
        // Pay seller
        (bool success, ) = payable(listing.seller).call{value: sellerAmount}("");
        require(success, "Payment to seller failed");
        
        listing.active = false;
        
        emit CardSold(_listingId, listing.cardId, listing.tokenId, listing.seller, msg.sender, listing.price);
        
        // Refund excess
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }
    }
    
    /**
     * @dev Calculate current dynamic price for a card
     */
    function getCurrentPrice(string memory _cardId) public view returns (uint256) {
        CardMetrics storage metrics = cardMetrics[_cardId];
        
        if (metrics.currentPrice == 0) {
            return BASE_PRICE;
        }
        
        return metrics.currentPrice;
    }
    
    /**
     * @dev Update price based on popularity metrics
     * Can be called by anyone, but price changes are capped
     */
    function updatePrice(string memory _cardId) external {
        CardMetrics storage metrics = cardMetrics[_cardId];
        
        uint256 popularityScore = _calculatePopularityScore(_cardId);
        uint256 newPrice = BASE_PRICE * (100 + popularityScore) / 100;
        
        // Apply bounds
        if (newPrice < MIN_PRICE) newPrice = MIN_PRICE;
        if (newPrice > MAX_PRICE) newPrice = MAX_PRICE;
        
        // Cap daily change
        if (metrics.currentPrice > 0) {
            uint256 maxChange = (metrics.currentPrice * MAX_DAILY_PRICE_CHANGE) / 100;
            if (newPrice > metrics.currentPrice + maxChange) {
                newPrice = metrics.currentPrice + maxChange;
            } else if (newPrice < metrics.currentPrice - maxChange) {
                newPrice = metrics.currentPrice - maxChange;
            }
        }
        
        uint256 oldPrice = metrics.currentPrice;
        metrics.currentPrice = newPrice;
        metrics.lastPriceUpdate = block.timestamp;
        
        emit PriceUpdated(_cardId, oldPrice, newPrice);
    }
    
    /**
     * @dev Get popularity metrics for a card
     */
    function getPopularityMetrics(string memory _cardId) external view returns (
        uint256 mintCount,
        uint256 tradeVolume,
        uint256 uniqueOwners,
        uint256 currentPrice,
        uint256 popularityScore
    ) {
        CardMetrics storage metrics = cardMetrics[_cardId];
        return (
            metrics.mintCount,
            metrics.tradeVolume,
            metrics.uniqueOwners,
            metrics.currentPrice > 0 ? metrics.currentPrice : BASE_PRICE,
            _calculatePopularityScore(_cardId)
        );
    }
    
    /**
     * @dev Get active listings for a card
     */
    function getCardListings(string memory _cardId) external view returns (uint256[] memory) {
        return cardListings[_cardId];
    }
    
    /**
     * @dev Get user's listings
     */
    function getUserListings(address _user) external view returns (uint256[] memory) {
        return userListings[_user];
    }
    
    /**
     * @dev Calculate popularity score (internal)
     * Formula: (Mint Count × 0.4) + (Trade Volume × 0.35) + (Unique Owners × 0.25)
     */
    function _calculatePopularityScore(string memory _cardId) internal view returns (uint256) {
        CardMetrics storage metrics = cardMetrics[_cardId];
        
        // Normalize each metric (cap at 100 for each component)
        uint256 mintScore = metrics.mintCount > 100 ? 100 : metrics.mintCount;
        uint256 volumeScore = metrics.tradeVolume > 100 ? 100 : metrics.tradeVolume;
        uint256 ownersScore = metrics.uniqueOwners > 100 ? 100 : metrics.uniqueOwners;
        
        // Weighted calculation
        uint256 score = (mintScore * 40 + volumeScore * 35 + ownersScore * 25) / 100;
        
        return score;
    }
    
    /**
     * @dev Update metrics when card is bought from store
     */
    function _updateMetricsOnBuy(string memory _cardId, address _buyer) internal {
        CardMetrics storage metrics = cardMetrics[_cardId];
        
        metrics.mintCount++;
        
        if (!hasOwnedCard[_cardId][_buyer]) {
            hasOwnedCard[_cardId][_buyer] = true;
            metrics.uniqueOwners++;
        }
    }
    
    /**
     * @dev Update metrics when card is traded on marketplace
     */
    function _updateMetricsOnTrade(string memory _cardId, address _seller, address _buyer) internal {
        CardMetrics storage metrics = cardMetrics[_cardId];
        
        metrics.tradeVolume++;
        
        if (!hasOwnedCard[_cardId][_buyer]) {
            hasOwnedCard[_cardId][_buyer] = true;
            metrics.uniqueOwners++;
        }
    }
    
    /**
     * @dev Mint card (simplified - in production calls NFT contract)
     */
    function _mintCard(string memory _cardId, address _to) internal returns (uint256) {
        // Generate token ID based on cardId and mint count
        uint256 tokenId = uint256(keccak256(abi.encodePacked(_cardId, block.timestamp, _to))) % 1000000;
        return tokenId;
    }
    
    /**
     * @dev Owner: Withdraw accumulated funds
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    /**
     * @dev Owner: Update NFT contract address
     */
    function setNFTContract(address _nftContract) public onlyOwner {
        require(_nftContract != address(0), "Invalid address");
        nftContract = IERC721(_nftContract);
    }
    
    /**
     * @dev Owner: Pause/Unpause
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    receive() external payable {}
    fallback() external payable {}
}
