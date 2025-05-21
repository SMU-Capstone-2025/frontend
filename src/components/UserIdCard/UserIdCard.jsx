import React, { use, useEffect, useState } from "react";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const UserIdCard = () => {
  const [userInfo, setUserInfo] = useState({});

  const getUserIdInfo = async () => {
    try {
      const res = await axiosInstanceNoHeader.get("/mypage/user");
      console.log("유저 정보 가져오기 성공~!", res);
      setUserInfo(res.data.result);
      return res;
    } catch (error) {
      console.log("유저 정보 가져오기 실패~!\n", error);
      return error;
    }
  };

  useEffect(() => {
    getUserIdInfo();
  });

  return (
    <div className="w-60 h-[100] p-3.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-start items-center gap-2.5 overflow-hidden">
      <div className=" w-full flex justify-start items-center gap-2">
        <img
          className="w-12 h-12 rounded-full"
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-978409_1280.png"
          alt="profile"
        />
        <div className="flex flex-col justify-start items-start gap-1">
          <div className="flex-row text-gray-900 text-base font-bold font-['Pretendard']">
            이름
          </div>
          <div className="flex-row text-gray-500 text-sm font-normal font-['Pretendard']">
            이메일
          </div>
        </div>
      </div>
      <div
        data-property-1="basics"
        className="self-stretch h-7 px-12 py-[5px] bg-gray-600 rounded inline-flex justify-center items-center gap-2.5"
      >
        <div className="justify-start text-white text-xs font-bold font-['Pretendard'] leading-none [text-shadow:_0px_4px_20px_rgb(0_0_0_/_0.15)]">
          기본 요금제
        </div>
      </div>
      <div className="text-center justify-center text-gray-400 text-xs font-bold font-['Pretendard'] leading-none">
        프로필 이동
      </div>
    </div>
  );
};

export default UserIdCard;
