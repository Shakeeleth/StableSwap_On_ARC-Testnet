const { ethers } = require("ethers");

// Contract ABIs
const CustomUSDCABI = [
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint amount) returns (bool)",
  "function mint(address to, uint amount)",
  "function burn(address from, uint amount)",
  "function setStableSwapContract(address _stableSwap)",
  "function owner() view returns (address)"
];

const StableSwapABI = [
  "function USDC() view returns (address)",
  "function EURC() view returns (address)",
  "function swapFee() view returns (uint256)",
  "function addEURCLiquidity(uint256 amount)",
  "function withdrawEURC(uint256 amount)",
  "function owner() view returns (address)"
];

// Arc Testnet Configuration
const ARC_RPC = "https://rpc.testnet.arc.network";
const CHAIN_ID = 5042002;

// Contract Addresses
const CUSTOM_USDC_ADDRESS = "0xAeA395991357425d3BAcb5C3E8600B31ae7f9d21";
const STABLE_SWAP_ADDRESS = "0x2ad8A5F51977C91E575bD81366A30cdC56DE64Bf";
const EURC_ADDRESS = "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a";

async function main() {
  console.log("🚀 Starting StableSwap DEX Setup...");
  
  // Provider setup
  const provider = new ethers.JsonRpcProvider(ARC_RPC);
  
  // Wallet setup - apna private key yahan dalna
  const privateKey = process.env.PRIVATE_KEY || "YOUR_PRIVATE_KEY_HERE";
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("Deployer address:", wallet.address);
  
  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.log("❌ Insufficient balance. Get testnet ETH from faucet.");
    return;
  }
  
  // Initialize contracts
  const usdcContract = new ethers.Contract(CUSTOM_USDC_ADDRESS, CustomUSDCABI, wallet);
  const stableSwapContract = new ethers.Contract(STABLE_SWAP_ADDRESS, StableSwapABI, wallet);
  
  try {
    // Step 1: Check if StableSwap is already set in USDC contract
    console.log("\n📋 Step 1: Checking USDC contract configuration...");
    const currentStableSwap = await usdcContract.stableSwapContract();
    const usdcOwner = await usdcContract.owner();
    
    console.log("USDC Owner:", usdcOwner);
    console.log("Current StableSwap in USDC:", currentStableSwap);
    
    // Step 2: Set StableSwap contract in USDC if not set
    if (currentStableSwap !== STABLE_SWAP_ADDRESS) {
      console.log("\n🔧 Step 2: Setting StableSwap contract in USDC...");
      
      if (usdcOwner.toLowerCase() === wallet.address.toLowerCase()) {
        const setTx = await usdcContract.setStableSwapContract(STABLE_SWAP_ADDRESS);
        console.log("Setting StableSwap in USDC... TX:", setTx.hash);
        await setTx.wait();
        console.log("✅ StableSwap set in USDC contract");
      } else {
        console.log("❌ You are not the owner of USDC contract");
        console.log("Please ask the owner to call setStableSwapContract with address:", STABLE_SWAP_ADDRESS);
      }
    } else {
      console.log("✅ StableSwap already set in USDC contract");
    }
    
    // Step 3: Check contract configurations
    console.log("\n🔍 Step 3: Checking contract configurations...");
    
    const stableSwapUSDC = await stableSwapContract.USDC();
    const stableSwapEURC = await stableSwapContract.EURC();
    const swapFee = await stableSwapContract.swapFee();
    const stableSwapOwner = await stableSwapContract.owner();
    
    console.log("StableSwap USDC:", stableSwapUSDC);
    console.log("StableSwap EURC:", stableSwapEURC);
    console.log("StableSwap Swap Fee:", swapFee.toString());
    console.log("StableSwap Owner:", stableSwapOwner);
    
    // Step 4: Add initial EURC liquidity to StableSwap
    console.log("\n💰 Step 4: Adding EURC liquidity to StableSwap...");
    
    // Check EURC balance
    const eurcContract = new ethers.Contract(EURC_ADDRESS, [
      "function balanceOf(address) view returns (uint)",
      "function transfer(address to, uint amount) returns (bool)",
      "function approve(address spender, uint amount) returns (bool)",
      "function decimals() view returns (uint8)"
    ], wallet);
    
    const eurcBalance = await eurcContract.balanceOf(wallet.address);
    const eurcDecimals = await eurcContract.decimals();
    
    console.log("Your EURC balance:", ethers.formatUnits(eurcBalance, eurcDecimals));
    
    if (eurcBalance > 0) {
      // Approve EURC for StableSwap
      const approveTx = await eurcContract.approve(STABLE_SWAP_ADDRESS, eurcBalance);
      console.log("Approving EURC... TX:", approveTx.hash);
      await approveTx.wait();
      
      // Add liquidity
      if (stableSwapOwner.toLowerCase() === wallet.address.toLowerCase()) {
        const addLiquidityTx = await stableSwapContract.addEURCLiquidity(eurcBalance);
        console.log("Adding EURC liquidity... TX:", addLiquidityTx.hash);
        await addLiquidityTx.wait();
        console.log("✅ EURC liquidity added to StableSwap");
      } else {
        console.log("❌ You are not the owner of StableSwap contract");
        console.log("Please ask the owner to add EURC liquidity");
      }
    } else {
      console.log("❌ Insufficient EURC balance. Get EURC from faucet:");
      console.log("https://faucet.circle.com");
    }
    
    // Step 5: Verify setup
    console.log("\n✅ Step 5: Setup Verification");
    console.log("==============================");
    console.log("Custom USDC Address:", CUSTOM_USDC_ADDRESS);
    console.log("StableSwap Address:", STABLE_SWAP_ADDRESS);
    console.log("EURC Address:", EURC_ADDRESS);
    console.log("StableSwap Owner:", stableSwapOwner);
    console.log("USDC Owner:", usdcOwner);
    
    console.log("\n🎉 Setup Complete!");
    console.log("Frontend Configuration:");
    console.log("USDC:", CUSTOM_USDC_ADDRESS);
    console.log("EURC:", EURC_ADDRESS);
    console.log("STABLE_SWAP_CONTRACT:", STABLE_SWAP_ADDRESS);
    
  } catch (error) {
    console.error("❌ Setup failed:", error);
  }
}

// Helper function to check contract balances
async function checkBalances() {
  console.log("\n💰 Checking Contract Balances...");
  
  const provider = new ethers.JsonRpcProvider(ARC_RPC);
  const privateKey = process.env.PRIVATE_KEY || "YOUR_PRIVATE_KEY_HERE";
  const wallet = new ethers.Wallet(privateKey, provider);
  
  const eurcContract = new ethers.Contract(EURC_ADDRESS, [
    "function balanceOf(address) view returns (uint)",
    "function decimals() view returns (uint8)"
  ], wallet);
  
  const usdcContract = new ethers.Contract(CUSTOM_USDC_ADDRESS, [
    "function balanceOf(address) view returns (uint)",
    "function decimals() view returns (uint8)"
  ], wallet);
  
  try {
    const eurcBalance = await eurcContract.balanceOf(STABLE_SWAP_ADDRESS);
    const eurcDecimals = await eurcContract.decimals();
    
    const usdcBalance = await usdcContract.balanceOf(STABLE_SWAP_ADDRESS);
    const usdcDecimals = await usdcContract.decimals();
    
    console.log("StableSwap EURC Balance:", ethers.formatUnits(eurcBalance, eurcDecimals));
    console.log("StableSwap USDC Balance:", ethers.formatUnits(usdcBalance, usdcDecimals));
    
  } catch (error) {
    console.error("Error checking balances:", error);
  }
}

// Run setup
main()
  .then(() => checkBalances())
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });