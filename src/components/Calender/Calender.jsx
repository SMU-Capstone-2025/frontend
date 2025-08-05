import React, { useRef, useEffect, useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

// import "@fullcalendar/common/main.css";
// import "@fullcalendar/daygrid/main.css";

const Calender = () => {
  const [calendarTask, setCalendarTask] = useState([]);
  const calendarRef = useRef(null);

  const getCalendarTask = async () => {
    try {
      const res = await axiosInstanceNoHeader.get(
        "/mypage/calendar/events/task"
      );
      console.log("캘린더 일정 가져오기 성공~!", res.data.result);
      setCalendarTask(res.data.result);
    } catch (err) {
      console.log("캘린더 일정 가져오기 실패~!\n", err);
    }
  };

  // 오늘 날짜를 한 번에 구해서 상태로 저장
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  const [currentMonthYear, setCurrentMonthYear] = useState(`${mm}, ${yyyy}`);
  const [currentDate] = useState(formattedDate);

  const goToday = () => {
    const api = calendarRef.current.getApi();
    api.today();
    updateTitle();
  };

  const goNext = () => {
    const api = calendarRef.current.getApi();
    api.next();
    updateTitle();
  };

  const goPrev = () => {
    const api = calendarRef.current.getApi();
    api.prev();
    updateTitle();
  };

  const updateTitle = () => {
    const today = calendarRef.current.getApi().getDate();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    setCurrentMonthYear(`${month}, ${year}`);
  };

  // calendarTask를 events 배열로 변환
  const events = useMemo(() => {
    console.log("캘린더 이벤트:", calendarTask);
    // 기본 이벤트 + API에서 받아온 일정
    return [
      ...calendarTask.map((task) => ({
        title: task?.title,
        end: task?.start.slice(0, 10),
        start: task?.end,
      })),
    ];
  }, [calendarTask]);

  console.log("캘린더 이벤트df:", events);

  useEffect(() => {
    updateTitle();
    getCalendarTask();
  }, []);

  return (
    <div className="w-[1280px] h-[1205px] mx-auto">
      {/* 캘린더 헤더 */}
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="text-2xl font-bold">{currentMonthYear}</div>
        <div className="flex items-center space-x-2">
          <button
            onClick={goPrev}
            className="px-3 py-1 rounded hover:bg-gray-300"
          >
            {"<"}
          </button>
          <button
            onClick={goToday}
            className="px-3 py-1 rounded hover:bg-gray-300"
          >
            오늘
          </button>
          <button
            onClick={goNext}
            className="px-3 py-1 rounded hover:bg-gray-300"
          >
            {">"}
          </button>
        </div>
      </div>

      {/* 캘린더 본체 */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        firstDay={1}
        initialDate={currentDate}
        weekends={true}
        height={1205}
        contentHeight={1205}
        dayCellClassNames={(arg) => {
          const day = arg.date.getDay();
          if (day === 0) return ["text-red-500"];
          if (day === 6) return ["text-blue-500"];
          return [];
        }}
        events={[
          {
            title: "울랄라 작업하기",
            start: "2025-08-12",
            end: "2025-08-16",
          },
          {
            title: "슬프게 작업",
            start: "2025-08-13",
            end: "2025-08-20",
          },
          ...events,
        ]}
        eventDisplay="block"
        eventTextColor="#000"
        eventBackgroundColor="#f9fafb"
        eventBorderColor="#E5E7EB"
        eventClick={(info) => {
          console.log("이벤트 클릭:", info.event.title);
        }}
        dayHeaderContent={(arg) => {
          const day = arg.date.getDay();
          const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
          return dayNames[day];
        }}
        dayMaxEventRows={3}
      />
    </div>
  );
};

export default Calender;
