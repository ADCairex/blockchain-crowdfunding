// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Project {
    address payable creator;
    string public title;
    string public description;
    uint public goal;
    uint public currentBalance;

    mapping(address => uint) contributors;
    address[] private contributorsList;

    event ProjectFinished(
        address contractAddress,
        address fundator,
        uint goal,
        uint currentBalance
    );
    
    event ReturnContribution(
        address contributor,
        uint contribution
    );

    event Contribute(
        address contributor,
        uint contribution
    );

    modifier isCreator() {
        require(msg.sender == creator, "Only the creator can do this");
        _;
    }

    constructor(
        address payable projectCreator,
        string memory projectTitle,
        string memory projectDescription,
        uint projectGoal
    ) {
        creator = projectCreator;
        title = projectTitle;
        description = projectDescription;
        goal = projectGoal;
        currentBalance = 0;
    }

    function seeOwner() external view returns(address) {
        return(creator);
    }

    function showContributors() external view returns(address[] memory) {
        return(contributorsList);
    }

    function myContribution() external view returns(uint) {
        return(contributors[msg.sender]);
    }

    function seeContractBalance() external view returns(uint) {
        return(address(this).balance);
    }

    function addIfAddressNotExist(address contributor) private {
        bool found = false;
        for (uint i = 0; i < contributorsList.length; i++) {
            if (contributorsList[i] == contributor) {
                found = true;
            }
        }
        if (!found) {
            contributorsList.push(contributor);
        }
    }

    function contribute() external payable {
        require(msg.sender != creator, "You can't contribute to your own project");
        require(msg.value > 0, "You can't contribute 0 ether");
        require(msg.value <= ((goal - currentBalance) * 1 ether), "You can't contribute more than the goal");

        currentBalance += msg.value / 1 ether;
        contributors[msg.sender] += msg.value / 1 ether;
        addIfAddressNotExist(msg.sender);

        emit Contribute(msg.sender, msg.value);
    }

    function finishGoal() external isCreator {
        require(currentBalance >= goal, "The goal has not been reached");

        creator.transfer(goal);

        emit ProjectFinished(
            address(this),
            creator,
            goal,
            currentBalance
        );

        selfdestruct(creator);
    }

    function refundGoal() external isCreator {
        for (uint i = 0; i < contributorsList.length; i++) {
            payable(contributorsList[i]).transfer(contributors[contributorsList[i]] * 1 ether);
            emit ReturnContribution(
                contributorsList[i],
                contributors[contributorsList[i]]
            );
        }

        selfdestruct(creator);
    }
}