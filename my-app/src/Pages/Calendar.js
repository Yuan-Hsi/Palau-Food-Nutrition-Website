import React, { useEffect, Fragment, useState, useRef } from "react";
import Menu from "../Component/Utils/Menu";

const url = "http://localhost:3005/";

function Calendar() {
    // initialize UIsize
    const [size, setSize] = useState("90vh");
    const [isVertical, setIsVertical] = useState(false);
    const [userInfo, setUserInfo] = useState({name:'',id:'',title:''});
    
    // UI Size Initilization
    useEffect(() => {
      function updateSize() {
        if (window.innerWidth > window.innerHeight) {
          // 橫 > 直
          setSize("90vh");
        } // 直 > 橫
        else {
          setSize("90vw"); // 直向
          setIsVertical(true); // 直向
        }
      }
  
      updateSize();
  
      window.addEventListener("resize", updateSize);
  
      // 清理函數
      return () => {
        window.removeEventListener("resize", updateSize);
      };
    }, []);


    return (
      <Fragment>
        <Menu size = {size} setUserInfo = {setUserInfo}/>
        
      </Fragment>
    );
  }
  
  export default Calendar;