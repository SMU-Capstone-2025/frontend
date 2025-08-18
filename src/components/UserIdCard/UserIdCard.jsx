import React, { useEffect, useState } from "react";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";
import PersonOn from "../../assets/icons/Person/PersonOn";

const UserIdCard = () => {
  const [userInfo, setUserInfo] = useState(null);

  const getUserIdInfo = async () => {
    try {
      const res = await axiosInstanceNoHeader.get("/mypage/user", {
        params: {
          Authorization: localStorage.getItem("accesToken"), // Assuming userId is stored in localStorage
        },
      });
      console.log("유저 정보 가져오기 성공~!", res.data.result);
      setUserInfo(res.data.result);
      localStorage.setItem("userName", userInfo);
      return res;
    } catch (error) {
      console.log("유저 정보 가져오기 실패~!\n", error);
      return error;
    }
  };

  useEffect(() => {
    getUserIdInfo();
  }, []);

  return (
    <div className="w-60 h-[100] p-3.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-start items-center gap-2.5 overflow-hidden">
      <div className=" w-full flex justify-start items-center gap-2">
        {userInfo && userInfo.profileImage ? (
          <img
            className="w-12 h-12 rounded-full"
            src={userInfo.profileImage}
            alt="프로필 이미지"
          />
        ) : (
          <div className="flex w-10 h-10 p-1.5 items-center gap-4 rounded-full border border-white bg-blue-100">
            <PersonOn color={"#5BA7F7"} />
          </div>
        )}
        {/* Default profile image if no profileImage is available */}

        <div className="flex flex-col justify-start items-start gap-1">
          <div className="flex-row text-gray-900 text-base font-bold font-['Livvic']">
            {userInfo ? userInfo.name : "이름"}
          </div>
          <div className="flex-row text-gray-500 text-sm font-normal font-['Palanquin']">
            {userInfo ? userInfo.email : "이메일"}
          </div>
        </div>
      </div>
      <div
        data-property-1="basics"
        className="self-stretch h-7 px-12 py-[5px] bg-gray-600 rounded inline-flex justify-center items-center gap-2.5"
      >
        <div className="justify-start text-white text-xs font-bold font-['Palanquin'] leading-none [text-shadow:_0px_4px_20px_rgb(0_0_0_/_0.15)]">
          {userInfo
            ? userInfo.membership === "상위요금제"
              ? "멤버쉽요금제 vip"
              : "기본 요금제"
            : "기본 요금제"}
        </div>
      </div>
      <div
        className="text-center justify-center text-gray-400 text-xs font-bold font-['Palanquin'] leading-none cursor-pointer"
        onClick={() => {
          window.location.href = "/mypage";
        }}
      >
        프로필 이동
      </div>
    </div>
  );
};

export default UserIdCard;
