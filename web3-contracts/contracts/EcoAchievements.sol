// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title EcoAchievements
 * @dev ERC721 NFT contract for EcoVerse achievement badges
 * Users earn NFT achievements by reaching sustainability milestones
 */
contract EcoAchievements is ERC721, ERC721URIStorage, ERC721Burnable, Ownable, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Achievement categories
    enum AchievementCategory {
        ENERGY_SAVER,
        WATER_GUARDIAN,
        WASTE_WARRIOR,
        ECO_CHAMPION,
        GREEN_PIONEER,
        SUSTAINABILITY_EXPERT
    }
    
    // Achievement levels
    enum AchievementLevel {
        BRONZE,
        SILVER,
        GOLD,
        PLATINUM,
        DIAMOND
    }
    
    // Achievement structure
    struct Achievement {
        uint256 tokenId;
        address owner;
        AchievementCategory category;
        AchievementLevel level;
        string title;
        string description;
        uint256 earnedTimestamp;
        uint256 requiredValue;
        string metadataURI;
    }
    
    // Mappings
    mapping(uint256 => Achievement) public achievements;
    mapping(address => uint256[]) public userAchievements;
    mapping(address => mapping(AchievementCategory => AchievementLevel)) public userCategoryLevel;
    mapping(address => bool) public authorizedMinters;
    
    // Achievement requirements (values needed to earn each level)
    mapping(AchievementCategory => mapping(AchievementLevel => uint256)) public requirements;
    
    // Events
    event AchievementMinted(
        uint256 indexed tokenId,
        address indexed user,
        AchievementCategory category,
        AchievementLevel level,
        string title
    );
    event RequirementsUpdated(AchievementCategory category, AchievementLevel level, uint256 value);
    event MinterAuthorized(address indexed minter, bool authorized);
    
    constructor(address initialOwner) ERC721("EcoAchievements", "ECO") Ownable(initialOwner) {
        // Initialize achievement requirements
        _setInitialRequirements();
        
        // Authorize owner as minter
        authorizedMinters[initialOwner] = true;
    }
    
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }
    
    /**
     * @dev Set initial achievement requirements
     */
    function _setInitialRequirements() internal {
        // Energy Saver achievements (kWh saved)
        requirements[AchievementCategory.ENERGY_SAVER][AchievementLevel.BRONZE] = 100;
        requirements[AchievementCategory.ENERGY_SAVER][AchievementLevel.SILVER] = 500;
        requirements[AchievementCategory.ENERGY_SAVER][AchievementLevel.GOLD] = 1000;
        requirements[AchievementCategory.ENERGY_SAVER][AchievementLevel.PLATINUM] = 5000;
        requirements[AchievementCategory.ENERGY_SAVER][AchievementLevel.DIAMOND] = 10000;
        
        // Water Guardian achievements (liters saved)
        requirements[AchievementCategory.WATER_GUARDIAN][AchievementLevel.BRONZE] = 1000;
        requirements[AchievementCategory.WATER_GUARDIAN][AchievementLevel.SILVER] = 5000;
        requirements[AchievementCategory.WATER_GUARDIAN][AchievementLevel.GOLD] = 10000;
        requirements[AchievementCategory.WATER_GUARDIAN][AchievementLevel.PLATINUM] = 50000;
        requirements[AchievementCategory.WATER_GUARDIAN][AchievementLevel.DIAMOND] = 100000;
        
        // Waste Warrior achievements (kg reduced)
        requirements[AchievementCategory.WASTE_WARRIOR][AchievementLevel.BRONZE] = 50;
        requirements[AchievementCategory.WASTE_WARRIOR][AchievementLevel.SILVER] = 200;
        requirements[AchievementCategory.WASTE_WARRIOR][AchievementLevel.GOLD] = 500;
        requirements[AchievementCategory.WASTE_WARRIOR][AchievementLevel.PLATINUM] = 1000;
        requirements[AchievementCategory.WASTE_WARRIOR][AchievementLevel.DIAMOND] = 2000;
        
        // Eco Champion achievements (challenges completed)
        requirements[AchievementCategory.ECO_CHAMPION][AchievementLevel.BRONZE] = 10;
        requirements[AchievementCategory.ECO_CHAMPION][AchievementLevel.SILVER] = 25;
        requirements[AchievementCategory.ECO_CHAMPION][AchievementLevel.GOLD] = 50;
        requirements[AchievementCategory.ECO_CHAMPION][AchievementLevel.PLATINUM] = 100;
        requirements[AchievementCategory.ECO_CHAMPION][AchievementLevel.DIAMOND] = 200;
        
        // Green Pioneer achievements (days active)
        requirements[AchievementCategory.GREEN_PIONEER][AchievementLevel.BRONZE] = 30;
        requirements[AchievementCategory.GREEN_PIONEER][AchievementLevel.SILVER] = 90;
        requirements[AchievementCategory.GREEN_PIONEER][AchievementLevel.GOLD] = 180;
        requirements[AchievementCategory.GREEN_PIONEER][AchievementLevel.PLATINUM] = 365;
        requirements[AchievementCategory.GREEN_PIONEER][AchievementLevel.DIAMOND] = 730;
        
        // Sustainability Expert achievements (total eco score)
        requirements[AchievementCategory.SUSTAINABILITY_EXPERT][AchievementLevel.BRONZE] = 1000;
        requirements[AchievementCategory.SUSTAINABILITY_EXPERT][AchievementLevel.SILVER] = 5000;
        requirements[AchievementCategory.SUSTAINABILITY_EXPERT][AchievementLevel.GOLD] = 10000;
        requirements[AchievementCategory.SUSTAINABILITY_EXPERT][AchievementLevel.PLATINUM] = 25000;
        requirements[AchievementCategory.SUSTAINABILITY_EXPERT][AchievementLevel.DIAMOND] = 50000;
    }
    
    /**
     * @dev Mint achievement NFT
     */
    function mintAchievement(
        address user,
        AchievementCategory category,
        AchievementLevel level,
        string memory title,
        string memory description,
        uint256 achievedValue,
        string memory metadataURI
    ) external onlyMinter whenNotPaused returns (uint256) {
        require(user != address(0), "Invalid user address");
        require(achievedValue >= requirements[category][level], "Requirements not met");
        
        // Check if user already has this level or higher
        require(
            userCategoryLevel[user][category] < level || 
            userCategoryLevel[user][category] == AchievementLevel.BRONZE, // Allow first achievement
            "User already has this level or higher"
        );
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        // Mint NFT
        _mint(user, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        
        // Create achievement record
        achievements[newTokenId] = Achievement({
            tokenId: newTokenId,
            owner: user,
            category: category,
            level: level,
            title: title,
            description: description,
            earnedTimestamp: block.timestamp,
            requiredValue: requirements[category][level],
            metadataURI: metadataURI
        });
        
        // Update user records
        userAchievements[user].push(newTokenId);
        userCategoryLevel[user][category] = level;
        
        emit AchievementMinted(newTokenId, user, category, level, title);
        
        return newTokenId;
    }
    
    /**
     * @dev Check if user qualifies for achievement
     */
    function checkQualification(
        address user,
        AchievementCategory category,
        AchievementLevel level,
        uint256 userValue
    ) external view returns (bool) {
        return userValue >= requirements[category][level] &&
               (userCategoryLevel[user][category] < level || 
                userCategoryLevel[user][category] == AchievementLevel.BRONZE);
    }
    
    /**
     * @dev Get next achievement requirement for user
     */
    function getNextAchievement(address user, AchievementCategory category) 
        external view returns (AchievementLevel nextLevel, uint256 requiredValue) {
        
        AchievementLevel currentLevel = userCategoryLevel[user][category];
        
        if (currentLevel == AchievementLevel.DIAMOND) {
            return (AchievementLevel.DIAMOND, 0); // Max level reached
        }
        
        AchievementLevel nextAchievementLevel = AchievementLevel(uint256(currentLevel) + 1);
        return (nextAchievementLevel, requirements[category][nextAchievementLevel]);
    }
    
    /**
     * @dev Get user's achievements
     */
    function getUserAchievements(address user) external view returns (uint256[] memory) {
        return userAchievements[user];
    }
    
    /**
     * @dev Get achievement details
     */
    function getAchievementDetails(uint256 tokenId) external view returns (Achievement memory) {
        require(_exists(tokenId), "Achievement does not exist");
        return achievements[tokenId];
    }
    
    /**
     * @dev Get user's level in each category
     */
    function getUserCategoryLevels(address user) external view returns (
        AchievementLevel energyLevel,
        AchievementLevel waterLevel,
        AchievementLevel wasteLevel,
        AchievementLevel ecoLevel,
        AchievementLevel pioneerLevel,
        AchievementLevel expertLevel
    ) {
        return (
            userCategoryLevel[user][AchievementCategory.ENERGY_SAVER],
            userCategoryLevel[user][AchievementCategory.WATER_GUARDIAN],
            userCategoryLevel[user][AchievementCategory.WASTE_WARRIOR],
            userCategoryLevel[user][AchievementCategory.ECO_CHAMPION],
            userCategoryLevel[user][AchievementCategory.GREEN_PIONEER],
            userCategoryLevel[user][AchievementCategory.SUSTAINABILITY_EXPERT]
        );
    }
    
    /**
     * @dev Update achievement requirements
     */
    function updateRequirement(
        AchievementCategory category,
        AchievementLevel level,
        uint256 value
    ) external onlyOwner {
        requirements[category][level] = value;
        emit RequirementsUpdated(category, level, value);
    }
    
    /**
     * @dev Authorize/deauthorize minters
     */
    function setMinterAuthorization(address minter, bool authorized) external onlyOwner {
        authorizedMinters[minter] = authorized;
        emit MinterAuthorized(minter, authorized);
    }
    
    /**
     * @dev Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override required functions
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Get contract statistics
     */
    function getContractStats() external view returns (
        uint256 totalAchievements,
        uint256 totalUsers,
        string memory contractName,
        string memory contractSymbol
    ) {
        // Note: totalUsers would need additional tracking in a real implementation
        return (
            _tokenIds.current(),
            0, // Placeholder for total users
            name(),
            symbol()
        );
    }
}
