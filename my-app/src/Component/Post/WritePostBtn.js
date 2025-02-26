import React, { useEffect, Fragment, useState } from "react";
import SizeHelper from "../Utils/utils.js"
import { useNavigate } from "react-router-dom";

const btnStyle={
    color:"black",
    fontWeight: "bold",
    overflow: 'hidden', 
    textOverflow: 'clip',
    whiteSpace: "nowrap",
    border:"none",
    backgroundColor:"white",
    letterSpacing:"0.2em"}


function WritePostBtn(props) {
    
    const mySize = new SizeHelper(props.size);
    const navigate = useNavigate();

    //  Go to the post
    const goToWrite = (postId) => {
        navigate(`/writeapost`);
    };

    return(
        <div style={{margin :  props.margin}}>
            <button onClick={goToWrite}
            style={{fontSize: mySize.adjust(0.025),cursor: 'pointer', ...btnStyle}}>or WANNA <span style={{textDecoration: "underline"}}>WRITE</span> A POST ? </button>
        </div>
    )
}

export default WritePostBtn;