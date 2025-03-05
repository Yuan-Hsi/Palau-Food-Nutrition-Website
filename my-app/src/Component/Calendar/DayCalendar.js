import React, { useEffect, Fragment, useState } from "react";
import SizeHelper from "../Utils/utils.js"
import { useUser } from "../Utils/UserContext.js";


function DayCalendar(props) {
    const[addItem, setAddItem] = useState(false)
    const mySize = new SizeHelper(props.size);
    const { user } = useUser();
    
    return(
        <td className="foodCalendar" onMouseEnter={() => setAddItem(true)} onMouseLeave={() => setAddItem(false)}> 
            <div id="date" style={{textAlign:"right"}}>{props.date} </div>
            {props.date !== "" &&
            <div>
                <p className="foodCalendar" >content</p>
                { addItem && user.title==='admin' &&
                    <button className="foodCalendar" id='addFood'>add food</button>
                }
            </div>
            }
        </td>
    )
}

export default DayCalendar;