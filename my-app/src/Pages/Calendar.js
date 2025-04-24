import React, { useEffect, Fragment, useState, useRef } from "react";
import Menu from "../Component/Utils/Menu";
import FoodCalendar from "../Component/Calendar/FoodCalendar";
import FoodCalendarVertical from "../Component/Calendar/FoodCalendarVertical";
import { useSize } from "../Component/Utils/SizeContext.js";

const url = process.env.REACT_APP_BACKEND_URL;

function Calendar() {
  const { size, isVertical } = useSize();
  const [userInfo, setUserInfo] = useState({ name: "", id: "", title: "" });

  return (
    <Fragment>
      <Menu setUserInfo={setUserInfo} />
      {!isVertical && <FoodCalendar />}
      {isVertical && <FoodCalendarVertical />}
    </Fragment>
  );
}

export default Calendar;
