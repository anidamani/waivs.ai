import Image from "next/image";
import React from "react";
import AddPatient from "./AddPatient";

const NoPatients = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-440px)]">
      <Image
        src="/icons/user-empty.svg"
        alt="No Patients"
        width={100}
        height={100}
        className="mb-5"
      />
      
      <h1 className="text-2xl font-bold">No Patients Added Yet</h1>
      <p className="mb-5">Start by adding patients to begin recording</p>
      <AddPatient />
    </div>
  );
};

export default NoPatients;
