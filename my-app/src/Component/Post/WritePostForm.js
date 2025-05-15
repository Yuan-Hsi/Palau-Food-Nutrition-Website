import React, { useEffect, Fragment, useState } from "react";
import "./WritePostForm.css";
import SizeHelper from "../Utils/utils.js";
import Tiptap from "../Utils/Tiptap.js";
import { useUser } from "../Utils/UserContext.js";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";

const centerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const url = process.env.REACT_APP_BACKEND_URL;

function WritePostForm(props) {
  const { user } = useUser();
  const navigate = useNavigate();
  const mySize = new SizeHelper(props.size);
  const [cooker, setCooker] = useState(false);
  const [student, setStudent] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (props.original) {
      setContent(props.original.content);
      setCooker(props.original.forCooker);
      setStudent(props.original.forStudent);
    }
  }, [props.original]);

  const sendPost = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const safeContent = DOMPurify.sanitize(content);

    const req = Object.assign(Object.fromEntries(formData.entries()), { timestamp: Date.now(), author: user.id, content: safeContent, forCooker: cooker, forStudent: student });
    const jsonData = JSON.stringify(req);

    if (!user.title || user.title !== "admin") {
      alert("Sorry, only the admin can post the news");
      return;
    }

    if (!(cooker || student)) {
      alert("You should specify who you post for.");
      return;
    }

    let response;
    let id = props.original._id || undefined;
    if (props.original.title !== "") {
      response = await fetch(`${url}api/v1/post/${props.original._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: jsonData,
        credentials: "include",
      });
    } else {
      response = await fetch(`${url}api/v1/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonData,
        credentials: "include",
      });
    }

    if (response.status === 413) {
      alert("The post content is too large, maybe too many images");
      return;
    }

    const data = await response.json();
    if (data.status === "success") {
      id = id || data.postId;
      navigate(`/post/${id}`);
    } else {
      alert(data.message);
    }
  };

  return (
    <Fragment>
      <form id='WritePostForm' style={{ flexDirection: "column", ...centerStyle }} onSubmit={sendPost}>
        <div style={{ width: "60%", ...centerStyle, justifyContent: "flex-start" }}>
          <label className='leftLabel' style={{ width: "20%", fontSize: mySize.adjust(0.03) }}>
            TITLE
          </label>
          <input name='title' id='titleBox' style={{ fontSize: mySize.adjust(0.03) }} type='text' defaultValue={props.original.title || undefined}></input>
        </div>
        <div style={{ width: "60%", marginTop: "3%", ...centerStyle, justifyContent: "flex-start" }}>
          <label className='leftLabel' style={{ width: "20%", fontSize: mySize.adjust(0.03) }}>
            FOR
          </label>
          <div style={{ width: "78%", display: "flex", justifyContent: "space-evenly" }}>
            <input
              type='button'
              name='forCooker'
              class='forBtn'
              id='Cooker'
              style={{ fontSize: mySize.adjust(0.03), backgroundColor: cooker ? "#FFDD31" : "#efefef" }}
              value='Cooker'
              onClick={() => setCooker(!cooker)}
            ></input>
            <input
              type='button'
              name='forStudent'
              class='forBtn'
              id='Student'
              style={{ fontSize: mySize.adjust(0.03), backgroundColor: student ? "#FFDD31" : "#efefef" }}
              onClick={() => setStudent(!student)}
              value='Student'
            ></input>
          </div>
        </div>
        <div style={{ marginTop: "5%", width: "100%", ...centerStyle, flexDirection: "column" }}>
          <h1 id='contextLabel' style={{ fontSize: mySize.adjust(0.04) }}>
            CONTEXT
          </h1>
          <Tiptap size={props.size} setContent={setContent} content={content} />
        </div>
        <div style={{ display: "flex", marginTop: mySize.adjust(-0.04), alignItems: "center", justifyItems: "flex-start", width: "65%" }}>
          <input type='checkBox' id='setNotice' name='setNotice' value='true' style={{ fontSize: mySize.adjust(0.03), width: mySize.adjust(0.02) }} checked={props.original.setNotice || undefined} />
          <p style={{ fontSize: mySize.adjust(0.025), marginLeft: mySize.adjust(0.005) }}>Set as an announcement</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", width: "80%" }}>
          <button id='send' type='submit' style={{ fontSize: mySize.adjust(0.03), marginTop: mySize.adjust(-0.045), marginBottom: mySize.adjust(0.01) }}>
            Send
          </button>
        </div>
      </form>
    </Fragment>
  );
}

export default WritePostForm;
