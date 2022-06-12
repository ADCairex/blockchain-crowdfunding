import react from "react";
import { useState, useEffect } from "react";

export const ProjectsContainer = (props) => {
  const { projectContracts } = props;
  console.log(projectContracts);

  if (!projectContracts) {
    console.log("loading");
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col">
      </div>
    </>
  );
};
