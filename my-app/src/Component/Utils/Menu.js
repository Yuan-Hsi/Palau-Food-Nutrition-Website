import React, { useEffect, Fragment, useState } from "react";
import "./Menu.css";
import Login from "./Login";
import SizeHelper from "./utils.js"

const options = ["CALENDAR", "NEWS", "WASTE & MEALS COUNT", "INVENTORY FORM"];
const hrefs = [
  "/calendar",
  "/Posts",
  "https://docs.google.com/forms/d/e/1FAIpQLSf5442P5mYrNRNq061oKVaIK966b7rid-e8NWhuGvmWWcAe6A/viewform?usp=sf_link",
  "#",
];

function Menu(props) {

  const mySize = new SizeHelper(props.size);
  return (
    <Fragment>
      <Login plateSize={props.size} />
      <div id='menu'>
        {options.map((item, idx) => {
          return (
            <div className='menuItem' key={`menu-item-${idx}`}>
              <a href={hrefs[idx]} style={{ marginLeft: "1vw", marginRight: "1vw", fontSize: mySize.adjust(0.025) }}>
                {item}
              </a>
              <p>|</p>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
}

export default Menu;
