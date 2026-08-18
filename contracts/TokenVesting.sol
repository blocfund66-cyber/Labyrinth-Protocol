// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TokenVesting
 * @dev Vesting schedule for the founder+dev allocation.
 *
 * AUDIT FIX LOG:
 * - H4: Added TokenVesting contract for founder+dev allocation (220,000,000 $LAB).
 *       Implements a 12-month cliff and linear release over 36 months.
 */

interface IERC20Token {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract TokenVesting {
    IERC20Token public token;
    address public beneficiary;

    uint256 public start;
    uint256 public cliff;
    uint256 public duration;

    uint256 public released;

    event TokensReleased(address beneficiary, uint256 amount);

    /**
     * @dev Creates a vesting contract that vests its balance of any ERC20 token to the
     * beneficiary, gradually in a linear fashion after a 12-month cliff over a 36-month period.
     * @param token_ address of the ERC20 token contract
     * @param beneficiary_ address of the beneficiary to whom vested tokens are transferred
     * @param start_ the time (as Unix time) at which point vesting starts
     */
    constructor(
        address token_,
        address beneficiary_,
        uint256 start_
    ) {
        require(token_ != address(0), "TokenVesting: token is the zero address");
        require(beneficiary_ != address(0), "TokenVesting: beneficiary is the zero address");
        
        token = IERC20Token(token_);
        beneficiary = beneficiary_;
        start = start_;
        
        // 12-month cliff
        cliff = start + 365 days;
        // 36 months duration after cliff
        duration = 3 * 365 days;
    }

    /**
     * @notice Transfers vested tokens to beneficiary.
     */
    function release() public {
        require(msg.sender == beneficiary, "TokenVesting: only beneficiary can release");
        uint256 unreleased = releasableAmount();
        require(unreleased > 0, "TokenVesting: no tokens are due");

        released += unreleased;
        require(token.transfer(beneficiary, unreleased), "TokenVesting: transfer failed");

        emit TokensReleased(beneficiary, unreleased);
    }

    /**
     * @notice Calculates the amount that has already vested but hasn't been released yet.
     * @return The amount of tokens that can be released.
     */
    function releasableAmount() public view returns (uint256) {
        return vestedAmount() - released;
    }

    /**
     * @notice Calculates the amount that has already vested.
     * @return The amount of tokens vested.
     */
    function vestedAmount() public view returns (uint256) {
        uint256 currentBalance = token.balanceOf(address(this));
        uint256 totalBalance = currentBalance + released;

        if (block.timestamp < cliff) {
            return 0;
        } else if (block.timestamp >= cliff + duration) {
            return totalBalance;
        } else {
            return (totalBalance * (block.timestamp - cliff)) / duration;
        }
    }
}
