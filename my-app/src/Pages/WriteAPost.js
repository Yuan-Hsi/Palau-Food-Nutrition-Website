import React, { useEffect, Fragment, useState, useRef } from "react";
import Menu from "../Component/Utils/Menu";
import WritePostForm from "../Component/Post/WritePostForm";

const url = "http://localhost:3005/";

const vlStyle={
    borderLeft: "2px solid black",
    height: "30vh",
}

function WriteAPost() {
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

    /*
    // Authorization
    useEffect(() => {
        if (userInfo.name === '') {
            alert('Please Login to continue...');
        }
    }, [userInfo]);
*/

    return (
      <Fragment>
        <Menu size = {size} setUserInfo = {setUserInfo}/>
        <div style={{display:"flex",height:"80vh",marginLeft:"5%",width:"90vw",justifyContent:"center"}}>
          <div className='vl' style={{marginTop:"20%", borderColor:"#50B6F9",...vlStyle}}></div>
          <WritePostForm size={size}/>
          <div className='vl' style={{marginTop:"10%",borderColor:"#FFDD31",...vlStyle}}></div>
        </div> 

      </Fragment>
    );
  }
  
  export default WriteAPost;