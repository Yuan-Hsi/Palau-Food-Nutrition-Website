import React, { useEffect, Fragment, useState, useRef } from "react";
import SizeHelper from "../Utils/utils.js";
import "./FoodCalendarVertical.css";
import { useSize } from "../Utils/SizeContext.js";
import SchoolSelection from "../Utils/SchoolSelection.js";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const colors = ["#d8e0f2", "#f0ada8", "#ebcbb0", "#cee6a0", "#e3bee9", "#d8e0f2"];

const url = process.env.REACT_APP_BACKEND_URL;

function FoodCalendarVertical(props) {
  const { size, isVertical } = useSize();
  const mySize = new SizeHelper(size);
  const today = new Date(Date.now());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [monthdays, setMonthdays] = useState(0);
  const [firstWeekDay, setFirstWeekDay] = useState(0);
  const [calendarDB, setCalendarDB] = useState({});
  const [school, setSchool] = useState("67e63350944e3010a95752b5");
  const todayRef = useRef(null);

  // set monthdays and find the weed day of first day
  useEffect(() => {
    const lastDay = new Date(year, month + 1, 0);
    const firstDay = new Date(year, month, 1);
    setMonthdays(lastDay.getDate());
    setFirstWeekDay(firstDay.getDay() - 1);
  }, [year, month, setMonthdays, setFirstWeekDay]);

  // 在組件加載後滾動到今天的日期
  useEffect(() => {
    // 等待 DOM 完全渲染後再滾動
    const timer = setTimeout(() => {
      if (todayRef.current) {
        const yOffset = todayRef.current.offsetTop;
        window.scrollTo({
          top: yOffset,
          behavior: "smooth",
        });
      }
    }, 500); // 給予一些時間讓 DOM 完全渲染

    return () => clearTimeout(timer);
  }, [month]);

  useEffect(() => {
    // get calendarDB  = { year-month-day : {[foods:{_id,category_id,name},{...}], _id:}}
    const getCalendarDB = async () => {
      const api = `${url}api/v1/calendar/?date[gte]=${year}-${month + 1}-1&date[lte]=${year}-${month + 1}-${monthdays}&schoolId=${school}`;
      const response = await fetch(api, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const res = await response.json();
      if (res.status === "success") {
        const dateBaseket = {};
        res.data.date.map((item) => {
          dateBaseket[item.date.split("T")[0]] = { foods: item.foods, _id: item._id };
          return 0;
        });
        setCalendarDB(dateBaseket);
      } else {
        alert("something wrong... in getting calendarDB");
      }
    };
    if (monthdays !== 0) getCalendarDB();
  }, [setCalendarDB, month, year, monthdays, school]);

  function daily(firstDay, monthdays) {
    const dailyCalendar = [];
    let co = 0;
    let count = 0; // just for the --index
    let weekday = firstDay;

    for (let i = 1; i <= monthdays; i++) {
      const m = month + 1 < 10 ? "0" + (month + 1) : month + 1;
      const d = i < 10 ? "0" + i : i;
      const ymd = `${year}-${m}-${d}`;

      let isToday = false;
      if (i === today.getDate() && year === today.getFullYear() && month === today.getMonth()) isToday = true;

      if (weekday === 5) {
        weekday = -1;
        co++;
        continue;
      }
      if (weekday === -1) {
        weekday++;
        continue;
      }
      count++;
      dailyCalendar.push(
        <li key={i} className='card' style={{ "--index": count }} ref={isToday ? todayRef : null}>
          <div
            className='card-body'
            style={{
              backgroundColor: colors[co],
              border: isToday ? "3px solid #fde400" : "none",
              boxShadow: isToday ? "rgb(252 210 15) 0px 0px 17px 6px" : "",
            }}
          >
            <div className='cardHead'>
              <h2 className='cardDate' style={{ fontSize: mySize.adjust(0.08) }}>
                {months[month] + " " + i}
              </h2>
              <h2 className='cardDate' style={{ fontSize: mySize.adjust(0.08) }}>
                {weekdays[weekday]}
              </h2>
            </div>
            <div className='cardMenu'>
              {calendarDB[ymd] ? (
                calendarDB[ymd].foods.map((item) => {
                  return (
                    <p className='cardFoods' key={item._id} style={{ fontSize: mySize.adjust(0.035) }}>
                      {item.name}
                    </p>
                  );
                })
              ) : (
                <p className='cardFoods'>no data</p>
              )}
            </div>
          </div>
        </li>,
      );

      weekday++;
    }
    return dailyCalendar;
  }

  // next month button
  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  // previous month button
  function preMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  return (
    <Fragment>
      <div style={{ margin: "3% 0 3% 0", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h3 style={{ margin: "0 0 1% 0", letterSpacing: "0.2em", fontSize: mySize.adjust(0.03) }}> - school -</h3>
        <SchoolSelection setSchool={setSchool} />
      </div>
      <div id='changeMonth' className='fcv'>
        <button id='prevMonth' className='fcv' onClick={() => preMonth()}>
          ◀︎ Previous Month
        </button>
        <button id='nextMonth' className='fcv' onClick={() => nextMonth()}>
          Next Month ►
        </button>
      </div>
      <div className='menu'>
        <ul id='cards'>{daily(firstWeekDay, monthdays)}</ul>
      </div>
    </Fragment>
  );
}

export default FoodCalendarVertical;
