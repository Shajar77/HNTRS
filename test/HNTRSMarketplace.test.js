const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HNTRSMarketplace", function () {
  let nft;
  let marketplace;
  let owner;
  let seller;
  let buyer;

  const ONE_ETH = ethers.parseEther("1");
  const HALF_ETH = ethers.parseEther("0.5");

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    // Deploy NFT
    const HNTRSNFT = await ethers.getContractFactory("HNTRSNFT");
    nft = await HNTRSNFT.deploy("HNTRS", "HNTRS", "ipfs://QmContractURI", owner.address);
    await nft.waitForDeployment();

    // Deploy Marketplace
    const HNTRSMarketplace = await ethers.getContractFactory("HNTRSMarketplace");
    marketplace = await HNTRSMarketplace.deploy(owner.address);
    await marketplace.waitForDeployment();

    // Grant minter role to owner
    const MINTER_ROLE = await nft.MINTER_ROLE();
    await nft.grantRole(MINTER_ROLE, owner.address);
  });

  describe("Deployment", function () {
    it("Should set correct platform fee", async function () {
      expect(await marketplace.platformFeeBps()).to.equal(250); // 2.5%
    });

    it("Should set correct fee recipient", async function () {
      expect(await marketplace.feeRecipient()).to.equal(owner.address);
    });
  });

  describe("Fixed Price Listings", function () {
    let tokenId;

    beforeEach(async function () {
      // Mint NFT to seller
      const tx = await nft.mintSingle(
        seller.address,
        "ipfs://QmTestURI",
        "Test NFT",
        "football",
        seller.address,
        1000 // 10% royalty
      );
      const receipt = await tx.wait();
      tokenId = 0;

      // Approve marketplace
      await nft.connect(seller).approve(await marketplace.getAddress(), tokenId);
    });

    it("Should create fixed price listing", async function () {
      await marketplace.connect(seller).createFixedPriceListing(
        await nft.getAddress(),
        tokenId,
        ONE_ETH,
        7 * 24 * 3600 // 7 days
      );

      const listing = await marketplace.listings(0);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(ONE_ETH);
      expect(listing.isActive).to.be.true;
      expect(listing.listingType).to.equal(0); // FixedPrice = 0
    });

    it("Should transfer NFT to marketplace on listing", async function () {
      await marketplace.connect(seller).createFixedPriceListing(
        await nft.getAddress(),
        tokenId,
        ONE_ETH,
        7 * 24 * 3600
      );

      expect(await nft.ownerOf(tokenId)).to.equal(await marketplace.getAddress());
    });

    it("Should allow buying fixed price listing", async function () {
      await marketplace.connect(seller).createFixedPriceListing(
        await nft.getAddress(),
        tokenId,
        ONE_ETH,
        7 * 24 * 3600
      );

      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);

      await marketplace.connect(buyer).buyFixedPrice(0, { value: ONE_ETH });

      expect(await nft.ownerOf(tokenId)).to.equal(buyer.address);

      const listing = await marketplace.listings(0);
      expect(listing.isActive).to.be.false;
    });

    it("Should distribute payment correctly", async function () {
      await marketplace.connect(seller).createFixedPriceListing(
        await nft.getAddress(),
        tokenId,
        ONE_ETH,
        7 * 24 * 3600
      );

      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      const feeRecipientBefore = await ethers.provider.getBalance(owner.address);

      await marketplace.connect(buyer).buyFixedPrice(0, { value: ONE_ETH });

      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      const feeRecipientAfter = await ethers.provider.getBalance(owner.address);

      // Seller gets 97.5% - 10% royalty = 87.5%
      const expectedSellerPayment = (ONE_ETH * 875n) / 1000n;
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(expectedSellerPayment);

      // Platform gets 2.5%
      const expectedPlatformFee = (ONE_ETH * 25n) / 1000n;
      expect(feeRecipientAfter - feeRecipientBefore).to.equal(expectedPlatformFee);
    });

    it("Should reject insufficient payment", async function () {
      await marketplace.connect(seller).createFixedPriceListing(
        await nft.getAddress(),
        tokenId,
        ONE_ETH,
        7 * 24 * 3600
      );

      await expect(
        marketplace.connect(buyer).buyFixedPrice(0, { value: HALF_ETH })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should cancel listing and return NFT", async function () {
      await marketplace.connect(seller).createFixedPriceListing(
        await nft.getAddress(),
        tokenId,
        ONE_ETH,
        7 * 24 * 3600
      );

      await marketplace.connect(seller).cancelListing(0);

      expect(await nft.ownerOf(tokenId)).to.equal(seller.address);
      
      const listing = await marketplace.listings(0);
      expect(listing.isActive).to.be.false;
    });
  });

  describe("Auctions", function () {
    let tokenId;

    beforeEach(async function () {
      const tx = await nft.mintSingle(
        seller.address,
        "ipfs://QmAuctionURI",
        "Auction NFT",
        "football",
        seller.address,
        1000
      );
      tokenId = 0;

      await nft.connect(seller).approve(await marketplace.getAddress(), tokenId);
    });

    it("Should create auction listing", async function () {
      await marketplace.connect(seller).createAuctionListing(
        await nft.getAddress(),
        tokenId,
        HALF_ETH,
        24 * 3600 // 1 day
      );

      const listing = await marketplace.listings(0);
      expect(listing.listingType).to.equal(1); // Auction = 1
      expect(listing.price).to.equal(HALF_ETH); // Reserve price
    });

    it("Should accept bids above reserve", async function () {
      await marketplace.connect(seller).createAuctionListing(
        await nft.getAddress(),
        tokenId,
        HALF_ETH,
        24 * 3600
      );

      await marketplace.connect(buyer).placeBid(0, { value: ONE_ETH });

      const listing = await marketplace.listings(0);
      expect(listing.highestBidder).to.equal(buyer.address);
      expect(listing.highestBid).to.equal(ONE_ETH);
    });

    it("Should reject bids below reserve", async function () {
      await marketplace.connect(seller).createAuctionListing(
        await nft.getAddress(),
        tokenId,
        HALF_ETH,
        24 * 3600
      );

      await expect(
        marketplace.connect(buyer).placeBid(0, { value: ethers.parseEther("0.1") })
      ).to.be.revertedWith("Bid below reserve price");
    });

    it("Should refund previous bidder on new bid", async function () {
      const [, bidder1, bidder2] = await ethers.getSigners();

      await marketplace.connect(seller).createAuctionListing(
        await nft.getAddress(),
        tokenId,
        HALF_ETH,
        24 * 3600
      );

      await marketplace.connect(bidder1).placeBid(0, { value: ONE_ETH });
      
      const balanceBefore = await ethers.provider.getBalance(bidder1.address);
      await marketplace.connect(bidder2).placeBid(0, { value: ethers.parseEther("1.5") });
      const balanceAfter = await ethers.provider.getBalance(bidder1.address);

      expect(balanceAfter - balanceBefore).to.equal(ONE_ETH);
    });

    it("Should settle auction and transfer NFT", async function () {
      await marketplace.connect(seller).createAuctionListing(
        await nft.getAddress(),
        tokenId,
        HALF_ETH,
        1 // 1 second for testing
      );

      await marketplace.connect(buyer).placeBid(0, { value: ONE_ETH });

      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine");

      await marketplace.settleAuction(0);

      expect(await nft.ownerOf(tokenId)).to.equal(buyer.address);
    });
  });

  describe("Offers", function () {
    let tokenId;

    beforeEach(async function () {
      await nft.mintSingle(
        seller.address,
        "ipfs://QmOfferURI",
        "Offer NFT",
        "football",
        seller.address,
        1000
      );
      tokenId = 0;
    });

    it("Should create offer", async function () {
      await marketplace.connect(buyer).makeOffer(
        await nft.getAddress(),
        tokenId,
        HALF_ETH,
        7 * 24 * 3600,
        { value: HALF_ETH }
      );

      const offer = await marketplace.offers(0);
      expect(offer.offerer).to.equal(buyer.address);
      expect(offer.amount).to.equal(HALF_ETH);
      expect(offer.isActive).to.be.true;
    });

    it("Should allow owner to accept offer", async function () {
      await marketplace.connect(buyer).makeOffer(
        await nft.getAddress(),
        tokenId,
        HALF_ETH,
        7 * 24 * 3600,
        { value: HALF_ETH }
      );

      await nft.connect(seller).approve(await marketplace.getAddress(), tokenId);

      await marketplace.connect(seller).acceptOffer(0);

      expect(await nft.ownerOf(tokenId)).to.equal(buyer.address);
    });

    it("Should allow offerer to cancel offer", async function () {
      await marketplace.connect(buyer).makeOffer(
        await nft.getAddress(),
        tokenId,
        HALF_ETH,
        7 * 24 * 3600,
        { value: HALF_ETH }
      );

      const balanceBefore = await ethers.provider.getBalance(buyer.address);
      await marketplace.connect(buyer).cancelOffer(0);
      const balanceAfter = await ethers.provider.getBalance(buyer.address);

      expect(balanceAfter - balanceBefore).to.equal(HALF_ETH);
    });
  });

  describe("Admin Functions", function () {
    it("Should update platform fee", async function () {
      await marketplace.setPlatformFee(500); // 5%
      expect(await marketplace.platformFeeBps()).to.equal(500);
    });

    it("Should reject fee above 10%", async function () {
      await expect(marketplace.setPlatformFee(1100)).to.be.revertedWith(
        "Fee cannot exceed 10%"
      );
    });

    it("Should update fee recipient", async function () {
      await marketplace.setFeeRecipient(buyer.address);
      expect(await marketplace.feeRecipient()).to.equal(buyer.address);
    });
  });
});
