import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const style = {
  finishButton:
    "text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-3 py-2.5 text-center mr-2 mb-2 mt-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
  cancelButton:
    "text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:red-green-300 font-medium rounded-full text-sm px-3 py-2.5 text-center mr-2 mb-2 mt-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800",
  contributeButton:
    "text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-3 py-2.5 text-center mr-2 mb-2 mt-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
  contributionInput:
    "form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
};

export const ProjectContainer = (props) => {
  const { contract, addressAccount } = props;

  const [resolvedContract, setResolvedContract] = useState(null);
  const [refresh, setRefresh] = useState(true);

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [ownerAddress, setOwnerAddress] = useState(null);

  const [contribution, setContribution] = useState(0);

  const [finishedProject, setFinishedProject] = useState(false);

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
  contract.then((e) => {
    if (!refresh) return;
    setRefresh(false);
    try {
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
    } catch (error) {
      setFinishedProject(true);
    }
  });
  /*
  useEffect(() => {
    
  }, [refresh]);*/

  const handleContribution = async () => {
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
      let x = await resolvedContract.contribute({
        from: addressAccount,
        value: contribution * 10 ** 18,
      });
      console.log(x);
      successContribution();
    }
    setRefresh(true);
  };

  const handleButtonProject = () => {
    if (addressAccount.toUpperCase() == ownerAddress.toUpperCase()) {
      if (balance == goal)
        return (
          <button
            className={style.finishButton}
            onClick={() => finishProject()}
          >
            Finalizar
          </button>
        );
      return (
        <button className={style.cancelButton} onClick={() => cancelProject()}>
          Cancelar
        </button>
      );
    }
  };

  const finishProject = () => {
    resolvedContract.finishGoal({
      from: addressAccount,
    });
    setRefresh(true);
  };

  const cancelProject = () => {
    resolvedContract.refundGoal({
      from: addressAccount,
    });
    setRefresh(true);
  };

  const progressBarPercentage = () => {
    if (goal == 0) return 0;
    return Math.round((balance / goal) * 100);
  };

  const colorProgressBar = () => {
    if (progressBarPercentage() < 25) return "bg-red-500";
    if (progressBarPercentage() < 50) return "bg-orange-500";
    if (progressBarPercentage() < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (!finishedProject) {
    return (
      <>
        <div className="max-w-xl w-1/3 rounded overflow-hidden shadow-xl p-4 m-auto mb-7 border-2">
          <p className="font-bold text-xl mb-2">
            Title: <span className="text-gray-700 text-base">{title}</span>
          </p>
          <p className="font-bold text-xl mb-2">
            Description:{" "}
            <span className="text-gray-700 text-base">{description}</span>
          </p>
          <label
            htmlFor="Contribution"
            className="block text-sm font-medium leading-5 text-gray-700"
          >
            Contribution
          </label>
          <input
            id="Contribution"
            type="number"
            min="0"
            value={contribution}
            onChange={(e) => {
              setContribution(e.target.value);
            }}
            className={style.contributionInput}
          />
          <button
            className={style.contributeButton}
            onClick={() => {
              handleContribution();
            }}
          >
            Contribute
          </button>
          <div className="flex flex-row justify-between mt-5">
            <span className="font-bold text-xl mb-2 w-min whitespace-nowrap">
              {balance} ETH
            </span>
            <span className="font-bold text-xl mb-2 w-min whitespace-nowrap">
              {goal} ETH
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              style={{ width: progressBarPercentage() + "%" }}
              className={colorProgressBar() + " h-2.5 rounded-full"}
            ></div>
          </div>
          <br />
          {ownerAddress ? handleButtonProject() : null}
        </div>
        <Toaster />
      </>
    );
  }
  return null;
};
