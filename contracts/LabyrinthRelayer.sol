// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LabyrinthRelayer
 * @notice Decentralized Automated Relayer Registry for Labyrinth V1
 * @dev Manages registered automated relayer nodes, stake requirements, and gasless withdrawal dispatching.
 */

contract LabyrinthRelayer {
    address public governance;
    uint256 public minRelayerStake = 10,000 * 1e18; // 10,000 $LAB minimum stake to register relayer node

    struct RelayerNode {
        address relayerAddress;
        string endpointUrl;
        uint256 feeBps;
        uint256 totalTxProcessed;
        bool isActive;
    }

    mapping(address => RelayerNode) public relayers;
    address[] public relayerList;

    event RelayerRegistered(address indexed relayer, string endpointUrl, uint256 feeBps);
    event RelayerStatusChanged(address indexed relayer, bool isActive);

    modifier onlyGovernance() {
        require(msg.sender == governance, "LabyrinthRelayer: Only governance");
        _;
    }

    constructor(address _governance) {
        require(_governance != address(0), "Invalid governance");
        governance = _governance;
    }

    function registerRelayer(string memory _endpointUrl, uint256 _feeBps) external {
        require(_feeBps <= 200, "Fee cannot exceed 2%"); // Max 2%
        
        if (!relayers[msg.sender].isActive) {
            relayers[msg.sender] = RelayerNode({
                relayerAddress: msg.sender,
                endpointUrl: _endpointUrl,
                feeBps: _feeBps,
                totalTxProcessed: 0,
                isActive: true
            });
            relayerList.push(msg.sender);
        } else {
            relayers[msg.sender].endpointUrl = _endpointUrl;
            relayers[msg.sender].feeBps = _feeBps;
        }

        emit RelayerRegistered(msg.sender, _endpointUrl, _feeBps);
    }

    function recordTransaction(address _relayer) external {
        if (relayers[_relayer].isActive) {
            relayers[_relayer].totalTxProcessed++;
        }
    }

    function getActiveRelayers() external view returns (address[] memory) {
        return relayerList;
    }
}
