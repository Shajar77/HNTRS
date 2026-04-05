const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HNTRSNFT", function () {
  let nft;
  let owner;
  let minter;
  let buyer;

  const NAME = "HNTRS Sports Designs";
  const SYMBOL = "HNTRS";
  const CONTRACT_URI = "ipfs://QmContractURI";

  beforeEach(async function () {
    [owner, minter, buyer] = await ethers.getSigners();

    const HNTRSNFT = await ethers.getContractFactory("HNTRSNFT");
    nft = await HNTRSNFT.deploy(NAME, SYMBOL, CONTRACT_URI, owner.address);
    await nft.waitForDeployment();

    // Grant minter role
    const MINTER_ROLE = await nft.MINTER_ROLE();
    await nft.grantRole(MINTER_ROLE, minter.address);
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await nft.name()).to.equal(NAME);
      expect(await nft.symbol()).to.equal(SYMBOL);
    });

    it("Should set the right contract URI", async function () {
      expect(await nft.contractURI()).to.equal(CONTRACT_URI);
    });

    it("Should grant DEFAULT_ADMIN_ROLE to deployer", async function () {
      const DEFAULT_ADMIN_ROLE = await nft.DEFAULT_ADMIN_ROLE();
      expect(await nft.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Minting", function () {
    it("Should mint a single NFT", async function () {
      const uri = "ipfs://QmTestURI";
      const name = "Football Design #1";
      const category = "football";

      await nft.connect(minter).mintSingle(
        buyer.address,
        uri,
        name,
        category,
        minter.address,
        1000 // 10% royalty
      );

      expect(await nft.ownerOf(0)).to.equal(buyer.address);
      expect(await nft.tokenURI(0)).to.equal(uri);
      expect(await nft.totalSupply()).to.equal(1);
    });

    it("Should set royalty info correctly", async function () {
      await nft.connect(minter).mintSingle(
        buyer.address,
        "ipfs://QmTestURI",
        "Test NFT",
        "football",
        minter.address,
        500 // 5% royalty
      );

      const [recipient, royaltyAmount] = await nft.royaltyInfo(0, ethers.parseEther("1"));
      expect(recipient).to.equal(minter.address);
      expect(royaltyAmount).to.equal(ethers.parseEther("0.05"));
    });

    it("Should revert if non-minter tries to mint", async function () {
      await expect(
        nft.connect(buyer).mintSingle(
          buyer.address,
          "ipfs://QmTestURI",
          "Test",
          "football",
          buyer.address,
          1000
        )
      ).to.be.reverted;
    });
  });

  describe("Collections", function () {
    it("Should create a collection", async function () {
      const tx = await nft.connect(minter).createCollection(
        "Football Legends",
        "Legendary football designs",
        100,
        ethers.parseEther("0.1")
      );

      const [name, description, maxSupply, currentSupply, price, isActive] = 
        await nft.getCollection(0);

      expect(name).to.equal("Football Legends");
      expect(maxSupply).to.equal(100);
      expect(price).to.equal(ethers.parseEther("0.1"));
      expect(isActive).to.be.true;
    });

    it("Should mint from collection", async function () {
      await nft.connect(minter).createCollection(
        "Football Legends",
        "Legendary football designs",
        100,
        ethers.parseEther("0.1")
      );

      await nft.connect(minter).mintFromCollection(
        buyer.address,
        0,
        "ipfs://QmCollectionItem",
        minter.address,
        1000
      );

      expect(await nft.ownerOf(0)).to.equal(buyer.address);
      
      const [, , , currentSupply] = await nft.getCollection(0);
      expect(currentSupply).to.equal(1);
    });

    it("Should not mint more than max supply", async function () {
      await nft.connect(minter).createCollection(
        "Limited Edition",
        "Limited collection",
        2,
        ethers.parseEther("0.1")
      );

      // Mint 2 items
      await nft.connect(minter).mintFromCollection(buyer.address, 0, "uri1", minter.address, 1000);
      await nft.connect(minter).mintFromCollection(buyer.address, 0, "uri2", minter.address, 1000);

      // Try to mint 3rd - should fail
      await expect(
        nft.connect(minter).mintFromCollection(buyer.address, 0, "uri3", minter.address, 1000)
      ).to.be.revertedWith("Collection sold out");
    });
  });

  describe("Lazy Minting", function () {
    it("Should create lazy mint", async function () {
      const tokenId = await nft.connect(minter).createLazyMint.staticCall(
        "ipfs://QmLazyURI",
        "Lazy NFT",
        "football",
        0,
        minter.address,
        1000
      );

      await nft.connect(minter).createLazyMint(
        "ipfs://QmLazyURI",
        "Lazy NFT",
        "football",
        0,
        minter.address,
        1000
      );

      const meta = await nft.tokenMeta(tokenId);
      expect(meta.isLazyMinted).to.be.true;
      expect(meta.creator).to.equal(minter.address);
    });

    it("Should not exist before claiming", async function () {
      await nft.connect(minter).createLazyMint(
        "ipfs://QmLazyURI",
        "Lazy NFT",
        "football",
        0,
        minter.address,
        1000
      );

      await expect(nft.ownerOf(0)).to.be.reverted;
    });
  });

  describe("Batch Minting", function () {
    it("Should batch mint multiple NFTs", async function () {
      const uris = ["ipfs://Qm1", "ipfs://Qm2", "ipfs://Qm3"];
      const names = ["Design 1", "Design 2", "Design 3"];
      const categories = ["football", "basketball", "football"];

      await nft.connect(minter).batchMint(
        buyer.address,
        uris,
        names,
        categories,
        minter.address,
        1000
      );

      expect(await nft.totalSupply()).to.equal(3);
      expect(await nft.ownerOf(0)).to.equal(buyer.address);
      expect(await nft.ownerOf(1)).to.equal(buyer.address);
      expect(await nft.ownerOf(2)).to.equal(buyer.address);
    });

    it("Should revert on array length mismatch", async function () {
      await expect(
        nft.connect(minter).batchMint(
          buyer.address,
          ["uri1", "uri2"],
          ["name1"],
          ["cat1"],
          minter.address,
          1000
        )
      ).to.be.revertedWith("Array length mismatch");
    });
  });

  describe("Token Metadata", function () {
    it("Should return correct token metadata", async function () {
      await nft.connect(minter).mintSingle(
        buyer.address,
        "ipfs://QmTestURI",
        "Football Design",
        "football",
        minter.address,
        1000
      );

      const meta = await nft.tokenMeta(0);
      expect(meta.name).to.equal("Football Design");
      expect(meta.category).to.equal("football");
      expect(meta.tokenType).to.equal(0); // Single = 0
      expect(meta.creator).to.equal(minter.address);
    });
  });

  describe("Ownership", function () {
    it("Should return tokens by owner", async function () {
      await nft.connect(minter).mintSingle(buyer.address, "uri1", "NFT 1", "football", minter.address, 1000);
      await nft.connect(minter).mintSingle(buyer.address, "uri2", "NFT 2", "football", minter.address, 1000);
      await nft.connect(minter).mintSingle(owner.address, "uri3", "NFT 3", "football", owner.address, 1000);

      const buyerTokens = await nft.getTokensByOwner(buyer.address);
      expect(buyerTokens.length).to.equal(2);
    });
  });
});
