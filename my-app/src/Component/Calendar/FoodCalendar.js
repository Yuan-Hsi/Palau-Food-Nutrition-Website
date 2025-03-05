import React, { useEffect, Fragment, useState } from "react";
import "./FoodCalendar.css";
import SizeHelper from "../Utils/utils.js";
import CategoryView from "./CategoryView.js";
import DayCalendar from "./DayCalendar.js";


const months = ["Jan","Feb","Mar", "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function FoodCalendar(props) {
    
    const mySize = new SizeHelper(props.size);
    const today = new Date(Date.now());
    const [month,setMonth] = useState(today.getMonth());
    const [year,setYear] = useState(today.getFullYear()); 
    const [monthdays,setMonthdays] = useState(0);
    const [firstWeekDay,setFirstWeekDay] = useState(0);

    useEffect(() => {
        const lastDay = new Date(year,month+1,0);
        const firstDay = new Date(year,month,1);
        setMonthdays(lastDay.getDate());
        setFirstWeekDay(firstDay.getDay());
    },[year,month,setMonthdays,setFirstWeekDay])

    // tables body
    function daily(firstDay, monthdays) {
        const dailyCalendar = [];  // 存放所有週
        let date = 1;
    
        // 處理第一週
        const firstWeek = [];
        for (let i = 0; i < 7; i++) {
            if (i < firstDay) {
                firstWeek.push(<DayCalendar date="" key={`empty-${i}`} className="foodCalendar"/>);
            } else {
                firstWeek.push(<DayCalendar date={date++} key={date} className="foodCalendar"/>); // date ++ : 先顯示 date 再 +1
            }
        }
        dailyCalendar.push(<tr key="week-1">{firstWeek}</tr>);
    
        // 處理剩餘的週
        while (date <= monthdays) {
            const week = [];
            for (let i = 0; i < 7 && date <= monthdays; i++) {
                week.push(<DayCalendar date={date++} key={date} className="foodCalendar"/>);
            }
            // 補充空白格
            while (week.length < 7) {
                week.push(<DayCalendar date="" key={`empty-end-${week.length}`} className="foodCalendar"/>);
            }
            dailyCalendar.push(<tr key={`week-${date}`}>{week}</tr>);
        }
        return dailyCalendar;
    }

    function nextMonth (){
        if(month === 11){
            setMonth(0);
            setYear(year+1);
        }else{
            setMonth(month+1);
        }
    }

    function preMonth (){
        if(month === 0){
            setMonth(11);
            setYear(year-1);
        }else{
            setMonth(month-1);
        }
    }

    return(
        <Fragment>
        <CategoryView size={props.size}/>
        <div id ="foodCalendar">
            <h1 id = "curMonth" className="foodCalendar" style={{fontSize:mySize.adjust(0.045)}}> {`${months[month]}`}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`${year}`} </h1>
            <div style={{width:"80%", position:"relative",zIndex:1,display:"flex",alignItems:"center",marginBottom:"-1.5%"}}>
                <button className="foodCalendar" id='editBtn' style={{fontSize:mySize.adjust(0.02)}}>Edit</button>
                <button className="foodCalendar" id='goToPreMonth' style={{fontSize:mySize.adjust(0.018),marginLeft:"10%"}} onClick={() => preMonth()}>GOING TO PREVIOUS MONTH</button>
            </div>
            <div id="calendar" className="foodCalendar">
            <table id ="weekdays" >
                <thead>
                <tr>
                {weekdays.map((item) => (
                    <th style={{fontSize:mySize.adjust(0.045)}} className="foodCalendar" key={item}> {item} </th>
                ))}
                </tr>
                </thead>
                {daily(firstWeekDay,monthdays)}
                </table>
            </div>
            <div style={{width:"80%", position:"relative",zIndex:1,marginTop:"-32%"}}>
                <button className="foodCalendar" id='goToNextMonth' style={{fontSize:mySize.adjust(0.018)}} onClick={() => nextMonth()}>GOING TO NEXT MONTH</button>
            </div>
        </div>
        </Fragment>
    )
}

export default FoodCalendar;