import React, { useEffect, Fragment, useState } from "react";
import "./SearchBar.css";
import SizeHelper from "../Utils/utils.js";
import { useSize } from "../Utils/SizeContext.js";

const verticalBar = {
  height: "2vh",
};

const verticalBtn = {
  top: "40%",
};

function SearchBar(props) {
  const sentQ = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    props.setClickFilter(true);
    props.setQ(data.query);
  };

  const { size, isVertical } = useSize();
  const mySize = new SizeHelper(size);

  return (
    <Fragment>
      <form id='searchBar' onSubmit={sentQ} style={{ margin: props.margin, ...(isVertical ? verticalBar : {}) }}>
        <input name='query' id='searchBox' style={{ fontSize: mySize.adjust(0.03) }} type='text' placeholder='Search...'></input>
        <button type='submit' id='searchBtn' style={{ backgroundImage: `url('/searchIcon.png')`, backgroundSize: mySize.adjust(0.04), ...(isVertical ? verticalBtn : {}) }}></button>
      </form>
    </Fragment>
  );
}

export default SearchBar;
