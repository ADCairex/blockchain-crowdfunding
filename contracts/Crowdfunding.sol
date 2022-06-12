// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Project.sol";

contract Crowdfunding {
    // List of all projects
    Project[] private projects;
    
    // Event for when a project is created
    event ProjectCreated(
        address contractAddress,
        address fundator,
        uint goal
    );

    function showProjects() external view returns(Project[] memory) {
        return projects;
    }

    function createProject(
        string memory title,
        string memory description,
        uint goal
    ) external {
        // Create a new project
        Project newProject = new Project(
            payable(msg.sender),
            title,
            description,
            goal
        );

        // Add the project to the list of projects
        projects.push(newProject);

        // Emit the event
        emit ProjectCreated(
            address(newProject),
            msg.sender,
            goal
        );
    }
}