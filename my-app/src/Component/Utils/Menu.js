import React, { useEffect, Fragment, useState } from "react";
import "./Menu.css";
import Login from "./Login";
import FormAccess from "./FormAccess";
import SizeHelper from "./utils.js";
import { useSize } from "../Utils/SizeContext.js";

const options = ["CALENDAR", "NEWS", "WASTE & MEALS COUNT", "INVENTORY FORM"];
const hrefs = ["/calendar", "/Posts", "#", "#"];

function Menu(props) {
  const { size, isVertical } = useSize();
  const mySize = new SizeHelper(size);
  const [access, setAccess] = useState(false);
  const [formType, setFormType] = useState("wmcount");

  const handleClick = (e, item) => {
    // If not CALENDAR or NEWS, prevent navigation and show FormAccess
    if (item !== "CALENDAR" && item !== "NEWS") {
      e.preventDefault();
      setAccess(true);
      if (item === "WASTE & MEALS COUNT") {
        setFormType("wmcount");
      }
      if (item === "INVENTORY FORM") {
        setFormType("inventory");
      }
    }
    // If CALENDAR or NEWS, do nothing and let the browser navigate normally
  };

  return (
    <Fragment>
      {!isVertical && (
        <Fragment>
          <Login position='rightCorner' />
          <div id='menu'>
            {options.map((item, idx) => {
              return (
                <div className='menuItem' key={`menu-item-${idx}`}>
                  <a href={hrefs[idx]} style={{ marginLeft: "1vw", marginRight: "1vw", fontSize: mySize.adjust(0.025) }} onClick={(e) => handleClick(e, item)}>
                    {item}
                  </a>
                  <p>|</p>
                </div>
              );
            })}
          </div>
          {access && <FormAccess size={props.size} setAccess={setAccess} formType={formType} />}
        </Fragment>
      )}
      {isVertical && (
        <Fragment>
          <Login position='rightCorner' />
          <div id='menu'>
            <ul>
              {options.map((item, idx) => {
                return (
                  <li className='menuItem' key={`menu-item-${idx}`}>
                    <a href={hrefs[idx]} style={{ margin: "0 1vw 1vw 1vw", fontSize: mySize.adjust(0.025) }} onClick={(e) => handleClick(e, item)}>
                      {item}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          {access && <FormAccess size={props.size} setAccess={setAccess} formType={formType} />}
        </Fragment>
      )}
    </Fragment>
  );
}

export default Menu;
