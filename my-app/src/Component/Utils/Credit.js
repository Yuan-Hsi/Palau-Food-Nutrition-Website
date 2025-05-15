import React, { useEffect, Fragment, useState } from "react";
import SizeHelper from "../Utils/utils.js";
import { useSize } from "../Utils/SizeContext.js";

const verticalStyle = {
  margin: "-4% 30% 5% 0 ",
  color: "#898886",
  float: "right",
  textAlign: "center",
};
const regularStyle = {
  margin: "-4% 1% 0 0 ",
  color: "#cfcfcf",
  float: "right",
  textAlign: "right",
};

function Credit(props) {
  const { size, isVertical } = useSize();
  const mySize = new SizeHelper(size);

  return (
    <Fragment>
      <p style={{ ...(isVertical ? verticalStyle : regularStyle), fontSize: isVertical ? mySize.adjust(0.02) : "", color: props.color || (isVertical ? verticalStyle.color : regularStyle.color) }}>
        © Copyright <span style={{ fontWeight: "bold" }}>Taiwan ICDF</span>. All Rights Reserved.<br></br> Developed by Yuan-Hsi Chen.
      </p>
    </Fragment>
  );
}

export default Credit;
