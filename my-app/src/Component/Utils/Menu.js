import React, { useEffect, Fragment, useState } from "react";
import "./Menu.css";
import Login from "./Login";
import FormAccess from "./FormAccess";
import SizeHelper from "./utils.js";

const options = ["CALENDAR", "NEWS", "WASTE & MEALS COUNT", "INVENTORY FORM"];
const hrefs = ["/calendar", "/Posts", "#", "#"];

function Menu(props) {
  const mySize = new SizeHelper(props.size);
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
      {!props.isVertical && (
        <Fragment>
          <Login plateSize={props.size} />
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
      {!props.isVertical && (
        <Fragment>
          <Login plateSize={props.size} />
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
    </Fragment>
  );
}

export default Menu;
