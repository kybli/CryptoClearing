// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StockOwnership {
    address public owner;
    
    mapping(uint256 => address) public stockOwners;
    mapping(uint256 => uint256) public stockPrices;

    event StockOwnershipTransfer(address indexed previousOwner, address indexed newOwner, uint256 indexed stockId, uint256 price);

    constructor() {
        owner = msg.sender;
    }

    function mintStock(uint256 stockId, uint256 initialPrice) external onlyOwner {
        require(stockOwners[stockId] == address(0), "Stock already owned");
        stockOwners[stockId] = owner;
        stockPrices[stockId] = initialPrice;
        emit StockOwnershipTransfer(address(0), owner, stockId, initialPrice);
    }

    function transferStockOwnership(uint256 stockId, address buyer) external payable {
        address seller = stockOwners[stockId];
        uint256 price = stockPrices[stockId];

        require(seller == msg.sender, "Only the current owner can transfer ownership");
        require(buyer != address(0), "Invalid buyer address");
        require(msg.value == price, "Incorrect payment amount");

        stockOwners[stockId] = buyer;
        stockPrices[stockId] = 0;
        payable(seller).transfer(msg.value);
        emit StockOwnershipTransfer(seller, buyer, stockId, price);
    }

    function setStockPrice(uint256 stockId, uint256 newPrice) external onlyOwner {
        stockPrices[stockId] = newPrice;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }
}
