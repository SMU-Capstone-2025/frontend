import React, { useEffect, useState } from "react";
import ScheduleCard from "./ScheduleCard";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const ScheduleListPreview = ({ projectId }) => {
  const [schedules, setSchedules] = useState([]);
  const [DeadlineList, setDeadlineList] = useState([]);

  const schedulePreview = async () => {
    if (!projectId) return; // projectId 없으면 요청하지 않음
    try {
      const res = await axiosInstanceNoHeader.get("/task/list/deadline", {
        params: {
          projectId: projectId,
        },
      });
      console.log("일정 불러오기 성공~!\n", projectId, res);
      setSchedules(res.data.result);
      return res;
    } catch (error) {
      console.log("일정 불러오기 실패~!\n", error);
      return error;
    }
  };

  //마감일 리스트 생성 및 2025-07-30 형식으로 D- 계산 후 자료저장 이후 07월 30일 수요일 형식도 저장해야함

  const caculateDeadline = (deadline) => {
    console.log("마감일 계산 함수 호출:", deadline);

    if (!deadline || typeof deadline !== "string") return "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parts = deadline.split("-");
    if (parts.length !== 3) return "";
    const [yyyy, mm, dd] = parts.map(Number);
    const date = new Date(yyyy, mm - 1, dd);

    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return "마감됨";
    } else if (diffDays === 0) {
      return "day";
    } else if (diffDays >= 1) {
      return `${diffDays}`;
    } else {
      return `${diffDays}일 전`;
    }
  };

  useEffect(() => {
    schedulePreview();
  }, [projectId]);
  //schedules의 deadline을 기준으로 정렬

  return (
    <div className="flex flex-col w-full max-w-[588px] flex-wrap items-start">
      <div>
        <span className="font-bold text-lg text-[#e40505]">
          D-{caculateDeadline("2025-07-30")}
        </span>
        <span className="ml-2 text-base text-[#6d7280]">
          {/* {schedules.deadline} */}
          07월 30일 목요일
        </span>
      </div>
      <div className="w-full flex flex-col items-start gap-1.5">
        <ScheduleCard schedule={schedules} />
        {schedules.map((schedule, idx) => (
          <ScheduleCard key={idx} schedule={schedule} />
        ))}
      </div>
    </div>
  );
};

export default ScheduleListPreview;
