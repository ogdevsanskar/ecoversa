const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Starting EcoVerse contract deployment...");
  
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "MATIC");

  // Deploy GreenToken contract
  console.log("\n🌿 Deploying GreenToken contract...");
  const GreenToken = await hre.ethers.getContractFactory("GreenToken");
  const greenToken = await GreenToken.deploy(deployer.address);
  await greenToken.waitForDeployment();
  
  const greenTokenAddress = await greenToken.getAddress();
  console.log("✅ GreenToken deployed to:", greenTokenAddress);

  // Deploy EcoAchievements contract
  console.log("\n🏆 Deploying EcoAchievements contract...");
  const EcoAchievements = await hre.ethers.getContractFactory("EcoAchievements");
  const ecoAchievements = await EcoAchievements.deploy(deployer.address);
  await ecoAchievements.waitForDeployment();
  
  const ecoAchievementsAddress = await ecoAchievements.getAddress();
  console.log("✅ EcoAchievements deployed to:", ecoAchievementsAddress);

  // Save contract addresses
  const contracts = {
    GreenToken: {
      address: greenTokenAddress,
      abi: "GreenToken.json"
    },
    EcoAchievements: {
      address: ecoAchievementsAddress,
      abi: "EcoAchievements.json"
    }
  };

  const contractsPath = path.join(__dirname, '../deployed-contracts.json');
  fs.writeFileSync(contractsPath, JSON.stringify(contracts, null, 2));
  
  console.log("\n📋 Contract deployment summary:");
  console.log("===============================");
  console.log("GreenToken (GTN):", greenTokenAddress);
  console.log("EcoAchievements:", ecoAchievementsAddress);
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  
  console.log("\n📄 Contract addresses saved to deployed-contracts.json");
  
  // Verify contracts on Polygonscan
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\n🔍 Waiting for block confirmations...");
    await greenToken.deploymentTransaction()?.wait(6);
    await ecoAchievements.deploymentTransaction()?.wait(6);
    
    console.log("🔍 Verifying contracts on Polygonscan...");
    try {
      await hre.run("verify:verify", {
        address: greenTokenAddress,
        constructorArguments: [deployer.address],
      });
      console.log("✅ GreenToken contract verified");
    } catch (error) {
      console.log("⚠️ GreenToken verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: ecoAchievementsAddress,
        constructorArguments: [deployer.address],
      });
      console.log("✅ EcoAchievements contract verified");
    } catch (error) {
      console.log("⚠️ EcoAchievements verification failed:", error.message);
    }
  }
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("🔗 Add these addresses to your frontend configuration:");
  console.log(`REACT_APP_CONTRACT_ADDRESS=${greenTokenAddress}`);
  console.log(`REACT_APP_NFT_CONTRACT_ADDRESS=${ecoAchievementsAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

