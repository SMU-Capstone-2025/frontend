import React, { useRef, useEffect, useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";
import "./CalendarCustom.css";

// 월 이름 매핑
const monthName = (m) =>
  [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][m - 1];

// all-day end exclusive 보정
const addDays = (dateStr, days) => {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

// 상태별 스타일 정의
const getStatusStyle = (status) => {
  const s = (status || "").toUpperCase();
  switch (s) {
    case "COMPLETED":
      return { bg: "bg-[#D5E8FC]", text: "text-[#064488]", label: "완료" };
    case "PROGRESS":
      return { bg: "bg-[#FECACA]", text: "text-[#991B1B]", label: "진행 중" };
    case "PENDING":
    default:
      return { bg: "bg-[#FEF08A]", text: "text-[#713F12]", label: "진행 전" };
  }
};

const Calender = () => {
  const [calendarTask, setCalendarTask] = useState([]);
  const calendarRef = useRef(null);

  const getCalendarTask = async () => {
    try {
      const res = await axiosInstanceNoHeader.get(
        "/mypage/calendar/events/task"
      );
      setCalendarTask(res.data?.result ?? []);
    } catch (err) {
      console.log("캘린더 일정 가져오기 실패~!\n", err);
    }
  };

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  const [currentMonthYear, setCurrentMonthYear] = useState(
    `${monthName(+mm)}, ${yyyy}`
  );
  const [currentDate] = useState(formattedDate);

  const updateTitle = () => {
    const d = calendarRef.current.getApi().getDate();
    setCurrentMonthYear(`${monthName(d.getMonth() + 1)}, ${d.getFullYear()}`);
  };
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

  const events = useMemo(() => {
    return calendarTask.map((t) => ({
      id: t.id,
      title: t.title,
      start: (t.start || "").slice(0, 10),
      end: addDays(t.end, 1),
      allDay: true,
      extendedProps: {
        status: t.status,
        comments: undefined,
      },
    }));
  }, [calendarTask]);

  useEffect(() => {
    updateTitle();
    getCalendarTask();
  }, []);

  // 이벤트 카드
  const renderEvent = (arg) => {
    const { status, comments } = arg.event.extendedProps;
    const { bg, text, label } = getStatusStyle(status);
    return (
      <div className="fc-custom-card">
        <div
          className={`inline-flex items-center h-6 px-3 rounded-[6px] ${bg} ${text} text-xs font-semibold w-auto max-w-max`}
        >
          {label}
        </div>
        <div
          className="mt-1 text-sm font-medium text-gray-900 leading-snug line-clamp-1"
          title={arg.event.title}
        >
          {arg.event.title}
        </div>
        <div className="mt-1 text-[11px] text-gray-500 flex items-center gap-2">
          {comments ? (
            <span className="pl-2 border-l border-gray-200">💬 {comments}</span>
          ) : null}
        </div>
      </div>
    );
  };

  // 날짜 숫자 좌상단(오늘은 검은 원)
  const renderDayNumber = (arg) => {
    const d = arg.date;
    const isToday =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();

    const day = d.getDay();
    const weekendClass =
      day === 0
        ? "text-[#EF4444]"
        : day === 6
          ? "text-[#2563EB]"
          : "text-[#111827]";

    return (
      <div className="flex items-center justify-start pl-2">
        {isToday ? (
          <span className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-[23px] bg-gray-900 text-white font-palanquin text-[21.283px] font-semibold leading-[140%] tracking-[-0.213px]">
            {d.getDate()}
          </span>
        ) : (
          <span
            className={`font-['Palanquin'] text-[21.283px] font-normal leading-[1.4] tracking-[-0.213px] ${weekendClass}`}
          >
            {d.getDate()}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-[1280px] mx-auto">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="text-[#565656] font-['Livvic'] text-[20px] font-semibold leading-[1.2] tracking-[-0.6px]">
            {currentMonthYear}
          </div>
          <div className="flex items-center gap-1 text-[#565656] font-livvic text-[20px] font-semibold leading-[120%] tracking-[-0.6px]">
            <button
              onClick={goPrev}
              className="px-2 py-1 rounded hover:bg-gray-100"
            >{`<`}</button>
            <button
              onClick={goToday}
              className="px-2 py-1 rounded hover:bg-gray-100"
            >
              오늘
            </button>
            <button
              onClick={goNext}
              className="px-2 py-1 rounded hover:bg-gray-100"
            >{`>`}</button>
          </div>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          firstDay={1}
          initialDate={currentDate}
          weekends
          height={1205}
          contentHeight={1205}
          events={events}
          eventDisplay="block"
          eventContent={renderEvent}
          dayCellContent={renderDayNumber}
          dayHeaderContent={(arg) =>
            ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"][
              arg.date.getDay()
            ]
          }
          /* 하루에 “보여줄 이벤트 수”를 1개로 제한 */
          dayMaxEvents={1}
          /* 어떤 이벤트가 맨 위에 나올지 고정 */
          eventOrder="start,title"
          eventOrderStrict={true}
          /* +N 칩 커스텀/정렬 */
          moreLinkContent={(args) => ({
            html: `<span class="more-chip">+${args.num}</span>`,
          })}
          moreLinkClassNames={() => ["more-left"]}
          moreLinkClick="popover" // (선택) 클릭하면 팝오버로 목록 보기
        />
      </div>
    </div>
  );
};

export default Calender;
