import React, { useEffect, Fragment, useState } from "react";
import "./PageSection.css"

// <PageSection page totalPage setPage/>
function PageSection(props) {

        const btnAmount = 5;
        let start = Math.max(1, props.page - Math.floor(btnAmount/2));
        let end = start + btnAmount - 1;

        if (end > props.totalPage) {
            end = props.totalPage;
            start = Math.max(1, end - btnAmount + 1);
          }

        const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);  // smart move by ChatGPT


    return(
        <div id="pageSection" >
            <button className='goBtn' style={{marginRight:"2%"}} onClick={() => props.setPage(1)}>&lt;&lt;</button>
            {pages.map((i) => (
                <button className="pageBtn" key={i} id={i === props.page ? "curPage" : `page${i}`}  disabled={i === props.page} 
                onClick={() => props.setPage(i)}
                >  {i} </button>
                ))}
            <button className='goBtn' style={{marginLeft:"2%"}} onClick={() => props.setPage(props.totalPage)} >&gt;&gt;</button>
        </div>

    )
}

export default PageSection;