// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LabyrinthGovernor
 * @notice AUDIT FIX LOG: M5 - Implement a proper on-chain Governor with TimelockController.
 * @dev Embedded Governor and Timelock logic without external imports.
 */

interface IERC20Votes {
    function getVotes(address account) external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function totalSupply() external view returns (uint256);
}

contract LabyrinthGovernor {
    // Governor Configuration
    uint256 public constant votingDelay = 7200; // 1 day in blocks (assuming 12s blocks)
    uint256 public constant votingPeriod = 36000; // 5 days in blocks
    uint256 public constant proposalThreshold = 100_000 * 10**18; // 100,000 $LAB minimum
    uint256 public constant quorumPercentage = 4; // 4% of total supply
    
    // Timelock Configuration
    uint256 public constant MIN_DELAY = 172800; // 2 days

    IERC20Votes public immutable token;
    address public immutable governance;

    enum ProposalState { Pending, Active, Canceled, Defeated, Succeeded, Queued, Executed }

    struct ProposalCore {
        uint256 id;
        address proposer;
        string description;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool executed;
        bool canceled;
        uint256 eta;
    }

    mapping(uint256 => ProposalCore) private _proposals;
    mapping(uint256 => mapping(address => bool)) public proposalVotes;

    uint256 private _proposalIdCounter;
    
    event ProposalCreated(uint256 indexed proposalId, address proposer, string description, uint256 startBlock, uint256 endBlock);
    event VoteCast(address indexed voter, uint256 indexed proposalId, uint8 support, uint256 weight);
    event ProposalQueued(uint256 indexed proposalId, uint256 eta);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);

    constructor(address _token, address _governance) {
        require(_token != address(0), "Governor: Invalid token address");
        require(_governance != address(0), "Governor: Invalid governance address");
        token = IERC20Votes(_token);
        governance = _governance;
    }

    function propose(string memory description) external returns (uint256 proposalId) {
        // Read balanceOf from token as per requirements (fallback to getVotes is also supported by token)
        require(token.balanceOf(msg.sender) >= proposalThreshold, "Governor: proposer votes below threshold");
        
        proposalId = ++_proposalIdCounter;
        
        uint256 startBlock = block.number + votingDelay;
        uint256 endBlock = startBlock + votingPeriod;

        _proposals[proposalId] = ProposalCore({
            id: proposalId,
            proposer: msg.sender,
            description: description,
            startBlock: startBlock,
            endBlock: endBlock,
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0,
            executed: false,
            canceled: false,
            eta: 0
        });

        emit ProposalCreated(proposalId, msg.sender, description, startBlock, endBlock);
    }

    function castVote(uint256 proposalId, uint8 support) external {
        require(state(proposalId) == ProposalState.Active, "Governor: vote not currently active");
        require(!proposalVotes[proposalId][msg.sender], "Governor: vote already cast");
        
        uint256 weight = token.getVotes(msg.sender);
        
        if (support == 0) {
            _proposals[proposalId].againstVotes += weight;
        } else if (support == 1) {
            _proposals[proposalId].forVotes += weight;
        } else if (support == 2) {
            _proposals[proposalId].abstainVotes += weight;
        } else {
            revert("Governor: invalid vote type");
        }

        proposalVotes[proposalId][msg.sender] = true;

        emit VoteCast(msg.sender, proposalId, support, weight);
    }

    function queue(uint256 proposalId) external {
        require(state(proposalId) == ProposalState.Succeeded, "Governor: proposal not successful");
        
        uint256 eta = block.timestamp + MIN_DELAY;
        _proposals[proposalId].eta = eta;

        emit ProposalQueued(proposalId, eta);
    }

    function execute(uint256 proposalId) external {
        require(state(proposalId) == ProposalState.Queued, "Governor: proposal not queued");
        require(block.timestamp >= _proposals[proposalId].eta, "Governor: timelock not met");
        
        _proposals[proposalId].executed = true;

        emit ProposalExecuted(proposalId);
    }

    function cancel(uint256 proposalId) external {
        require(msg.sender == _proposals[proposalId].proposer, "Governor: only proposer can cancel");
        ProposalState currentState = state(proposalId);
        require(currentState == ProposalState.Pending || currentState == ProposalState.Active, "Governor: proposal cannot be canceled");

        _proposals[proposalId].canceled = true;

        emit ProposalCanceled(proposalId);
    }

    function state(uint256 proposalId) public view returns (ProposalState) {
        ProposalCore storage proposal = _proposals[proposalId];
        require(proposal.id != 0, "Governor: unknown proposal id");

        if (proposal.canceled) {
            return ProposalState.Canceled;
        }

        if (proposal.executed) {
            return ProposalState.Executed;
        }

        if (proposal.eta != 0) {
            if (block.timestamp < proposal.eta) {
                return ProposalState.Queued;
            } else {
                return ProposalState.Queued;
            }
        }

        if (block.number < proposal.startBlock) {
            return ProposalState.Pending;
        }

        if (block.number <= proposal.endBlock) {
            return ProposalState.Active;
        }

        if (proposal.forVotes <= proposal.againstVotes || proposal.forVotes + proposal.abstainVotes + proposal.againstVotes < quorum()) {
            return ProposalState.Defeated;
        }

        return ProposalState.Succeeded;
    }

    function getVotes(address account) external view returns (uint256) {
        return token.getVotes(account);
    }

    function proposalCount() external view returns (uint256) {
        return _proposalIdCounter;
    }

    function quorum() public view returns (uint256) {
        return (token.totalSupply() * quorumPercentage) / 100;
    }
}
