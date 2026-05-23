// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Same logic as BSC contract — TRON's TVM is Solidity-compatible.
// Note: USDT TRC20 uses 6 decimals (vs 18 on BEP20). Adjust minStake before deploy.

interface ITRC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract USDTStaking {
    address public owner;
    address public usdtToken;

    uint256 public dailyRateBps  = 50;            // 0.5% per day
    uint256 public stakeDuration = 100 days;
    uint256 public referralBps   = 300;
    uint256 public minStake      = 10 * 1e6;      // 10 USDT — TRC20 has 6 decimals

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaim;
        bool    active;
        bool    principalWithdrawn;
    }

    mapping(address => Stake[])  public stakes;
    mapping(address => address)  public referrers;
    mapping(address => uint256)  public referralBalance;
    mapping(address => bool)     public banned;

    event Staked(address indexed user, uint256 amount, uint256 stakeIndex);
    event Claimed(address indexed user, uint256 amount, uint256 stakeIndex);
    event PrincipalWithdrawn(address indexed user, uint256 amount, uint256 stakeIndex);
    event ReferralPaid(address indexed referrer, address indexed referee, uint256 amount);
    event ReferralWithdrawn(address indexed referrer, uint256 amount);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }
    modifier notBanned() { require(!banned[msg.sender], "Banned"); _; }

    constructor(address _usdtToken) {
        owner = msg.sender;
        usdtToken = _usdtToken;
    }

    function stake(uint256 amount, address referrer) external notBanned {
        require(amount >= minStake, "Below minimum stake");
        require(ITRC20(usdtToken).transferFrom(msg.sender, address(this), amount), "Transfer failed");

        if (referrer != address(0) && referrer != msg.sender && referrers[msg.sender] == address(0)) {
            referrers[msg.sender] = referrer;
            uint256 refAmount = (amount * referralBps) / 10_000;
            referralBalance[referrer] += refAmount;
            emit ReferralPaid(referrer, msg.sender, refAmount);
        }

        stakes[msg.sender].push(Stake({
            amount: amount,
            startTime: block.timestamp,
            lastClaim: block.timestamp,
            active: true,
            principalWithdrawn: false
        }));

        emit Staked(msg.sender, amount, stakes[msg.sender].length - 1);
    }

    function claimDaily(uint256 stakeIndex) external notBanned {
        Stake storage s = stakes[msg.sender][stakeIndex];
        require(s.active, "Stake not active");
        require(block.timestamp >= s.lastClaim + 1 days, "Wait 24h between claims");

        uint256 daysPassed  = (block.timestamp - s.lastClaim) / 1 days;
        uint256 claimAmount = (s.amount * dailyRateBps * daysPassed) / 10_000;

        s.lastClaim = block.timestamp;
        require(ITRC20(usdtToken).transfer(msg.sender, claimAmount), "Claim transfer failed");
        emit Claimed(msg.sender, claimAmount, stakeIndex);
    }

    function withdrawPrincipal(uint256 stakeIndex) external notBanned {
        Stake storage s = stakes[msg.sender][stakeIndex];
        require(s.active, "Not active");
        require(!s.principalWithdrawn, "Already withdrawn");
        require(block.timestamp >= s.startTime + stakeDuration, "Stake duration not reached");

        s.active = false;
        s.principalWithdrawn = true;
        require(ITRC20(usdtToken).transfer(msg.sender, s.amount), "Principal transfer failed");
        emit PrincipalWithdrawn(msg.sender, s.amount, stakeIndex);
    }

    function withdrawReferral() external notBanned {
        uint256 amount = referralBalance[msg.sender];
        require(amount > 0, "Zero balance");
        referralBalance[msg.sender] = 0;
        require(ITRC20(usdtToken).transfer(msg.sender, amount), "Referral transfer failed");
        emit ReferralWithdrawn(msg.sender, amount);
    }

    function getStakes(address user) external view returns (Stake[] memory) {
        return stakes[user];
    }

    function setDailyRate(uint256 newBps)       external onlyOwner { dailyRateBps  = newBps;   }
    function setStakeDuration(uint256 newSec)   external onlyOwner { stakeDuration = newSec;   }
    function setReferralRate(uint256 newBps)    external onlyOwner { referralBps   = newBps;   }
    function setMinStake(uint256 newMin)        external onlyOwner { minStake      = newMin;   }
    function setBanned(address user, bool b)    external onlyOwner { banned[user]  = b;        }
    function transferOwnership(address newOwn)  external onlyOwner { owner         = newOwn;   }
    function emergencyWithdraw(uint256 amount)  external onlyOwner {
        require(ITRC20(usdtToken).transfer(owner, amount), "Emergency withdraw failed");
    }
}
