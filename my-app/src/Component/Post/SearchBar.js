import React, { useEffect, Fragment, useState } from "react";
import "./SearchBar.css"

function SearchBar(props) {

    const sentQ = async (e) =>{
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      props.setClickFilter(true);
      props.setQ(data.query);
    }
    
    return(
        <Fragment>
          <form id="searchBar" onSubmit={sentQ}>
            <input name='query' id="searchBox" style={{margin:props.margin, fontSize: `${
      parseFloat(props.size) * 0.03
    }${props.size.slice(-2)}`}} type="text" placeholder="Search..." >
            </input>
            <button type="submit" id="searchBtn" style={{backgroundImage: `url('/searchIcon.png')`, backgroundSize: `${
      parseFloat(props.size) * 0.04
    }${props.size.slice(-2)}`}}></button>
            </form>
        </Fragment>
    )
}

export default SearchBar;