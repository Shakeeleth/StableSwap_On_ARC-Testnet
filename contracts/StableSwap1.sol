// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface ICustomUSDC {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}

contract StableSwap {
    address public USDC;
    address public EURC;
    
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public swapFee = 4; // 0.04%
    
    mapping(address => uint256) public lastGMClaim;
    uint256 public constant GM_COOLDOWN = 24 hours;
    
    address public owner;
    
    event Swap(
        address indexed user,
        address fromToken,
        address toToken,
        uint256 amountIn,
        uint256 amountOut
    );
    
    event GMClaimed(address indexed user, uint256 timestamp);
    event LiquidityAdded(address token, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    constructor(address _usdc, address _eurc) {
        USDC = _usdc;
        EURC = _eurc;
        owner = msg.sender;
    }
    
    function swap(address fromToken, address toToken, uint256 amountIn) external returns (uint256) {
        require(
            (fromToken == USDC && toToken == EURC) || (fromToken == EURC && toToken == USDC),
            "Only USDC/EURC pairs allowed"
        );
        require(amountIn > 0, "Amount must be greater than 0");
        
        uint256 amountOut = calculateSwap(fromToken, toToken, amountIn);
        require(amountOut > 0, "Insufficient output amount");
        
        if (fromToken == USDC && toToken == EURC) {
            // USDC → EURC: USDC burn karo, EURC transfer karo
            require(IERC20(EURC).balanceOf(address(this)) >= amountOut, "Insufficient EURC liquidity");
            
            // User se USDC burn karo
            ICustomUSDC(USDC).burn(msg.sender, amountIn);
            
            // User ko EURC do
            require(IERC20(EURC).transfer(msg.sender, amountOut), "EURC transfer failed");
            
        } else if (fromToken == EURC && toToken == USDC) {
            // EURC → USDC: EURC lelo, USDC mint karo
            require(IERC20(EURC).transferFrom(msg.sender, address(this), amountIn), "EURC transfer failed");
            
            // User ko USDC mint karo
            ICustomUSDC(USDC).mint(msg.sender, amountOut);
        }
        
        emit Swap(msg.sender, fromToken, toToken, amountIn, amountOut);
        return amountOut;
    }
    
    function calculateSwap(address fromToken, address toToken, uint256 amountIn) public view returns (uint256) {
        require(
            (fromToken == USDC && toToken == EURC) || (fromToken == EURC && toToken == USDC),
            "Only USDC/EURC pairs allowed"
        );
        
        // Simple 1:1 swap with fee
        uint256 fee = (amountIn * swapFee) / FEE_DENOMINATOR;
        uint256 amountAfterFee = amountIn - fee;
        
        return amountAfterFee;
    }
    
    // EURC liquidity add karo (sirf owner)
    function addEURCLiquidity(uint256 amount) external onlyOwner {
        require(IERC20(EURC).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit LiquidityAdded(EURC, amount);
    }
    
    // EURC withdraw karo (sirf owner)
    function withdrawEURC(uint256 amount) external onlyOwner {
        require(IERC20(EURC).transfer(msg.sender, amount), "Transfer failed");
    }
    
    // GM ARC function
    function claimGM() external {
        require(block.timestamp >= lastGMClaim[msg.sender] + GM_COOLDOWN, "GM cooldown active");
        lastGMClaim[msg.sender] = block.timestamp;
        emit GMClaimed(msg.sender, block.timestamp);
    }
    
    function canClaimGM(address user) external view returns (bool) {
        return block.timestamp >= lastGMClaim[user] + GM_COOLDOWN;
    }
    
    function getGMCooldown(address user) external view returns (uint256) {
        if (lastGMClaim[user] == 0) return 0;
        if (block.timestamp >= lastGMClaim[user] + GM_COOLDOWN) return 0;
        return (lastGMClaim[user] + GM_COOLDOWN) - block.timestamp;
    }
    
    // Fee set karo
    function setSwapFee(uint256 _swapFee) external onlyOwner {
        require(_swapFee <= 100, "Fee too high");
        swapFee = _swapFee;
    }
}