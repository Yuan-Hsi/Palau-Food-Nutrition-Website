import React, { useEffect, Fragment, useState } from "react";
import SizeHelper from "../Utils/utils.js"

const url = process.env.REACT_APP_BACKEND_URL;

function CategoryView(props) {

    const[categories,setCategories] = useState([{color:'#000000',name:'testC'}]);

    const mySize = new SizeHelper(props.size);

    const getCategories = async() => {
        const response = await fetch(`${url}/api/v1/calendar/category`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          const data = await response.json();
          if (data.status === "success") {
            console.log(data);
          } else {
            alert(response.message);
          }
    }

    const addCategory = async(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const objData = Object.fromEntries(formData.entries())
        const jsonData = JSON.stringify(objData);
        setCategories([objData,...categories]);

        /*
        const response = await fetch(`${url}api/v1/user/logout`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
    
        const data = await response.json();
        if (data.status === "success") {
          setUser({ name: 'Login'});
        } else {
          alert(response.message);
        }
          */
      }

    function getTextColor(hex) {
        // 將 HEX 顏色轉為 RGB
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);
    
        // 計算亮度 (YIQ公式)
        let brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
        // 如果亮度較低（較暗），使用白色字；否則使用黑色字
        return brightness < 128 ? "#ffffff" : "#000000";
      }


    return(
        <div className = 'categoryView' style={{width:"100%",display:"flex",justifyContent:"center",height:"20vh",marginTop:"3%",marginBottom:"-2%"}}>
            <div className = 'categoryView' id='view' >
                <div  className = 'categoryView' id = 'categoryList' >
                    {
                        categories.map((item) =>(
                            <button className="categoryView categories" style={{backgroundColor:item.color, color:getTextColor(item.color), fontSize:mySize.adjust(0.02)}}> {item.name} </button>
                        ))
                    }
                    <form className="categoryView" id='addCategory' onSubmit={addCategory}>
                        <input type='color' className="categoryView" id='inputColor' style={{width:mySize.adjust(0.03),height:mySize.adjust(0.035)}} name='color'></input>
                        <input type='text' className="categoryView" 
                        id='inputCategory' placeholder="+ new category" style={{fontSize:mySize.adjust(0.02)}} name='name'></input>
                    </form>
                </div>
                <div className = 'categoryView' id = 'itemList'>
                    <div className="categoryView item" id='item_1' style={{fontSize:mySize.adjust(0.02)}}> item_1 </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryView;