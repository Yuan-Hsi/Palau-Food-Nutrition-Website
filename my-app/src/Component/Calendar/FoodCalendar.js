import React, { useEffect, Fragment, useState } from "react";
import "./FoodCalendar.css";
import SizeHelper from "../Utils/utils.js";
import CategoryView from "./CategoryView.js";
import DayCalendar from "./DayCalendar.js";
import SchoolSelection from "../Utils/SchoolSelection.js";
import { useUser } from "../Utils/UserContext.js";
import { useSize } from "../Utils/SizeContext.js";

const url = process.env.REACT_APP_BACKEND_URL;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function FoodCalendar(props) {
  const { size, isVertical } = useSize();
  const mySize = new SizeHelper(size);
  const today = new Date(Date.now());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [monthdays, setMonthdays] = useState(0);
  const [firstWeekDay, setFirstWeekDay] = useState(0);
  const [mode, setMode] = useState("view");
  const [school, setSchool] = useState("Elementary School");
  const [foodDB, setFoodDB] = useState([{ color: "", name: "" }]);
  const [calendarDB, setCalendarDB] = useState({});
  const [foods, setFoods] = useState({});
  const [colors, setColors] = useState({});
  const [favorite, setFavorite] = useState([]);
  const [dislike, setDislike] = useState([]);
  const { user } = useUser();

  // set monthdays and find the weed day of first day
  useEffect(() => {
    const lastDay = new Date(year, month + 1, 0);
    const firstDay = new Date(year, month, 1);
    setMonthdays(lastDay.getDate());
    setFirstWeekDay(firstDay.getDay());
  }, [year, month, setMonthdays, setFirstWeekDay]);

  // get foodDB
  useEffect(() => {
    const getfoodDB = async () => {
      const response = await fetch(`${url}api/v1/calendar/classifyfoods`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const res = await response.json();
      if (res.status === "success") {
        setFoodDB(res.data.FoodsDB);
      } else {
        alert("something wrong... in getting foodDB");
      }
    };
    if (mode === "edit") getfoodDB();
  }, [mode, setFoodDB]);

  // get calendarDB  = { year-month-day : {[foods:{_id,category_id,name},{...}], _id:}}
  useEffect(() => {
    const getCalendarDB = async () => {
      const api = `${url}api/v1/calendar/?date[gte]=${year}-${month + 1}-1&date[lte]=${year}-${month + 1}-${monthdays}&schoolType=${school}`;
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
  }, [mode, setCalendarDB, month, year, monthdays, school]);

  // get userData to get the favorite and dislike
  useEffect(() => {
    const getPreferences = async () => {
      const response = await fetch(`${url}api/v1/user/getPreference`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();

      if (data.status === "success") {
        setFavorite(data.data.favorite);
        setDislike(data.data.dislike);
      } else {
        console.log("Something wrong... in getPreferences");
      }
    };
    if (user.title) getPreferences();
  }, [user]);

  // produce a foods map = {categoryName : [foods:{_id,name,...},...]}
  useEffect(() => {
    let foodsBaseket = {};
    let colorBaseket = {};

    if (foodDB) {
      foodDB.map((category) => {
        foodsBaseket[category.name] = category.foods;
        colorBaseket[category._id] = category.color;
        return 0;
      });

      setFoods(foodsBaseket);
      setColors(colorBaseket);
    }
  }, [foodDB, setFoods]);

  // produce a category's color map = {categoryName : colorCode }
  useEffect(() => {
    const getCategories = async () => {
      const api = `${url}api/v1/calendar/category`;
      const response = await fetch(api, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const res = await response.json();
      if (res.status === "success") {
        let colorBaseket = {};
        res.data.category.map((item) => {
          colorBaseket[item._id] = item.color;
          return 0;
        });
        setColors(colorBaseket);
      } else {
        alert("something wrong... in getting calendarDB");
      }
    };
    getCategories();
  }, []);

  // tables body
  function daily(firstDay, monthdays) {
    const dailyCalendar = []; // 存放所有週
    let date = 1;

    const calendarProps = {
      favorite,
      setFavorite,
      dislike,
      setDislike,
      school,
      setCalendarDB,
      size: size,
      calendarDB,
      colors,
      foods,
      foodDB,
      mode,
      year,
      month: month + 1,
      className: "foodCalendar",
    };

    // 處理第一週
    const firstWeek = [];
    for (let i = 0; i < 5; i++) {
      if (firstDay === 0 && i === 0) {
        date++;
        firstWeek.push(<DayCalendar {...calendarProps} date={date++} key={date} />);
        continue;
      }
      if (i < firstDay) {
        firstWeek.push(<DayCalendar {...calendarProps} date='' key={`empty-${i}`} />);
      } else {
        firstWeek.push(<DayCalendar {...calendarProps} date={date++} key={date} />); // date ++ : 先顯示 date 再 +1
      }
    }
    date += 2;
    if (firstDay < 5) {
      dailyCalendar.push(<tr key='week-1'>{firstWeek}</tr>);
    }

    // 處理剩餘的週
    while (date <= monthdays) {
      const week = [];
      for (let i = 0; i < 5 && date <= monthdays; i++) {
        week.push(<DayCalendar {...calendarProps} date={date++} key={date} />);
      }

      // 補充空白格
      while (week.length < 5) {
        week.push(<DayCalendar {...calendarProps} date='' key={`empty-end-${week.length}`} />);
      }
      date += 2;
      dailyCalendar.push(<tr key={`week-${date}`}>{week}</tr>);
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
      {/* edit pannel */}
      {mode === "edit" && <CategoryView foods={foods} setFoods={setFoods} foodDB={foodDB} setFoodDB={setFoodDB} size={size} />}

      {/* whole calendar */}
      <div id='foodCalendar'>
        {/* current month */}
        <h1 id='curMonth' className='foodCalendar' style={{ fontSize: mySize.adjust(0.045) }}>
          {" "}
          {`${months[month]}`}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`${year}`}{" "}
        </h1>

        <div style={{ width: "80%", position: "relative", zIndex: 1, display: "flex", alignItems: "center", marginBottom: "-1.5%" }}>
          {/* edit & view button */}
          {user.title === "admin" && (
            <button className='foodCalendar' id='editBtn' style={{ fontSize: mySize.adjust(0.02) }} onClick={() => setMode(mode === "view" ? "edit" : "view")}>
              {mode === "view" ? "Edit" : "View"}
            </button>
          )}

          {/* go to previous month & school selection*/}
          <button className='foodCalendar' id='goToPreMonth' style={{ fontSize: mySize.adjust(0.018), marginLeft: "10%" }} onClick={() => preMonth()}>
            GOING TO PREVIOUS MONTH
          </button>
          <select
            name='school'
            id='schoolSelect'
            className='foodCalendar'
            style={{ marginLeft: "50%", marginBottom: "1%", fontSize: mySize.adjust(0.02) }}
            onChange={(event) => setSchool(event.target.value)}
          >
            <option value={"Elementary School"}>Elementary School</option>
            <option value={"High School"}>High School</option>
            <option value={"Others"}>Others</option>
          </select>
        </div>

        <div id='calendar' className='foodCalendar'>
          <table id='weekdays'>
            <thead>
              <tr>
                {weekdays.map((item) => (
                  <th style={{ fontSize: mySize.adjust(0.045) }} className='foodCalendar' key={item}>
                    {" "}
                    {item}{" "}
                  </th>
                ))}
              </tr>
            </thead>
            {daily(firstWeekDay, monthdays)}
          </table>
        </div>
        <div style={{ width: "80%", position: "relative", zIndex: 1, marginTop: "-32%", marginBottom: "20%" }}>
          <button className='foodCalendar' id='goToNextMonth' style={{ fontSize: mySize.adjust(0.018) }} onClick={() => nextMonth()}>
            GOING TO NEXT MONTH
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default FoodCalendar;
