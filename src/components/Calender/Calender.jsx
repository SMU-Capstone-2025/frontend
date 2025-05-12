import React, { useRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

// import "@fullcalendar/common/main.css";
// import "@fullcalendar/daygrid/main.css";

const Calender = () => {
  const calendarRef = useRef(null);
  const [currentMonthYear, setCurrentMonthYear] = useState("");

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
    const date = calendarRef.current.getApi().getDate();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    setCurrentMonthYear(`${month}, ${year}`);
  };

  useEffect(() => {
    updateTitle();
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
        initialDate="2025-05-01"
        weekends={true}
        height={1205}
        contentHeight={1205}
        dayCellClassNames={(arg) => {
          const day = arg.date.getDay();
          if (day === 0) return ["!text-red-500"];
          if (day === 6) return ["!text-blue-500"];
          return [];
        }}
        events={[
          {
            title: "To-do: 문서 검토",
            start: "2025-05-14",
            end: "2025-05-16",
          },
          {
            title: "To-do: 회의 준비",
            start: "2025-05-18",
          },
        ]}
        dayMaxEventRows={3}
      />
    </div>
  );
};

export default Calender;
