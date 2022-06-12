// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Project {
    address payable creator;
    string public title;
    string public description;
    uint public goal;
    uint public currentBalance;

    // Map to manage the contributors
    mapping(address => uint) contributors;
    address[] private contributorsList;

    // Event for when a project is finished
    event ProjectFinished(
        address contractAddress,
        address fundator,
        uint goal,
        uint currentBalance
    );
    
    // Event for when return the contribution to a contributor
    event ReturnContribution(
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
    ) public {
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

    function contribute(uint contribution) external payable {
        require(msg.sender != creator, "You can't contribute to your own project");
        require(msg.value > 0, "You can't contribute 0 ether");
        require(msg.value <= contribution, "You don't have enough ether");
        require(msg.value <= ((goal - currentBalance) * 1 ether), "You can't contribute more than the goal");

        currentBalance += msg.value / 1 ether;
        contributors[msg.sender] += msg.value / 1 ether;
        addIfAddressNotExist(msg.sender);
    }

    function finishGoal() external isCreator {
        require(currentBalance >= goal, "The goal has not been reached");

        // Transfer the money to the creator
        creator.transfer(goal);

        emit ProjectFinished(
            address(this),
            creator,
            goal,
            currentBalance
        );

        // Remove the project
        selfdestruct(creator);
    }

    function refundGoal() external isCreator {
        // Refund the money to the contributors
        for (uint i = 0; i < contributorsList.length; i++) {
            payable(contributorsList[i]).transfer(contributors[contributorsList[i]] * 1 ether);
            // Emit event to return the contribution
            emit ReturnContribution(
                contributorsList[i],
                contributors[contributorsList[i]]
            );
        }

        // Remove the project
        selfdestruct(creator);
    }
}