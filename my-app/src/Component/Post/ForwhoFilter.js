import React, { useEffect, Fragment, useState } from "react";
import SizeHelper from "../Utils/utils.js";
import { useSize } from "../Utils/SizeContext.js";
import "./ForwhoFilter.css";

const verticalUR = {
  margin: "0 0 0 0",
  height: "30%",
};
const verticalBtnSet = {
  height: "30%",
  width: "30%",
  margin: "0 0 0 3%",
};
const verticalBtn = {
  height: "90%",
  width: "45%",
};

function ForwhoFilter(props) {
  const filterClick = (position) => {
    props.setClickFilter(true);
    props.setWhoFilter((prev) => ({
      ...prev,
      [position]: prev[position] === 0 ? 1 : 0,
    }));
  };
  const { size, isVertical } = useSize();
  const mySize = new SizeHelper(size);

  return (
    <Fragment>
      {!isVertical && (
        <div id='forWhoFilter' style={{ margin: props.margin, width: "100%" }}>
          <h1 id='UR' style={{ fontSize: mySize.adjust(0.04) }}>
            You are
          </h1>
          <div id='filterBtnSet'>
            <button
              className='filterBtn'
              id='cookerFilter'
              onClick={() => filterClick("forCooker")}
              style={{ fontSize: mySize.adjust(0.025), backgroundColor: props.whoFilter.forCooker ? "#6be508" : "#c0c0c0" }}
            >
              Cooker
            </button>
            <button
              className='filterBtn'
              id='studentFilter'
              onClick={() => filterClick("forStudent")}
              style={{ fontSize: mySize.adjust(0.025), backgroundColor: props.whoFilter.forStudent ? "#6be508" : "#c0c0c0" }}
            >
              Student
            </button>
          </div>
        </div>
      )}
      {isVertical && (
        <div id='forWhoFilter' style={{ margin: props.margin, width: "100%", flexDirection: "row", justifyContent: "center", height: "8vh" }}>
          <h1 id='UR' style={{ fontSize: mySize.adjust(0.03), ...verticalUR }}>
            You are
          </h1>
          <div id='filterBtnSet' style={verticalBtnSet}>
            <button
              className='filterBtn'
              id='cookerFilter'
              onClick={() => filterClick("forCooker")}
              style={{ fontSize: mySize.adjust(0.025), backgroundColor: props.whoFilter.forCooker ? "#6be508" : "#c0c0c0", ...verticalBtn }}
            >
              Cooker
            </button>
            <button
              className='filterBtn'
              id='studentFilter'
              onClick={() => filterClick("forStudent")}
              style={{ fontSize: mySize.adjust(0.025), backgroundColor: props.whoFilter.forStudent ? "#6be508" : "#c0c0c0", ...verticalBtn }}
            >
              Student
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default ForwhoFilter;
