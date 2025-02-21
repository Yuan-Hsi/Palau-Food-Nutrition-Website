import React, { useEffect, Fragment, useState } from "react";
import SizeHelper from "../Utils/utils.js"
import "./PostContent.css"
import {transformDate} from "../Utils/utils.js"

function PostContent(props) {
    const onePost = props.post;

    const mySize = new SizeHelper(props.size);

    return(
        <div id='postColumn' >
            <h1 id='postTitle' style={{fontSize: mySize.adjust(0.07)}} > {onePost.title} </h1>
            <p id='postDate' style={{fontSize: mySize.adjust(0.02)}} > {transformDate(onePost.timestamp)} </p>
            <p id='postContent' style={{fontSize: mySize.adjust(0.03)}}> {"Lorem ipsum dolor sit amet consectetur. At cras enim sit porta. Fringilla viverra volutpat ut vitae velit hendrerit magna pellentesque. Non libero ut scelerisque vel lectus. Enim sed sit eget hendrerit dolor mauris dui magna elit. Lectus purus egestas nullam duis nunc ornare. Iaculis tristique venenatis commodo dictumst duis. Nisl dignissim consectetur a consectetur eget tristique adipiscing duis.Lorem ipsum dolor sit amet consectetur. At cras enim sit porta. Fringilla viverra volutpat ut vitae velit hendrerit magna pellentesque. Non libero ut scelerisque vel lectus. Enim sed sit eget hendrerit dolor mauris dui magna elit. Lectus purus egestas nullam duis nunc ornare. Iaculis tristique venenatis commodo dictumst duis. Nisl dignissim consectetur a consectetur eget tristique adipiscing duis.a volutpat ut vitae velit hendrerit magna pellentesque. Non libero ut scelerisque vel lectus. Enim sed sit eget hendrerit dolor mauris dui magna elit. Lectus purus egestas nullam duis nunc ornare. Iaculis tristique venenatis commodo dictumst duis. Nisl dignissim consectetur a consectetur eget tristique adipiscing duis.a volutpat ut vitae velit hendrerit magna pellentesque. Non libero ut scelerisque vel lectus. Enim sed sit eget hendrerit dolor mauris dui magna elit. Lectus purus egestas nullam duis nunc ornare. Iaculis tristique venenatis commodo dictumst duis. Nisl dignissim consectetur a consectetur eget tristique adipiscing duis."}</p>
        </div>
    )
}

export default PostContent;