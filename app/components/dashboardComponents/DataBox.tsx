import React from "react";
import Image from "next/image";
import { Translate } from "../global/Translate";

interface DataBoxProps {
  img: string;
  heading: string;
  count: number | string;
}
const DataBox: React.FC<DataBoxProps> = ({ img, heading, count }) => {
  return (
    <div className=" bg-[#FFFFFF]  flex gap-[18px] rounded-[20px] px-[17px] py-[20px]">
      <Image src={img} width={56} height={56} alt="" />
      <div>
        <h5 className=" font-medium text-[13px] leading-[24px] text-[#A3AED0]">
          <Translate>{heading}</Translate>
        </h5>
        <h6 className=" font-bold mt-[2px] text-[24px] leading-[32px] text-[#2B3674]">
          {count}
        </h6>
      </div>
    </div>
  );
};

export default DataBox;
