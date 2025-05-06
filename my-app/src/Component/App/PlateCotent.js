import React, { Fragment, useState } from "react";
import FormAccess from "../Utils/FormAccess";

function PlateContent(props) {
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
      {access && <FormAccess size={props.size} setAccess={setAccess} formType={formType} />}
      <div id='leftSide' style={{ width: "50%", height: "90%" }}>
        <div id='recipe' style={{ height: "58%", position: "relative" }}>
          <div style={{ position: "absolute", right: "8%", bottom: "20px", textAlign: "right" }}>
            <a
              href='calendar'
              style={{
                marginBottom: "10%",
                fontSize: `${parseFloat(props.plateSize) * 0.05}${props.plateSize.slice(-2)}`,
              }}
            >
              FOOD
            </a>
            <br></br>
            <a
              href='calendar'
              style={{
                marginBottom: "10%",
                fontSize: `${parseFloat(props.plateSize) * 0.05}${props.plateSize.slice(-2)}`,
              }}
            >
              CALENDAR
            </a>
          </div>
        </div>
        <hr
          id='leftHR'
          style={{
            margin: "2px 0 2px auto", // top right down left
            ...props.lineStyle,
          }}
        ></hr>
        <div id='news' style={{ height: "30%", position: "relative" }}>
          <a
            href='/Posts'
            style={{
              position: "absolute",
              right: "8%",
              marginTop: "10%",
              fontSize: `${parseFloat(props.plateSize) * 0.05}${props.plateSize.slice(-2)}`,
            }}
          >
            NEWS
          </a>
        </div>
      </div>
      <div id='verticalLine' style={{ height: "60%", ...props.lineStyle, width: "0" }}></div>
      <div id='rightSide' style={{ width: "50%", height: "90%" }}>
        <div id='mealCount' style={{ height: "40%", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "8%",
            }}
          >
            <a
              href='#'
              onClick={(e) => handleClick(e, "WASTE & MEALS COUNT")}
              style={{
                fontSize: `${parseFloat(props.plateSize) * 0.03}${props.plateSize.slice(-2)}`,
              }}
            >
              MEAL & WASTE
            </a>
            <br></br>
            <a
              href='#'
              onClick={(e) => handleClick(e, "WASTE & MEALS COUNT")}
              style={{
                marginTop: "1%",
                marginBottom: "10%",
                fontSize: `${parseFloat(props.plateSize) * 0.05}${props.plateSize.slice(-2)}`,
              }}
            >
              COUNT
            </a>
          </div>
        </div>
        <hr
          id='leftHR'
          style={{
            margin: "2px auto 2px 0", // top right down left
            ...props.lineStyle,
          }}
        ></hr>
        <div id='inventoryForm' style={{ height: "60%", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "8%",
            }}
          >
            <a
              href='#'
              onClick={(e) => handleClick(e, "INVENTORY FORM")}
              style={{
                marginBottom: "1%",
                fontSize: `${parseFloat(props.plateSize) * 0.04}${props.plateSize.slice(-2)}`,
              }}
            >
              INVENTORY
            </a>
            <br></br>
            <a
              href='#'
              onClick={(e) => handleClick(e, "INVENTORY FORM")}
              style={{
                marginTop: "1%",
                marginBottom: "10%",
                fontSize: `${parseFloat(props.plateSize) * 0.05}${props.plateSize.slice(-2)}`,
              }}
            >
              FORM
            </a>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default PlateContent;
