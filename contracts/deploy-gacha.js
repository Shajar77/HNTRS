const hre = require("hardhat");

async function main() {
  console.log("Deploying GachaSystem contract...");

  // Get the NFT contract address (existing HNTRSNFT)
  // For testing, we'll deploy a new NFT contract first, or use a mock address
  const nftContractAddress = process.env.NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

  // Deploy GachaSystem
  const GachaSystem = await hre.ethers.getContractFactory("GachaSystem");
  const gachaSystem = await GachaSystem.deploy(nftContractAddress);

  await gachaSystem.waitForDeployment();

  const address = await gachaSystem.getAddress();
  console.log(`GachaSystem deployed to: ${address}`);
  console.log(`NFT Contract: ${nftContractAddress}`);
  console.log(`Pull Cost: 50 MATIC`);
  console.log(`Odds - Common: 65%, Rare: 20%, Epic: 10%, Legendary: 5%`);

  // Save deployment info
  const deploymentInfo = {
    contract: "GachaSystem",
    address: address,
    nftContract: nftContractAddress,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    pullCost: "50 MATIC",
    odds: {
      common: 65,
      rare: 20,
      epic: 10,
      legendary: 5
    }
  };

  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Wait for block confirmations if on a public network
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nWaiting for block confirmations...");
    await gachaSystem.deploymentTransaction().wait(5);
    console.log("Confirmed!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
