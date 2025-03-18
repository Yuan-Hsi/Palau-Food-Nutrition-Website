import React, { useEffect, Fragment, useState, useRef } from "react";
import SizeHelper from "../Utils/utils.js"
import { produce } from 'immer';

const url = process.env.REACT_APP_BACKEND_URL;

function DayCalendar(props) {
    const [addItem, setAddItem] = useState(false);
    const [showFoods, setShowFoods] = useState({});
    const [showList, setShowList] = useState(false);
    const [theDate, setTheDate] = useState('');
    const [delBtn, setDelBtn] = useState({foodId:'', date:'',listIdx:''});
    const mySize = new SizeHelper(props.size);

    // auto floatwindow position
    const listRef = useRef(null);
    const [listPosition, setListPosition] = useState('left');

    useEffect(() => {
        function autoPosition() {
            if (listRef.current && showList) {
                const rect = listRef.current.getBoundingClientRect();
                const windowWidth = window.innerWidth;
            
                if(listPosition === 'right'){
                    return 0;
                }

                if(rect.right  > windowWidth){
                    setListPosition('right');
                    return 0;
                }
                
                setListPosition('left');
            }
        }

        autoPosition();
    }, [showList,listPosition]);
    
    useEffect(() =>{
        const d = (props.date < 10) ? '0' + props.date : props.date;
        const m = (props.month < 10) ? '0' + props.month : props.month;
        setTheDate(`${props.year}-${m}-${d}`);
    },[props.year,props.month,props.date])

    function clickCategory(categoryName) {
        if(showFoods[categoryName]){
            setShowFoods(pre => {
                const state = { ...pre }
                state[categoryName] = undefined;
                return state;
            })
        }
        else{
            
        const updateFoods = props.foods[categoryName];
        setShowFoods(pre => ({
            ...pre,
            [categoryName]: updateFoods
                })) 
            }
        }

    // auto tuning text color
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
    
    const addCalendar = async(foodId,categoryId,foodName) => {
        
        if(props.calendarDB[theDate] === undefined){ // create the day
            
            const jsonData = JSON.stringify({schoolName:props.school, date:theDate, foods:[foodId]});
            const response = await fetch(`${url}api/v1/calendar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: jsonData,
            });
            const data = await response.json();
            
            if (data.status === "success") {
            props.setCalendarDB(
                produce(prevCalendarDB => {
                    prevCalendarDB[theDate] = {
                      foods:[{ _id: foodId, name: foodName, category_id: categoryId }],
                      _id: data.update._id,
                    };
                  })
            );
            } else {
                alert('Something wrong... in addCalendar');
            }
            }
        else{  // update the day
            
            const foodsBaseket = props.calendarDB[theDate].foods.map(food => food._id);
            foodsBaseket.push(foodId);
            const jsonData = JSON.stringify({foods:foodsBaseket});
            const response = await fetch(`${url}api/v1/calendar/${props.calendarDB[theDate]._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: jsonData,
            });
            const data = await response.json();
            
            if (data.status === "success") {
                props.setCalendarDB(
                    produce(prevCalendarDB => {
                        prevCalendarDB[theDate] = {
                          foods:[...prevCalendarDB[theDate].foods,{"_id":foodId,"name":foodName,"category_id":categoryId}],
                          _id: data.update._id,
                        };
                      })
                );
            } else {
                alert('Something wrong... in addCalendar');
            }
            }
        }

    const deleteMeal = async(idx) => {
        // the same as update the day
        const foodsBaseket =[...props.calendarDB[theDate].foods];
        foodsBaseket.splice(idx, 1);  // remove that
        const update = foodsBaseket.map( food => food._id);
        const jsonData = JSON.stringify({foods:update});
        const response = await fetch(`${url}api/v1/calendar/${props.calendarDB[theDate]._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: jsonData,
        });
        const data = await response.json();
        
        if (data.status === "success") {
            props.setCalendarDB(
                produce(prevCalendarDB => {
                    prevCalendarDB[theDate] = {
                      foods:foodsBaseket,
                      _id: data.update._id,
                    };
                  })
            );
        } else {
            alert('Something wrong... in addCalendar');
        }
    }

    return(
        <td className="foodCalendar" onMouseEnter={() => setAddItem(true)} onMouseLeave={() => setAddItem(false)}> 
            <div style={{position:"relative"}}>
            <div id="date" style={{textAlign:"right"}}>{props.date} </div>
            {props.date !== "" &&
            <Fragment>
            <div>
                {   props.calendarDB[theDate] !== undefined && 
                    props.calendarDB[theDate].foods.map((food,idx) => (
                        <div style={{display:"flex",alignItems:"center",marginBottom:"3%"}}  onMouseEnter={()=>setDelBtn({foodId:food._id, date:theDate, listIdx: idx})} onMouseLeave={()=>setDelBtn('')} >
                            <div style={{minWidth:"15px",marginRight:"3%"}}><input type="color" id='inputColor' className="categoryView" disabled value={props.colors[food.category_id]} style={{width:"100%",height:"20px"}}></input></div>

                        <p className="foodCalendar foodName" key={food._id} title={food.name}>{food.name}</p>
                        { props.mode==='edit' && delBtn.date === theDate && delBtn.listIdx === idx && 
                        <div style={{minWidth:"15px"}}>
                        <button className="dayCalendar delBtn" id={food._id} onClick={() => deleteMeal(idx)} style={{width:"100%"}}> X </button> </div>}
                        </div>
                    ))  
                }
                { props.mode==='edit' && addItem &&
                    <button className="foodCalendar"style={{zIndex:3}} id='addFood' onClick={() => setShowList(true)}>add food</button>
                }
            </div>
            {showList &&
                <div className="foodCalendar" id='foodList' onMouseLeave={() => setShowList(false)} ref={listRef}                     
                style={{
                    right: listPosition === 'right' ? '0' : 'auto',
                    left: listPosition === 'left' ? '0' : 'auto'
                }}>
                    {props.foodDB.map((category) =>(
                        <Fragment key={category._id}>
                            <button className="foodCalendar foodList category" style={{backgroundColor: category.color, color:getTextColor(category.color)}} onClick={() => clickCategory(category.name)} key={category._id}
                            >{category.name} </button>

                            {showFoods[category.name] && showFoods[category.name].map((item) =>(
                                <button className="foodCalendar foodList food" key={item._id} onClick={() => addCalendar(item._id,category._id,item.name)}>{item.name}</button>)
                            )} 
                        </Fragment>
                    ))}                    
                </div>
            }
            </Fragment>
            }
            </div>
        </td>
    )
}

export default DayCalendar;