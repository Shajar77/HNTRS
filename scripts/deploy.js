const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy HNTRSNFT
  console.log("\nDeploying HNTRSNFT...");
  const HNTRSNFT = await hre.ethers.getContractFactory("HNTRSNFT");
  const nft = await HNTRSNFT.deploy(
    "HNTRS Sports Designs",
    "HNTRS",
    "ipfs://QmContractURI", // Replace with actual IPFS URI
    deployer.address
  );
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("HNTRSNFT deployed to:", nftAddress);

  // Deploy HNTRSMarketplace
  console.log("\nDeploying HNTRSMarketplace...");
  const HNTRSMarketplace = await hre.ethers.getContractFactory("HNTRSMarketplace");
  const marketplace = await HNTRSMarketplace.deploy(deployer.address);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("HNTRSMarketplace deployed to:", marketplaceAddress);

  // Grant marketplace MINTER_ROLE on NFT contract
  console.log("\nGranting marketplace MINTER_ROLE on NFT contract...");
  const MINTER_ROLE = await nft.MINTER_ROLE();
  const tx = await nft.grantRole(MINTER_ROLE, marketplaceAddress);
  await tx.wait();
  console.log("MINTER_ROLE granted to marketplace");

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    contracts: {
      HNTRSNFT: nftAddress,
      HNTRSMarketplace: marketplaceAddress
    },
    timestamp: new Date().toISOString()
  };

  console.log("\n=== Deployment Complete ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Write to file for frontend
  const fs = require("fs");
  const path = require("path");
  
  const deploymentPath = path.join(__dirname, "..", "src", "config", "deployments.json");
  const deploymentsDir = path.dirname(deploymentPath);
  
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Read existing deployments or create new
  let deployments = {};
  if (fs.existsSync(deploymentPath)) {
    deployments = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  }
  deployments[hre.network.name] = deploymentInfo;
  
  fs.writeFileSync(deploymentPath, JSON.stringify(deployments, null, 2));
  console.log("\nDeployment info saved to src/config/deployments.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
