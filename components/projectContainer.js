import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Web3 from "web3";

export const ProjectContainer = (props) => {
  const { contract, addressAccount } = props;

  const [resolvedContract, setResolvedContract] = useState(null);

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [ownerAddress, setOwnerAddress] = useState(null);

  const [contribution, setContribution] = useState(0);

  const errorContractOwner = () =>
    toast("You can't contribute to your own project");
  const errorCeroContribution = () =>
    toast("You can't contribute with 0 ether.");
  const errorMoreThanGoal = () =>
    toast("You can't contribute more than the goal.");
  const successContribution = () => toast("Contribution successful");

  if (!contract) {
    return <div>Loading...</div>;
  }

  if (loading) {
    contract.then((e) => {
      setLoading(false);
      e.title().then((titleResponse) => setTitle(titleResponse));
      e.description().then((descriptionResponse) =>
        setDescription(descriptionResponse)
      );
      e.goal().then((goalResponse) => setGoal(goalResponse.words[0]));
      e.seeContractBalance().then((balanceResponse) =>
        setBalance(parseInt(balanceResponse.toString()) / 10 ** 18)
      );
      e.seeOwner().then((ownerAddressResponse) =>
        setOwnerAddress(ownerAddressResponse)
      );
      setResolvedContract(e);
    });
    return <div>Loading...</div>;
  }

  const handleContribution = () => {
    let canContribute = true;
    if (addressAccount.toUpperCase() == ownerAddress.toUpperCase()) {
      errorContractOwner();
      canContribute = false;
    }
    if (contribution == 0) {
      errorCeroContribution();
      canContribute = false;
    }
    if (parseFloat(contribution) + balance > goal) {
      errorMoreThanGoal();
      canContribute = false;
    }

    if (canContribute) {
      resolvedContract.contribute({
        from: addressAccount,
        value: contribution * 10 ** 18,
      });
      successContribution();
    }
  };

  return (
    <>
      <div className="flex flex-col">
        Title: {title}
        <br />
        Description: {description}
        <br />
        Goal: {goal}
        <br />
        Balance: {balance}
        <br />
        <label
          htmlFor="Contribution"
          className="block text-sm font-medium leading-5 text-gray-700"
        >
          Contribution
        </label>
        <input
          id="Contribution"
          type="number"
          value={contribution}
          onChange={(e) => {
            setContribution(e.target.value);
          }}
          className="border-2 h-full w-12"
        />
        <button
          onClick={() => {
            handleContribution();
          }}
        >
          Contribute
        </button>
      </div>
      <Toaster />
    </>
  );
};
