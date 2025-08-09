const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting EcoVerse Smart Contract Deployment");
  console.log("=============================================");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  
  console.log("📋 Deployment Configuration:");
  console.log(`   Deployer: ${deployer.address}`);
  console.log(`   Network: ${network.name}`);
  console.log(`   Balance: ${ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH`);
  console.log("");

  const deploymentData = {
    network: network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {}
  };

  try {
    // 1. Deploy GreenToken
    console.log("🪙 Deploying GreenToken...");
    const GreenToken = await ethers.getContractFactory("GreenToken");
    
    const greenToken = await GreenToken.deploy(deployer.address);
    await greenToken.waitForDeployment();
    
    const greenTokenAddress = await greenToken.getAddress();
    console.log(`   ✅ GreenToken deployed to: ${greenTokenAddress}`);
    
    deploymentData.contracts.greenToken = {
      address: greenTokenAddress,
      name: "EcoVerse Green Token",
      symbol: "GTN",
      txHash: greenToken.deploymentTransaction()?.hash
    };

    // 2. Deploy EcoAchievements
    console.log("\n🏆 Deploying EcoAchievements...");
    const EcoAchievements = await ethers.getContractFactory("EcoAchievements");
    
    const ecoAchievements = await EcoAchievements.deploy(deployer.address);
    await ecoAchievements.waitForDeployment();
    
    const ecoAchievementsAddress = await ecoAchievements.getAddress();
    console.log(`   ✅ EcoAchievements deployed to: ${ecoAchievementsAddress}`);
    
    deploymentData.contracts.ecoAchievements = {
      address: ecoAchievementsAddress,
      name: "EcoAchievements",
      symbol: "ECO",
      txHash: ecoAchievements.deploymentTransaction()?.hash
    };

    // 3. Set up contract interactions
    console.log("\n⚙️ Setting up contract interactions...");
    
    // Set up EcoAchievements minter authorization
    console.log("   🎯 Setting up EcoAchievements minter authorization...");
    await ecoAchievements.setMinterAuthorization(deployer.address, true);

    // 4. Verify deployment with test transactions
    console.log("\n🧪 Testing contract functionality...");
    
    // Test GreenToken minting
    const testAmount = ethers.parseEther("100");
    console.log("   🪙 Testing GreenToken minting...");
    await greenToken.mintReward(
      deployer.address, 
      testAmount, 
      "Deployment test - saved 10 kWh"
    );
    
    const balance = await greenToken.balanceOf(deployer.address);
    console.log(`   ✅ Test successful. Deployer balance: ${ethers.formatEther(balance)} GTN`);
    
    // Test EcoAchievements
    console.log("   🏆 Testing EcoAchievements minting...");
    await ecoAchievements.mintAchievement(
      deployer.address,
      0, // ENERGY_SAVER category
      0, // BRONZE level
      "Energy Saver Bronze",
      "Saved 100 kWh of electricity",
      150, // achieved value
      "ipfs://test-metadata"
    );
    
    const userAchievements = await ecoAchievements.getUserAchievements(deployer.address);
    console.log(`   ✅ Test successful. User has ${userAchievements.length} achievement(s)`);

    // 5. Save deployment data
    console.log("\n💾 Saving deployment data...");
    
    deploymentData.contracts.greenToken.testBalance = balance.toString();
    deploymentData.contracts.ecoAchievements.testAchievements = userAchievements.length;
    
    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir);
    }
    
    // Save deployment data
    const deploymentFile = path.join(deploymentsDir, `${network.name}-deployment.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2));

    console.log(`   ✅ Deployment data saved to: ${deploymentFile}`);

    // 6. Display final summary
    console.log("\n🎉 Deployment completed successfully!");
    console.log("=====================================");
    console.log(`📋 Contract Addresses:`);
    console.log(`   GreenToken: ${greenTokenAddress}`);
    console.log(`   EcoAchievements: ${ecoAchievementsAddress}`);
    console.log(``);
    console.log(`🔗 Explorer Links (if on public network):`);
    if (network.name === "mumbai") {
      console.log(`   GreenToken: https://mumbai.polygonscan.com/address/${greenTokenAddress}`);
      console.log(`   EcoAchievements: https://mumbai.polygonscan.com/address/${ecoAchievementsAddress}`);
    } else if (network.name === "polygon") {
      console.log(`   GreenToken: https://polygonscan.com/address/${greenTokenAddress}`);
      console.log(`   EcoAchievements: https://polygonscan.com/address/${ecoAchievementsAddress}`);
    }
    console.log(``);
    console.log(`📱 Frontend Integration:`);
    console.log(`   Add these addresses to your frontend configuration`);
    console.log(``);
    console.log(`🔧 Next Steps:`);
    console.log(`   1. Update frontend contract addresses`);
    console.log(`   2. Set up automated reward system`);
    console.log(`   3. Configure achievement triggers`);
    console.log(`   4. Test with real user interactions`);

    // 7. Environment file generation
    console.log("\n📝 Generating environment configuration...");
    const envConfig = `
# EcoVerse Smart Contracts Configuration
# Generated on ${new Date().toISOString()}
# Network: ${network.name}

# Contract Addresses
REACT_APP_GREEN_TOKEN_ADDRESS=${greenTokenAddress}
REACT_APP_ECO_ACHIEVEMENTS_ADDRESS=${ecoAchievementsAddress}

# Network Configuration
REACT_APP_NETWORK_NAME=${network.name}
REACT_APP_CHAIN_ID=${network.config.chainId || 'local'}

# Deployer Address
DEPLOYER_ADDRESS=${deployer.address}

# API Configuration
REACT_APP_WEB3_ENABLED=true
REACT_APP_WALLET_CONNECT_ENABLED=true
`;

    const envFile = path.join(deploymentsDir, `${network.name}.env`);
    fs.writeFileSync(envFile, envConfig);
    console.log(`   ✅ Environment config saved to: ${envFile}`);

    return {
      greenToken: greenTokenAddress,
      ecoAchievements: ecoAchievementsAddress,
      deployer: deployer.address,
      network: network.name
    };

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

// Execute deployment
main()
  .then((result) => {
    console.log(`\n✨ All contracts deployed successfully!`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`\n💥 Deployment failed:`, error);
    process.exit(1);
  });
