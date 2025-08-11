import React, { useEffect, useState } from "react";
import ScheduleCard from "./ScheduleCard";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

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
  if (diffDays < 0) return -1;
  if (diffDays === 0) return 0;
  return `${diffDays}`;
};

const ScheduleListPreview = ({ projectId }) => {
  const [schedules, setSchedules] = useState([]);

  const fetchSchedules = async () => {
    if (!projectId) return;
    try {
      const res = await axiosInstanceNoHeader.get("/task/list/deadline");
      setSchedules(res.data.result || []);
      console.log("✅ 스케줄 리스트:", res.data.result);
    } catch (e) {
      console.log("일정 불러오기 실패~!\n", e);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [projectId]);

  return (
    <div className="flex flex-col w-full max-w-[588px] flex-wrap items-start gap-[10px]">
      {schedules.map((schedule, idx) => {
        const lastContent =
          schedule.versionHistory?.[schedule.versionHistory.length - 1]
            ?.content || "";
        const isSameDeadline =
          idx > 0 && schedules[idx - 1].deadline === schedule.deadline;
        return (
          <div key={schedule.id} className="w-full">
            {isSameDeadline ? ( // 같은 마감일인 경우 카드만 렌더
              //카드에 최신 버전 content를 넘겨서 렌더
              <ScheduleCard schedule={{ ...schedule, content: lastContent }} />
            ) : (
              <>
                <div className="pb-1 flex justify-start items-start">
                  {calcDday(schedule.deadline) === 0 ? ( // D-day가 0인 경우 빨간색으로 표시
                    <span className="pl-1 font-semibold font-['Livvic'] text-sm leading-tight text-[#e40505]">
                      D-day
                    </span>
                  ) : // D-day가 양수인 경우, 중첩삼항
                  calcDday(schedule.deadline) < 10 ? ( // D-day가 10일 이하인 경우
                    <span className="pl-1 font-semibold font-['Livvic'] text-sm leading-tight text-[Orange]">
                      D-{calcDday(schedule.deadline)}
                    </span>
                  ) : (
                    // D-day가 10일넘게 남은 경우
                    <span className="pl-1 font-semibold font-['Livvic'] text-sm leading-tight text-[#9CA3AF]">
                      D-{calcDday(schedule.deadline)}
                    </span>
                  )}

                  <span className="ml-2 text-sm font-['Livvic'] font-semibold text-[#6d7280]">
                    {formatKoreanDate(schedule.deadline)}
                  </span>
                </div>
                <ScheduleCard
                  schedule={{ ...schedule, content: lastContent }}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleListPreview;
