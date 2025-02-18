import React, { useEffect, Fragment, useState } from "react";
import "./SearchBar.css"

function SearchBar(props) {
    
    return(
        <Fragment>
          <form id="searchBar">
            <input id="searchBox" style={{margin:props.margin, fontSize: `${
      parseFloat(props.size) * 0.03
    }${props.size.slice(-2)}`}} type="text" placeholder="Search..." >
            </input>
            <button id="searchBtn" style={{backgroundImage: `url('/searchIcon.png')`, backgroundSize: `${
      parseFloat(props.size) * 0.04
    }${props.size.slice(-2)}`}}></button>
            </form>
        </Fragment>
    )
}

export default SearchBar;