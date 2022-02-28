// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract CrabNewsPortal {
    uint public count = 0;
    uint public lastId = 0;
    address public owner;

    uint[] public newsIdArray;

    constructor() {  
        owner = msg.sender;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    struct NewsUri{
        string infoUri;
        address author;
        uint256 timestamp;
    }

    mapping(uint => NewsUri) public NewsMap;

    function getCount() public view returns (uint returnedCount){
        returnedCount = count;
    }

    function getNewsByPosition(uint position) public view returns(NewsUri memory uri){
        require(position > 0);
        require(position <= newsIdArray.length, "News with such position does not exist");
        uri = NewsMap[newsIdArray[position-1]];
    }

    function deleteNewsByPosition(uint position) public isOwner{
        require(position > 0);
        require(position <= newsIdArray.length, "News with such position does not exist");
        delete NewsMap[newsIdArray[position-1]];
        count = count - 1;
        newsIdArray[position-1] = newsIdArray[newsIdArray.length-1];
        newsIdArray.pop();
    }

    function addNews(string memory infoUri) public {
        count = count + 1;
        lastId = lastId + 1;
        newsIdArray.push(lastId);
        NewsMap[lastId].infoUri = infoUri;
        NewsMap[lastId].author = msg.sender;
        NewsMap[lastId].timestamp = block.timestamp;
    }
}