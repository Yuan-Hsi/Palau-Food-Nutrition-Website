import React, { useEffect, Fragment, useState } from "react";

function PostContent(props) {
    const onePost = props.post;

    return(
        <div id='postColumn'>
            <h1> {onePost.title} </h1>
        </div>
    )
}

export default PostContent;