// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Coin is AccessControlEnumerable {
    uint256[] private coins;
    uint256[] private counts;
    address public owner;
    address private immutable tokenPs;
    mapping(address => uint256[]) typeCoinByUser;

    constructor(uint256[] memory _coins, uint256[] memory _counts,address _tokenPs) {
        owner = msg.sender;
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        coins = _coins;
        counts = _counts;
        tokenPs = _tokenPs;
    }

    function changeStock(uint256[] memory _stock)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_stock.length == counts.length, "not the same length");
        delete counts;
        counts = _stock;
    }

    function stock() public view returns (uint256[] memory) {
        return counts;
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function changeCoins(uint256 _amount) public {
        uint256[] memory a = new uint256[](_amount + 1);
        uint256[] memory path = new uint256[](_amount + 1);
        uint256 coinPath = 0;
        a[0] = 0;
        for (uint256 i = 1; i < a.length; i++) {
            a[i] = _amount;
        }
        for (uint256 i = 0; i < coins.length; i++) {
            uint256 coin = coins[i];
            for (uint256 j = 0; j < counts[i]; j++) {
                for (uint256 s = _amount; s >= coin; s--) {
                    uint256 remainder = s - coin;
                    if (remainder >= 0) {
                        a[s] = min(1 + a[remainder], a[s]);
                        coinPath = i;
                    }
                    path[s] = coinPath;
                }
            }
        }
        bool solutionReached = a[_amount] != _amount ? true : false;
        require(solutionReached, "Not enought money");
        
        if (solutionReached) {
            uint256 countAmount = _amount;
            delete typeCoinByUser[msg.sender];
            for(uint c = 0; c<=_amount; c++){
                if(countAmount>0){
                    uint256 res = coins[path[countAmount]];
                    typeCoinByUser[msg.sender].push(res);
                    countAmount = countAmount- res;
                }
            }
        }
        uint256 len = typeCoinByUser[msg.sender].length;
        uint256 sol = uint256(a[_amount]);
        require( len == sol, "type coins not counted");
        bool isSuccess = descountQuantityCoins(typeCoinByUser[msg.sender]);
        require(isSuccess, "fail Descount Stock");
    }

    function descountQuantityCoins(uint256[] memory _coins)
        internal
        returns (bool)
    {
        uint256 descount = 0;
        for (uint256 i = 0; i < _coins.length; i++) {
            for (uint256 j = 0; j < coins.length; j++) {
                if (_coins[i] == coins[j]) {
                    if (counts[j] > 0) {
                        counts[j] = counts[j] - 1;
                        descount = descount + 1;
                    }
                }
            }
        }
        return descount == _coins.length ? true : false;
    }

    function getTypeCoins() public view returns (uint256[] memory) {
        return typeCoinByUser[msg.sender];
    }
    function transferToken() public payable {
        uint256 len = typeCoinByUser[msg.sender].length;
        for(uint i = 0;i <len;i++){
            if(typeCoinByUser[msg.sender][i] == 5){
                uint256 balance = IERC20(tokenPs).balanceOf(address(this));
                require(balance>0,"Not enought Balance");
                bool transfer = IERC20(tokenPs).transfer(_msgSender(), 5);
                require(transfer, "Transfer incomplete");
            }
        } 
        
	}
}
