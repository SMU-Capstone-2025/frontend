import React, { useEffect, useState } from "react";
import ScheduleCard from "./ScheduleCard";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";
import { useNavigate } from "react-router-dom";

const weekdays = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];

const formatKoreanDate = (yyyyMmDd) => {
  if (!yyyyMmDd) return "";
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  const weekday = weekdays[date.getDay()];
  return `${mm}월 ${dd}일 ${weekday}`;
};

const calcDday = (yyyyMmDd) => {
  if (!yyyyMmDd) return "";
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(y, m - 1, d);
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 0;
  return `${diffDays}`;
};

const ScheduleListPreview = ({ projectId }) => {
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();
  const handleCardClick = (projectId) => {
    navigate(`/project/workboard/${projectId}`);
  };

  const fetchSchedules = async () => {
    if (!projectId) return;
    try {
      const res = await axiosInstanceNoHeader.get("/task/list/deadline");
      setSchedules(res.data.result || []);
    } catch (e) {
      console.log("일정 불러오기 실패~!\n", e);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [projectId]);

  return (
    <div className="flex flex-col w-full max-w-full lg:max-w-[588px] flex-wrap items-start gap-y-3 font-[Livvic]">
      {schedules.map((schedule, idx) => {
        const lastContent =
          schedule.versionHistory?.[schedule.versionHistory.length - 1]
            ?.content || "";
        const isSameDeadline =
          idx > 0 && schedules[idx - 1].deadline === schedule.deadline;

        return (
          <div key={schedule.id} className="w-full">
            {schedule.status === "COMPLETED" ? null : isSameDeadline ? (
              <ScheduleCard
                schedule={{ ...schedule, content: lastContent }}
                onClick={() => handleCardClick(schedule.projectId)}
              />
            ) : (
              <>
                {/* D-day 라벨 + 날짜 */}
                <div className="flex items-center gap-1 mt-4">
                  {calcDday(schedule.deadline) < 0 ? (
                    <span className="p-1 font-semibold text-sm sm:text-base text-[#e40505]">
                      D+{Math.abs(calcDday(schedule.deadline))}
                    </span>
                  ) : calcDday(schedule.deadline) === 0 ? (
                    <span className="p-1 font-semibold text-sm sm:text-base text-[#e40505]">
                      D-day
                    </span>
                  ) : calcDday(schedule.deadline) < 10 ? (
                    <span className="p-1 text-sm font-semibold text-orange-500 sm:text-base">
                      D-{calcDday(schedule.deadline)}
                    </span>
                  ) : (
                    <span className="p-1 font-semibold text-sm sm:text-base text-[#9CA3AF]">
                      D-{calcDday(schedule.deadline)}
                    </span>
                  )}

                  <span className="text-sm sm:text-sm font-semibold text-[#6d7280]">
                    {formatKoreanDate(schedule.deadline)}
                  </span>
                </div>

                {/* 일정 카드 */}
                <div className="mt-2">
                  <ScheduleCard
                    schedule={{ ...schedule, content: lastContent }}
                    onClick={() => handleCardClick(schedule.projectId)}
                  />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleListPreview;
