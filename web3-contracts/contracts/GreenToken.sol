// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title GreenToken (GTN)
 * @dev ERC20 token for EcoVerse sustainability rewards
 * Users earn GTN tokens by completing eco-friendly actions
 */
contract GreenToken is ERC20, ERC20Burnable, Ownable, Pausable {
    
    // Token decimals
    uint8 private _decimals = 18;
    
    // Maximum supply (100 million tokens)
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    
    // Reward rates for different actions (in GTN tokens)
    struct RewardRates {
        uint256 energySaving;      // Per kWh saved
        uint256 waterSaving;       // Per liter saved
        uint256 wasteReduction;    // Per kg reduced
        uint256 challengeCompletion; // Per challenge completed
        uint256 dailyLogin;        // Daily login bonus
    }
    
    RewardRates public rewardRates;
    
    // User reward tracking
    mapping(address => uint256) public totalEarned;
    mapping(address => uint256) public lastRewardTime;
    mapping(address => bool) public authorizedMinters;
    
    // Events
    event RewardMinted(address indexed user, uint256 amount, string reason);
    event RewardRatesUpdated(RewardRates newRates);
    event MinterAuthorized(address indexed minter, bool authorized);
    
    constructor(address initialOwner) ERC20("GreenToken", "GTN") Ownable(initialOwner) {
        // Set initial reward rates
        rewardRates = RewardRates({
            energySaving: 5 * 10**18,      // 5 GTN per kWh saved
            waterSaving: 1 * 10**15,       // 0.001 GTN per liter saved
            wasteReduction: 10 * 10**18,   // 10 GTN per kg waste reduced
            challengeCompletion: 25 * 10**18, // 25 GTN per challenge
            dailyLogin: 1 * 10**18         // 1 GTN daily login
        });
        
        // Mint initial supply to owner (10% of max supply)
        _mint(initialOwner, 10_000_000 * 10**18);
        
        // Authorize owner as minter
        authorizedMinters[initialOwner] = true;
    }
    
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }
    
    /**
     * @dev Mint tokens as reward for eco-friendly actions
     */
    function mintReward(
        address user, 
        uint256 amount, 
        string memory reason
    ) external onlyMinter whenNotPaused {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be positive");
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        
        _mint(user, amount);
        totalEarned[user] += amount;
        lastRewardTime[user] = block.timestamp;
        
        emit RewardMinted(user, amount, reason);
    }
    
    /**
     * @dev Batch mint rewards for multiple users
     */
    function batchMintRewards(
        address[] calldata users,
        uint256[] calldata amounts,
        string[] calldata reasons
    ) external onlyMinter whenNotPaused {
        require(
            users.length == amounts.length && amounts.length == reasons.length,
            "Arrays length mismatch"
        );
        
        uint256 totalMintAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalMintAmount += amounts[i];
        }
        
        require(totalSupply() + totalMintAmount <= MAX_SUPPLY, "Would exceed max supply");
        
        for (uint256 i = 0; i < users.length; i++) {
            require(users[i] != address(0), "Invalid user address");
            require(amounts[i] > 0, "Amount must be positive");
            
            _mint(users[i], amounts[i]);
            totalEarned[users[i]] += amounts[i];
            lastRewardTime[users[i]] = block.timestamp;
            
            emit RewardMinted(users[i], amounts[i], reasons[i]);
        }
    }
    
    /**
     * @dev Calculate reward for energy saving
     */
    function calculateEnergySavingReward(uint256 kwhSaved) external view returns (uint256) {
        return kwhSaved * rewardRates.energySaving / 1000; // Divide by 1000 for precision
    }
    
    /**
     * @dev Calculate reward for water saving
     */
    function calculateWaterSavingReward(uint256 litersSaved) external view returns (uint256) {
        return litersSaved * rewardRates.waterSaving;
    }
    
    /**
     * @dev Calculate reward for waste reduction
     */
    function calculateWasteReductionReward(uint256 kgReduced) external view returns (uint256) {
        return kgReduced * rewardRates.wasteReduction / 1000; // Divide by 1000 for precision
    }
    
    /**
     * @dev Get challenge completion reward
     */
    function getChallengeReward() external view returns (uint256) {
        return rewardRates.challengeCompletion;
    }
    
    /**
     * @dev Get daily login reward
     */
    function getDailyLoginReward() external view returns (uint256) {
        return rewardRates.dailyLogin;
    }
    
    /**
     * @dev Check if user can claim daily login reward
     */
    function canClaimDailyReward(address user) external view returns (bool) {
        return block.timestamp >= lastRewardTime[user] + 24 hours;
    }
    
    /**
     * @dev Update reward rates (only owner)
     */
    function updateRewardRates(RewardRates calldata newRates) external onlyOwner {
        rewardRates = newRates;
        emit RewardRatesUpdated(newRates);
    }
    
    /**
     * @dev Authorize/deauthorize minters
     */
    function setMinterAuthorization(address minter, bool authorized) external onlyOwner {
        authorizedMinters[minter] = authorized;
        emit MinterAuthorized(minter, authorized);
    }
    
    /**
     * @dev Pause token transfers (emergency)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer function to include pause functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev Get user statistics
     */
    function getUserStats(address user) external view returns (
        uint256 balance,
        uint256 earned,
        uint256 lastReward,
        bool canClaimDaily
    ) {
        return (
            balanceOf(user),
            totalEarned[user],
            lastRewardTime[user],
            block.timestamp >= lastRewardTime[user] + 24 hours
        );
    }
    
    /**
     * @dev Get token info
     */
    function getTokenInfo() external view returns (
        string memory name,
        string memory symbol,
        uint8 tokenDecimals,
        uint256 currentSupply,
        uint256 maxSupply
    ) {
        return (
            name(),
            symbol(),
            _decimals,
            totalSupply(),
            MAX_SUPPLY
        );
    }
}
