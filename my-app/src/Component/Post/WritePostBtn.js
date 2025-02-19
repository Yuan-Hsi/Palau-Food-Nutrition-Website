import React, { useEffect, Fragment, useState } from "react";


function WritePostBtn(props) {
    
    return(
        <div style={{margin :  props.margin}}>
            <a href="#"
            style={{fontSize: `${
      parseFloat(props.size) * 0.03
    }${props.size.slice(-2)}`, color:"black",fontWeight: "bold",overflow: 'hidden', textOverflow: 'clip',whiteSpace: "nowrap"}}>WANNA <span style={{textDecoration: "underline"}}>WRITE</span> A POST ? </a>
        </div>
    )
}

export default WritePostBtn;