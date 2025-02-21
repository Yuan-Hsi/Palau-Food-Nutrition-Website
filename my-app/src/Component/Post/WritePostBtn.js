import React, { useEffect, Fragment, useState } from "react";
import SizeHelper from "../Utils/utils.js"

function WritePostBtn(props) {
    
    const mySize = new SizeHelper(props.size);

    return(
        <div style={{margin :  props.margin}}>
            <a href="#"
            style={{fontSize: mySize.adjust(0.025), color:"black",fontWeight: "bold",overflow: 'hidden', textOverflow: 'clip',whiteSpace: "nowrap"}}>or WANNA <span style={{textDecoration: "underline"}}>WRITE</span> A POST ? </a>
        </div>
    )
}

export default WritePostBtn;