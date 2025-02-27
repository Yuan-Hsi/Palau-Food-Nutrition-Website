import React, { useEffect, Fragment, useState } from "react";
import SizeHelper from "../Utils/utils.js"
import "./ForwhoFilter.css"


function ForwhoFilter(props) {
    const filterClick = (position) => {
        props.setClickFilter(true);
        props.setWhoFilter((prev) => ({
        ...prev,
        [position]: prev[position] === 0 ? 1 : 0,
      }));
    };

    const mySize = new SizeHelper(props.size);
    
    return(
        <div id='forWhoFilter' style={{margin:props.margin,width:'100%'}}>
            <h1 id='UR' style={{fontSize:mySize.adjust(0.04)}}>You are</h1>
            <div id='filterBtnSet'>
                <button className='filterBtn' id='cookerFilter' onClick={() => filterClick("forCooker")}  style={{fontSize:mySize.adjust(0.025), backgroundColor: (props.whoFilter.forCooker ? "#6be508" : "#c0c0c0")}}> Cooker </button>
                <button className='filterBtn' id='studentFilter' onClick={() => filterClick("forStudent")} style={{fontSize:mySize.adjust(0.025), backgroundColor: (props.whoFilter.forStudent ? "#6be508" : "#c0c0c0")}}> Student</button>
            </div>
        </div>
    )
}

export default ForwhoFilter;