// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ChallengePayment
 * @dev Handles USDC payments for challenge participation on Base
 * Entry fee: 0.3 USDC
 */
contract ChallengePayment is Ownable, ReentrancyGuard {
    IERC20 public usdc;

    // USDC address on Base mainnet
    address public constant USDC_ADDRESS = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    // Entry fee: 0.3 USDC (6 decimals)
    uint256 public constant ENTRY_FEE = 300000; // 0.3 * 10^6

    // Treasury wallet (receives payments directly)
    address public immutable treasury;

    // Track challenge participants who have paid
    mapping(bytes32 => mapping(address => bool)) public hasJoined;

    // Events
    event ChallengeJoined(address indexed participant, bytes32 challengeId, uint256 amount);

    constructor(address treasuryAddress) {
        require(treasuryAddress != address(0), "Invalid treasury address");
        usdc = IERC20(USDC_ADDRESS);
        treasury = treasuryAddress;
    }
    
    /**
     * @dev Check if user has sufficient USDC balance
     * @param user User wallet address
     * @return balanceSufficient Whether user has enough balance
     * @return balance Current USDC balance
     */
    function checkBalance(address user) public view returns (bool balanceSufficient, uint256 balance) {
        balance = usdc.balanceOf(user);
        balanceSufficient = balance >= ENTRY_FEE;
        return (balanceSufficient, balance);
    }
    
    /**
     * @dev Join a challenge by paying the entry fee in USDC
     * User must first approve this contract to spend USDC
     * @param challengeId Challenge identifier
     * @return success Whether the join was successful
     */
    function joinChallenge(bytes32 challengeId) external nonReentrant returns (bool success) {
        require(!hasJoined[challengeId][msg.sender], "Already joined this challenge");
        
        // Check balance
        (bool balanceSufficient, uint256 balance) = checkBalance(msg.sender);
        require(balanceSufficient, "Insufficient USDC balance");
        
        // Transfer USDC from user directly to treasury
        bool transferred = usdc.transferFrom(msg.sender, treasury, ENTRY_FEE);
        require(transferred, "USDC transfer failed");
        
        // Mark user as joined
        hasJoined[challengeId][msg.sender] = true;
        
        emit ChallengeJoined(msg.sender, challengeId, ENTRY_FEE);
        return true;
    }
    
    /**
     * @dev Check if user has already joined a challenge
     * @param challengeId Challenge identifier
     * @param user User wallet address
     * @return joined Whether user has joined
     */
    function checkParticipation(bytes32 challengeId, address user) external view returns (bool joined) {
        return hasJoined[challengeId][user];
    }
    
}
