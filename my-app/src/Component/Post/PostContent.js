import React, { useEffect, Fragment, useState } from "react";
import SizeHelper from "../Utils/utils.js"
import "./PostContent.css"
import {transformDate} from "../Utils/utils.js"
import he from "he";

function PostContent(props) {
    const onePost = props.post;
    const mySize = new SizeHelper(props.size);
    const contentHTML = onePost.content ? he.decode(onePost.content) : '';

    return(
        <div id='postColumn' >
            <h1 id='postTitle' style={{fontSize: mySize.adjust(0.07)}} > {onePost.title} </h1>
            <p id='postDate' style={{fontSize: mySize.adjust(0.02)}} > {transformDate(onePost.timestamp)} </p>
            <div id='postContent' style={{fontSize: mySize.adjust(0.03)}} dangerouslySetInnerHTML={{ __html: contentHTML }} />
        </div>
    )
}

export default PostContent;