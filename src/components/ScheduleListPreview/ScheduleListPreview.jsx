import React, { useEffect, useState } from "react";
import ScheduleCard from "./ScheduleCard";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const ScheduleListPreview = () => {
  const [schedules, setSchedules] = useState([]);
  const [deadline, setDeadline] = useState("");
  const schedulePreview = async () => {
    try {
      const res = await axiosInstanceNoHeader.get("/task/list/get", {
        params: {
          projectId: "67f917f2faed8a4ff3f02bc3",
        },
      });
      console.log("일정 불러오기 성공~!\n", res);
      setSchedules(res.data.result);
      return res;
    } catch (error) {
      console.log("일정 불러오기 실패~!\n", error);
      return error;
    }
  };

  useEffect(() => {
    schedulePreview();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6 self-stretch flex-wrap">
      <div>
        <span className="font-bold text-lg">D-DAY</span>
        <span className="ml-2 text-base">00월 00일 월요일</span>
      </div>
      <div className="col-span-2">
        {schedules.map((schedule, idx) => (
          <ScheduleCard key={idx} schedule={schedule} />
        ))}
      </div>
    </div>
  );
};

export default ScheduleListPreview;
