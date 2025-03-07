import React, { useEffect, Fragment, useState, useRef } from "react";
import SizeHelper from "../Utils/utils.js"
import { useUser } from "../Utils/UserContext.js";

const url = process.env.REACT_APP_BACKEND_URL;

function DayCalendar(props) {
    const [addItem, setAddItem] = useState(false);
    const [showFoods, setShowFoods] = useState({});
    const [showList, setShowList] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const mySize = new SizeHelper(props.size);
    const { user } = useUser();

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
    }, [showList]);
    

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


    return(
        <td className="foodCalendar" onMouseEnter={() => setAddItem(true)} onMouseLeave={() => setAddItem(false)}> 
            <div style={{position:"relative"}}>
            <div id="date" style={{textAlign:"right"}}>{props.date} </div>
            {props.date !== "" &&
            <Fragment>
            <div>
                <p className="foodCalendar" >content</p>
                { props.editMode && addItem &&
                    <button className="foodCalendar"style={{zIndex:3}} id='addFood' onClick={() => setShowList(true)}>add food</button>
                }
            </div>
            {showList &&
                <div className="foodCalendar" id='foodList' onMouseLeave={() => setShowList(false)} ref={listRef}                     
                style={{
                    right: listPosition === 'right' ? '0' : 'auto',
                    left: listPosition === 'left' ? '0' : 'auto'
                }}>
                    {props.categories.map((category) =>(
                        <Fragment key={category._id}>
                            <button className="foodCalendar foodList category" style={{backgroundColor: category.color, color:getTextColor(category.color)}} onClick={() => setSelectedCategories((prev) => [category.name,...prev])} key={category._id}
                            >{category.name} </button>

                            {showFoods[category.name] && showFoods[category.name].map((item) =>(
                                <button className="foodCalendar foodList food">{item.name}</button>)
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