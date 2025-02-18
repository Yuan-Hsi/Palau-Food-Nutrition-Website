import React, { useEffect, Fragment, useState } from "react";
import "./SearchBar.css"

function SearchBar(props) {
    
    return(
        <Fragment>
            <input id="searchBox" style={{margin:props.margin, fontSize: `${
      parseFloat(props.size) * 0.04
    }${props.size.slice(-2)}`,backgroundImage: `url('/searchIcon.png')`}} type="text" placeholder="Search.." >

            </input>
        </Fragment>
    )
}

export default SearchBar;