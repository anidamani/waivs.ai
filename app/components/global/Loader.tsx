import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <Image
      src="/logo.svg"
      width={150}
      height={150}
      alt="logo"
      className="animate-pulse"
    />
  );
};

export default Loader;
