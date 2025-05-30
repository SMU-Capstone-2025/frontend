import React, { useEffect, useState } from "react";
import ScheduleCard from "./ScheduleCard";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const ScheduleListPreview = ({ projectId }) => {
  const [schedules, setSchedules] = useState([]);

  const schedulePreview = async () => {
    if (!projectId) return; // projectId 없으면 요청하지 않음
    try {
      const res = await axiosInstanceNoHeader.get("/task/list/get", {
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

  useEffect(() => {
    schedulePreview();
  }, [projectId]);

  return (
    <div className="flex flex-col w-full max-w-[588px] flex-wrap items-start">
      <div>
        <span className="font-bold text-lg text-[#e40505]">D-DAY</span>
        <span className="ml-2 text-base text-[#6d7280]">
          {/* {schedules.deadline} */}
          00월 00일 월요일
        </span>
      </div>
      <div className="w-full flex flex-col items-start gap-1.5">
        {schedules.map((schedule, idx) => (
          <ScheduleCard key={idx} schedule={schedule} />
        ))}
      </div>
    </div>
  );
};

export default ScheduleListPreview;
