import React, { useEffect, Fragment, useState, useRef } from "react";
import WritePostBtn from "./WritePostBtn";
import SizeHelper from "../Utils/utils.js";
import { transformDate, chunkArray } from "../Utils/utils.js";
import PageSection from "../Utils/PageSection.js";
import "./CommentSection.css";
import { useUser } from "../Utils/UserContext.js";

const url = process.env.REACT_APP_BACKEND_URL;

function CommentSection(props) {
  const mySize = new SizeHelper(props.size);
  const [page, setPage] = useState(1);
  const { user } = useUser();
  const formRef = useRef(null); // using for reset the form after submit

  // connect Sent Comment API
  const sentComment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const req = Object.assign(Object.fromEntries(formData.entries()), { timestamp: Date.now(), user: user.id, post: props.post._id });
    const jsonReq = JSON.stringify(req);

    const response = await fetch(`${url}api/v1/post/${props.post._id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonReq,
      credentials: "include",
    });

    const data = await response.json();

    if (data.status === "success") {
      const now = new Date(); // 純粹放進去 array ，更新畫面而已
      const newComment = {
        timestamp: now.setTime(Date.now()),
        visibility: true,
        _id: data.data._id,
        comment: req.comment,
        user: { _id: user.id, name: user.name, title: user.title },
        post: props.post._id,
        id: data.data._id,
      };

      const allComments = props.commentChunk.flat();
      allComments.unshift(newComment);
      props.setCommentChunk(chunkArray([...allComments]));

      // reset the form
      if (formRef.current) {
        formRef.current.reset(); // 重置表單
      }
    } else {
      alert(data.message);
    }
  };

  // connet to Get Comment API (If the user is admin)
  useEffect(() => {
    async function getComments(postId) {
      try {
        let api = `${url}api/v1/post/${postId}/comments/user`;

        const response = await fetch(api, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (data.status === "success") {
          // Chunk the comment to the size for 'one' page of comment section
          props.setCommentChunk(chunkArray(data.data.comments));
        }
      } catch {
        alert("something wrong...");
      }
    }
    if (props.post._id && user.title) {
      getComments(props.post._id);
    }
  }, [user, props.setCommentChunk, props.post._id]);

  // delComment API
  const delComment = async (commentId) => {
    if (!window.confirm("Are you sure to delete the comment?")) {
      return;
    }

    const response = await fetch(`${url}api/v1/comment/${commentId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response;
    if (data.status === 204) {
      let allComments = props.commentChunk.flat();
      const updateComments = allComments.filter((item) => item._id !== commentId);
      props.setCommentChunk(chunkArray([...updateComments]));
    } else {
      alert("something wrong...");
    }
  };

  return (
    <div id='commentSection'>
      <div style={{ display: "flex", height: "20%", alignItems: "center" }}>
        <form id='postComment' onSubmit={sentComment} ref={formRef}>
          <p id='inputUser' style={{ fontSize: mySize.adjust(0.025) }}>{`${user.name} :`}</p>
          <textarea id='inputComment' name='comment' disabled={props.userName === "Please Log in"} style={{ fontSize: mySize.adjust(0.02) }}></textarea>
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", paddingRight: "2%" }}>
            <div style={{ display: "flex", alignItems: "center", marginTop: "-3%" }}>
              <input type='checkbox' id='privateBtn' name='visibility' value='false'></input>
              <label for='privateBtn' style={{ fontSize: mySize.adjust(0.015), marginLeft: "5%", whiteSpace: "nowrap" }}>
                {" "}
                ONLY BE SEEN BY ADMIN{" "}
              </label>
            </div>
            <button type='submit' id='sentBtn' style={{ fontSize: mySize.adjust(0.03) }}>
              {" "}
              SENT{" "}
            </button>
          </div>
        </form>
        {user.title && user.title === "admin" && <WritePostBtn margin='0 0 0 1vw' size={props.size} />}
      </div>
      <div id='commentView' style={{ height: "100%" }}>
        {props.commentChunk[page - 1] &&
          props.commentChunk[page - 1].map((item, idx) => (
            <div className='comments' id={`comment_${idx + 1}`} key={`comment_${idx + 1}`}>
              {(user.title === "admin" || (item.user._id && user.id === item.user._id)) && (
                <button className='delBtn commentDelBtn' onClick={() => delComment(item._id)} style={{ height: mySize.adjust(0.045), width: mySize.adjust(0.045) }}>
                  ✖︎
                </button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", paddingRight: "3%", paddingTop: "2%" }}>
                <p style={{ fontSize: mySize.adjust(0.03) }} id='commenter'>
                  {" "}
                  {`${item.user.name} - `}{" "}
                </p>
                <p style={{ fontSize: mySize.adjust(0.02) }} id='commentTime'>
                  {" "}
                  {transformDate(item.timestamp)}
                </p>
              </div>
              <p id='commentContent'> {item.comment} </p>
            </div>
          ))}
        <div style={{ width: "70%" }}>
          <PageSection page={page} totalPage={props.commentChunk.length} setPage={setPage} />
        </div>
      </div>
    </div>
  );
}

export default CommentSection;
