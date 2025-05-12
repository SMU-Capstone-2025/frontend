import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import UserIdCard from "../../components/UserIdCard/UserIdCard";
import Calender from "../../components/Calender/Calender";

const Mypage = () => {
  return (
    <div className="flex flex-col items-center w-[1920px] h-[1080px] pb-[156px]">
      <Navbar />
      <div className="w-[1280px] h-[1016px] py-12 flex flex-col justify-start items-start gap-5">
        <UserIdCard />
        <Calender />
      </div>
    </div>
  );
};

export default Mypage;
