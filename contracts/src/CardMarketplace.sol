// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/**
 * @title CardMarketplace
 * @dev Direct card purchase and user-to-user marketplace
 */
contract CardMarketplace is ReentrancyGuard, Ownable, Pausable, IERC721Receiver {
    
    // NFT Contract reference
    IERC721 public nftContract;
    
    // Platform fee percentage (2.5% = 250 basis points)
    uint256 public constant PLATFORM_FEE_BPS = 250;
    uint256 public constant BPS_DENOMINATOR = 10000;
    
    // Card data structure
    struct Card {
        string id;
        uint8 tier;      // 0=Common, 1=Rare, 2=Epic, 3=Legendary
        string name;
        string anime;
        string power;
        string quote;
        string imageURI;
        uint256 price;   // Price in wei (MATIC)
        uint256 maxSupply;
        uint256 currentSupply;
        bool active;
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
    
    // Card ID => Card data
    mapping(string => Card) public cards;
    string[] public cardIds;
    
    // Listing ID => Listing
    mapping(uint256 => Listing) public listings;
    uint256 public nextListingId;
    
    // User => their listing IDs
    mapping(address => uint256[]) public userListings;
    
    // Token ID => current listing ID (0 if not listed)
    mapping(uint256 => uint256) public tokenListing;
    
    // Token ID => Card ID mapping
    mapping(uint256 => string) public tokenCardId;
    
    // Next token ID for minting
    uint256 public nextTokenId;
    
    // Track user's owned tokens
    mapping(address => uint256[]) public userTokens;
    mapping(uint256 => bool) public tokenExists;
    
    // Sales tracking
    mapping(address => uint256) public userSalesVolume;
    uint256 public totalVolume;
    
    // Events
    event CardAdded(string indexed cardId, uint8 tier, string name, uint256 price, uint256 maxSupply);
    event CardPurchased(address indexed buyer, string indexed cardId, uint256 tokenId, uint256 price);
    event CardListed(uint256 indexed listingId, address indexed seller, string indexed cardId, uint256 price);
    event CardDelisted(uint256 indexed listingId, address indexed seller);
    event CardSold(uint256 indexed listingId, address indexed seller, address indexed buyer, string cardId, uint256 price, uint256 platformFee);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    constructor(address _nftContract) {
        require(_nftContract != address(0), "Invalid NFT contract");
        nftContract = IERC721(_nftContract);
        nextListingId = 1;
        nextTokenId = 1;
        
        // Initialize cards with fixed prices
        _initializeCards();
    }
    
    function _initializeCards() internal {
        // Common Tier - 4 cards
        _addCard("C01", 0, "Killua", "Hunter x Hunter", "Godspeed", 
                "I want to be your friend", 
                "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
                10 ether, 1000); // 10 MATIC, max 1000
                
        _addCard("C02", 0, "Zenitsu", "Demon Slayer", "Thunder Breathing",
                "I must be brave",
                "https://images.unsplash.com/photo-1607604276583-eef5a0b9a281?w=600&q=80",
                10 ether, 1000);
                
        _addCard("C03", 0, "Bakugo", "My Hero Academia", "Explosion",
                "I will surpass All Might",
                "https://images.unsplash.com/photo-1620332373994-3c329830e393?w=600&q=80",
                12 ether, 800); // 12 MATIC, slightly rarer
                
        _addCard("C04", 0, "Nobara", "Jujutsu Kaisen", "Straw Doll Technique",
                "I am here to save your life",
                "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&q=80",
                12 ether, 800);
        
        // Rare Tier - 3 cards
        _addCard("R01", 1, "Deku", "My Hero Academia", "One For All",
                "I will save everyone",
                "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
                25 ether, 500); // 25 MATIC
                
        _addCard("R02", 1, "Itachi", "Naruto", "Mangekyo Sharingan",
                "People live their lives bound by what they accept",
                "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&q=80",
                30 ether, 400); // 30 MATIC
                
        _addCard("R03", 1, "Tanjiro", "Demon Slayer", "Sun Breathing",
                "I will save my sister",
                "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=600&q=80",
                28 ether, 450); // 28 MATIC
        
        // Epic Tier - 2 cards
        _addCard("E01", 2, "Levi", "Attack on Titan", "Ackerman Bloodline",
                "Give up on your dreams and die",
                "https://images.unsplash.com/photo-1620332373994-3c329830e393?w=600&q=80",
                50 ether, 200); // 50 MATIC
                
        _addCard("E02", 2, "Gojo", "Jujutsu Kaisen", "Limitless & Six Eyes",
                "I am the strongest",
                "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&q=80",
                60 ether, 150); // 60 MATIC
        
        // Legendary Tier - 1 card
        _addCard("L01", 3, "Goku", "Dragon Ball", "Ultra Instinct",
                "I am the hope of the universe",
                "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&q=80",
                100 ether, 50); // 100 MATIC, very limited
    }
    
    function _addCard(string memory _id, uint8 _tier, string memory _name, 
                      string memory _anime, string memory _power, string memory _quote,
                      string memory _imageURI, uint256 _price, uint256 _maxSupply) internal {
        cards[_id] = Card({
            id: _id,
            tier: _tier,
            name: _name,
            anime: _anime,
            power: _power,
            quote: _quote,
            imageURI: _imageURI,
            price: _price,
            maxSupply: _maxSupply,
            currentSupply: 0,
            active: true
        });
        cardIds.push(_id);
        emit CardAdded(_id, _tier, _name, _price, _maxSupply);
    }
    
    /**
     * @dev Buy card directly from store
     */
    function buyCard(string memory _cardId) public payable nonReentrant whenNotPaused {
        Card storage card = cards[_cardId];
        require(card.active, "Card not available");
        require(card.currentSupply < card.maxSupply, "Card sold out");
        require(msg.value >= card.price, "Insufficient payment");
        
        // Mint NFT to buyer
        uint256 tokenId = _mintCard(msg.sender, _cardId);
        
        // Update supply
        card.currentSupply++;
        
        // Track user ownership
        userTokens[msg.sender].push(tokenId);
        tokenExists[tokenId] = true;
        
        emit CardPurchased(msg.sender, _cardId, tokenId, card.price);
        
        // Refund excess
        if (msg.value > card.price) {
            (bool success, ) = msg.sender.call{value: msg.value - card.price}("");
            require(success, "Refund failed");
        }
    }
    
    /**
     * @dev List a card for sale on the marketplace
     */
    function listCard(uint256 _tokenId, uint256 _price) public nonReentrant whenNotPaused {
        require(nftContract.ownerOf(_tokenId) == msg.sender, "Not token owner");
        require(_price > 0, "Price must be greater than 0");
        require(tokenListing[_tokenId] == 0, "Token already listed");
        
        uint256 listingId = nextListingId++;
        string memory cardId = getCardIdFromToken(_tokenId);
        
        listings[listingId] = Listing({
            listingId: listingId,
            cardId: cardId,
            tokenId: _tokenId,
            seller: msg.sender,
            price: _price,
            listedAt: block.timestamp,
            active: true
        });
        
        tokenListing[_tokenId] = listingId;
        userListings[msg.sender].push(listingId);
        
        // Approve marketplace to transfer token
        // Note: User must have approved this contract beforehand
        
        emit CardListed(listingId, msg.sender, cardId, _price);
    }
    
    /**
     * @dev Delist a card from marketplace
     */
    function delistCard(uint256 _listingId) public nonReentrant {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not the seller");
        
        listing.active = false;
        tokenListing[listing.tokenId] = 0;
        
        emit CardDelisted(_listingId, msg.sender);
    }
    
    /**
     * @dev Buy a card from the marketplace
     */
    function buyFromMarketplace(uint256 _listingId) public payable nonReentrant whenNotPaused {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing not active");
        require(listing.seller != msg.sender, "Cannot buy your own listing");
        require(msg.value >= listing.price, "Insufficient payment");
        
        // Calculate fees
        uint256 platformFee = (listing.price * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        uint256 sellerAmount = listing.price - platformFee;
        
        // Transfer NFT
        nftContract.safeTransferFrom(listing.seller, msg.sender, listing.tokenId);
        
        // Update ownership tracking
        _removeUserToken(listing.seller, listing.tokenId);
        userTokens[msg.sender].push(listing.tokenId);
        
        // Transfer funds to seller
        (bool sellerSuccess, ) = listing.seller.call{value: sellerAmount}("");
        require(sellerSuccess, "Seller payment failed");
        
        // Update tracking
        listing.active = false;
        tokenListing[listing.tokenId] = 0;
        userSalesVolume[listing.seller] += sellerAmount;
        totalVolume += listing.price;
        
        emit CardSold(_listingId, listing.seller, msg.sender, listing.cardId, listing.price, platformFee);
        
        // Refund excess to buyer
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }
    }
    
    /**
     * @dev Internal: Mint card NFT - generates token ID and tracks ownership
     * The actual NFT minting happens through the external NFT contract
     * This function emits an event that can be used by backend services
     */
    function _mintCard(address _to, string memory _cardId) internal returns (uint256) {
        // Generate a unique token ID
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        
        // Store the card ID for this token
        tokenCardId[tokenId] = _cardId;
        
        // Track ownership
        userTokens[_to].push(tokenId);
        tokenExists[tokenId] = true;
        
        // Emit event for external NFT contract to mint
        emit TokenMintRequested(tokenId, _to, _cardId, _generateTokenURI(_cardId));
        
        return tokenId;
    }
    
    /**
     * @dev Generate token URI for a card
     */
    function _generateTokenURI(string memory _cardId) internal view returns (string memory) {
        // Return a simplified URI - in production this would be IPFS or API endpoint
        return string(abi.encodePacked(
            "https://api.hntrs.io/cards/",
            _cardId
        ));
    }
    
    /**
     * @dev Get card ID from token ID
     */
    function getCardIdFromToken(uint256 _tokenId) public view returns (string memory) {
        return tokenCardId[_tokenId];
    }
    
    /**
     * @dev Callback for NFT contract to confirm minting
     * This should be called by the NFT contract after minting
     */
    function confirmMint(uint256 _tokenId, address _owner) external {
        require(msg.sender == address(nftContract), "Only NFT contract");
        require(tokenExists[_tokenId], "Token not tracked");
        // Additional verification can be added here
    }
    
    event TokenMintRequested(uint256 indexed tokenId, address indexed to, string cardId, string uri);
    
    /**
     * @dev Remove token from user's list
     */
    function _removeUserToken(address _user, uint256 _tokenId) internal {
        uint256[] storage tokens = userTokens[_user];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == _tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Get all active listings
     */
    function getActiveListings() public view returns (Listing[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i < nextListingId; i++) {
            if (listings[i].active) activeCount++;
        }
        
        Listing[] memory active = new Listing[](activeCount);
        uint256 index = 0;
        for (uint256 i = 1; i < nextListingId; i++) {
            if (listings[i].active) {
                active[index] = listings[i];
                index++;
            }
        }
        return active;
    }
    
    /**
     * @dev Get user's listings
     */
    function getUserListings(address _user) public view returns (Listing[] memory) {
        uint256[] storage listingIds = userListings[_user];
        Listing[] memory userListingData = new Listing[](listingIds.length);
        
        for (uint256 i = 0; i < listingIds.length; i++) {
            userListingData[i] = listings[listingIds[i]];
        }
        return userListingData;
    }
    
    /**
     * @dev Get all available cards
     */
    function getAllCards() public view returns (Card[] memory) {
        Card[] memory allCards = new Card[](cardIds.length);
        for (uint256 i = 0; i < cardIds.length; i++) {
            allCards[i] = cards[cardIds[i]];
        }
        return allCards;
    }
    
    /**
     * @dev Get user's owned tokens
     */
    function getUserTokens(address _user) public view returns (uint256[] memory) {
        return userTokens[_user];
    }
    
    /**
     * @dev Owner: Withdraw platform fees
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    /**
     * @dev Owner: Update NFT contract
     */
    function setNFTContract(address _nftContract) public onlyOwner {
        require(_nftContract != address(0), "Invalid address");
        nftContract = IERC721(_nftContract);
    }
    
    /**
     * @dev Owner: Pause/Unpause
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Owner: Add new card
     */
    function addCard(string memory _id, uint8 _tier, string memory _name,
                     string memory _anime, string memory _power, string memory _quote,
                     string memory _imageURI, uint256 _price, uint256 _maxSupply) public onlyOwner {
        require(bytes(cards[_id].id).length == 0, "Card already exists");
        _addCard(_id, _tier, _name, _anime, _power, _quote, _imageURI, _price, _maxSupply);
    }
    
    /**
     * @dev Owner: Update card price
     */
    function updateCardPrice(string memory _cardId, uint256 _newPrice) public onlyOwner {
        require(bytes(cards[_cardId].id).length > 0, "Card does not exist");
        cards[_cardId].price = _newPrice;
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
