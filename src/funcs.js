import CrowdfundingJSON from "../build/contracts/Crowdfunding.json";
import ProjectJSON from "../build/contracts/Project.json";
import Web3 from "web3";
const contract = require("@truffle/contract");

export const load = async () => {
  await loadWeb3();
  const addressAccount = await loadAccount();
  const crowdfundingContract = await loadCrowdfundingContract();
  const projectContracts = await loadProjects();

  return { addressAccount, crowdfundingContract, projectContracts };
};

const loadProjects = async () => {
  const crowdfundingContract = contract(CrowdfundingJSON);
  crowdfundingContract.setProvider(web3.currentProvider);
  const instance = await crowdfundingContract.deployed();
  const projects = await instance.showProjects();
  var projectContracts = await projects.map(async (address) => {
    const projectContract = contract(ProjectJSON);
    projectContract.setProvider(web3.currentProvider);
    try {
      const projectInstance = await projectContract.at(address);
      return projectInstance;
    } catch (error) {}
    return;
  });

  return projectContracts;
};

const loadCrowdfundingContract = async () => {
  const crowdfundingContract = contract(CrowdfundingJSON);
  crowdfundingContract.setProvider(web3.currentProvider);
  const crowdfundingInstance = await crowdfundingContract.deployed();
  return crowdfundingInstance;
};

const loadAccount = async () => {
  const addressAccount = await web3.eth.getCoinbase();
  return addressAccount;
};

const loadWeb3 = async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      await ethereum.enable();
      // Acccounts now exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    } catch (error) {
      // User denied account access...
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    // Acccounts always exposed
    web3.eth.sendTransaction({
      /* ... */
    });
  }
  // Non-dapp browsers...
  else {
    console.log(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};
