import React, { useEffect, Fragment, useState } from "react";
import WritePostBtn from "./WritePostBtn";
import SizeHelper from "../Utils/utils.js";
import {transformDate,chunkArray} from "../Utils/utils.js";
import PageSection from "../Utils/PageSection.js"
import "./CommentSection.css";

const url = process.env.REACT_APP_BACKEND_URL;

function CommentSection(props) {
  const mySize = new SizeHelper(props.size);
  const [page, setPage] = useState(1);
  

  // connect Sent Comment API
  const sentComment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const req = Object.assign(Object.fromEntries(formData.entries()), {timestamp:Date.now(), user:props.userInfo.id,post:props.post._id})
    const jsonReq = JSON.stringify(req);
    console.log(jsonReq);

    const response = await fetch(`${url}api/v1/post/${props.post._id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonReq,
      credentials: "include",
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <div id='commentSection'>
      <div style={{ display: "flex", height: "20%", alignItems: "center" }}>
        <form id='postComment' onSubmit={sentComment}>
          <p id='inputUser' style={{ fontSize: mySize.adjust(0.025) }}>{props.userInfo.name}</p>
          <textarea id='inputComment' name='comment' disabled={props.userName === "Please Log in"} style={{ fontSize: mySize.adjust(0.028) }}></textarea>
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", paddingRight: "2%"}}>
            <div style={{ display: "flex", alignItems: "center", marginTop: "-3%", }}>
              <input type='checkbox' id='privateBtn' name='visibility' value='true'></input>
              <label for='privateBtn' style={{ fontSize: mySize.adjust(0.015), marginLeft: "5%", whiteSpace: "nowrap", }}> ONLY BE SEEN BY ADMIN </label>
            </div>
            <button type='submit' id='sentBtn' style={{ fontSize: mySize.adjust(0.03) }}> SENT </button>
          </div>
        </form>
        <WritePostBtn margin='0 0 0 1vw' size={props.size} />
      </div>
      <div id='commentView' style={{height:"100%"}}>
        {
          props.commentChunk[page-1].map((item,idx) => (
          <div class='comments' id={`comment_${idx+1}`}>
            <div style={{display:"flex",justifyContent:"space-between",paddingRight:'3%',paddingTop:'2%'}}> 
              <p style={{fontSize: mySize.adjust(0.03)}} id="commenter"> {`${item.user.name} - `} </p>
              <p style={{fontSize: mySize.adjust(0.02)}} id="commentTime"> {transformDate(item.timestamp)}</p>
            </div>
            <p id='commentContent'> {item.comment} </p>
          </div>
            )
          )
        }
        <div style={{width:"70%"}}>
        <PageSection page={page} totalPage={props.commentChunk.length} setPage={setPage}/>
        </div>
      </div>
    </div>
  );
}

export default CommentSection;
