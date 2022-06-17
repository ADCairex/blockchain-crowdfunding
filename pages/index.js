import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { load } from "../src/funcs";
import Modal from "react-modal/lib/components/Modal";
import { NavBar } from "../components/navBar";
import { ProjectContainer } from "../components/projectContainer";

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    height: "50%",
  },
};

export default function Home() {
  // useState
  const [refresh, setRefresh] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [addressAccount, setAddressAccount] = useState(null);
  const [crowdfundingContract, setCrowdfundingContract] = useState(null);
  const [projectContracts, setProjectContracts] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState(0);

  // useEffect
  useEffect(() => {
    if (!refresh) return;
    setRefresh(false);
    load().then((e) => {
      setAddressAccount(e.addressAccount);
      setCrowdfundingContract(e.crowdfundingContract);
      setProjectContracts(e.projectContracts);
    });

    window.ethereum.on("accountsChanged", async () => {
      load().then((e) => {
        setAddressAccount(e.addressAccount);
        setCrowdfundingContract(e.crowdfundingContract);
        setProjectContracts(e.projectContracts);
      });
    });
  }, []);

  if (!projectContracts) return;

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleNewProject = async () => {
    crowdfundingContract.createProject(title, description, goal, {
      from: addressAccount,
    });
    setRefresh(true);
  };

  return (
    <>
      <NavBar addressAccount={addressAccount} />
      <div className={styles.container}>
        <Head>
          <title>Blockchain Crowdfunding</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="m-auto">
          <div className="m-auto w-min whitespace-nowrap">
            <button
              onClick={openModal}
              className="text-white bg-yellow-700 hover:bg-yellow-800 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-3 py-2.5 text-center mr-2 mb-5 mt-5 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 m-auto"
            >
              New project
            </button>
          </div>
          {projectContracts.map((contract, index) => {
            return (
              <ProjectContainer
                key={index}
                contract={contract}
                addressAccount={addressAccount}
              />
            );
          })}
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          style={modalStyle}
        >
          <div>
            <div className="flex flex-row justify-between">
              <h2 className="text-xl">New project</h2>
              <button className="text-red-500 font-black" onClick={closeModal}>
                X
              </button>
            </div>
            <form className="flex flex-col">
              <div>
                <p>Title:</p>
                <input
                  className="border-2"
                  type="text"
                  id="title"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <p>Description:</p>
                <input
                  className="border-2"
                  type="text"
                  id="description"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <p>Goal:</p>
                <input
                  className="border-2"
                  type="number"
                  id="goal"
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
            </form>
            <button
              className="text-white bg-yellow-700 hover:bg-yellow-800 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-3 py-2.5 text-center mr-2 mb-5 mt-5 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 m-auto"
              onClick={handleNewProject}
            >
              New project
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}
