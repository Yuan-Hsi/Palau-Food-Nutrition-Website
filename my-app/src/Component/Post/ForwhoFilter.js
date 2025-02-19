import React, { useEffect, Fragment, useState } from "react";
import "./ForwhoFilter.css"


function ForwhoFilter(props) {
    const [clicked, setClicked] = useState({ cookerFilter: 0, studentFilter: 0 });

    const filterClick = (position) => {
      setClicked((prev) => ({
        ...prev,
        [position]: prev[position] === 0 ? 1 : 0,
      }));
    };

    const sizeAdjustment = ( scale ) => 
        parseFloat(props.size) * scale + props.size.slice(-2);
    
    return(
        <div id='forWhoFilter' style={{margin:props.margin,width:'100%'}}>
            <h1 id='UR' style={{fontSize:sizeAdjustment(0.04)}}>You are</h1>
            <div id='filterBtnSet'>
                <button class='filterBtn' id='cookerFilter' onClick={() => filterClick("cookerFilter")}  style={{fontSize:sizeAdjustment(0.025), backgroundColor: (clicked.cookerFilter ? "#6be508" : "#c0c0c0")}}> Cooker </button>
                <button class='filterBtn' id='studentFilter' onClick={() => filterClick("studentFilter")} style={{fontSize:sizeAdjustment(0.025), backgroundColor: (clicked.studentFilter ? "#6be508" : "#c0c0c0")}}> Student</button>
            </div>
        </div>
    )
}

export default ForwhoFilter;