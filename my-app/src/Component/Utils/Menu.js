import React, { useEffect, Fragment, useState } from "react";
import "./Menu.css";
import Login from "./Login";

const options = ['RECIPE','NEWS','WASTE & MEALS COUNT', 'INVENTORY FORM']
const hrefs = ['#','/Posts','https://docs.google.com/forms/d/e/1FAIpQLSf5442P5mYrNRNq061oKVaIK966b7rid-e8NWhuGvmWWcAe6A/viewform?usp=sf_link','#']

function Menu(props) {
    return(<Fragment>
        <Login plateSize={props.size} />
        <div id='menu'>
        {options.map( (item,idx) => {
            return(
                <div class='menuItem'>
                <a href={hrefs[idx]} style = {{marginLeft:'1vw',marginRight:'1vw',fontSize: `${
      parseFloat(props.size) * 0.025
    }${props.size.slice(-2)}`,}} >{item}</a>
                <p >|</p>
                </div>
            )
        })}
        </div>
        
    </Fragment>)
}

export default Menu;

