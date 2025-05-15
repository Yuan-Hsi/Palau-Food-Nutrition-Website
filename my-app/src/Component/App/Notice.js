import React, { Fragment, useEffect, useState, useRef } from "react";
import "./Notice.css";
import { transformDate } from "../Utils/utils.js";
import he from "he";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const url = process.env.REACT_APP_BACKEND_URL;

function Notice(props) {
  // Notice close
  const [closeNotice, setCloseNotice] = useState(false);
  const [openNotice, setOpenNotice] = useState(true);
  const [posts, setPosts] = useState([]);
  const noticeRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // 检查点击是否在 noticeBack 元素之外
      const notice = noticeRef.current;
      if (notice && !notice.contains(event.target)) {
        setCloseNotice(true);
      }
    };

    // 只有当 Notice 显示时才添加事件监听器
    if (!openNotice) {
      setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
      }, 0);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [openNotice, closeNotice]);

  useEffect(() => {
    // Notice content
    const noticeContent = async (e) => {
      const response = await fetch(`${url}api/v1/post?setNotice=true`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();
      if (data.status === "success") {
        setPosts(data.data.posts);
      } else {
        alert(data.message);
      }
    };

    noticeContent();
  }, [setPosts]);

  return (
    <Fragment>
      {!closeNotice && (
        <div
          id='noticeBack'
          style={{
            width: `${parseFloat(props.plateSize) * 0.65}${props.plateSize.slice(-2)}`, // slice 的部分是看 vw 還是 vh
            height: `${parseFloat(props.plateSize) * 0.9}${props.plateSize.slice(-2)}`,
            backgroundColor: "white",
            position: "fixed",
            zIndex: 50,
            borderRadius: "5%",
            boxShadow: "8px 5px 20.6px rgba(0, 0, 0, 0.25)",
          }}
          ref={noticeRef}
        >
          <div className='content' style={{ overflow: "auto", height: "100%" }}>
            {posts &&
              posts.map((post) => (
                <>
                  <h1
                    className='contentDate'
                    style={{
                      fontSize: `${parseFloat(props.plateSize) * 0.055}${props.plateSize.slice(-2)}`,
                    }}
                  >
                    {transformDate(post.timestamp).split(" / ")[0] + " " + months[transformDate(post.timestamp).split(" / ")[1] - 1]}
                  </h1>
                  <h1
                    className='contentTitle'
                    style={{
                      fontSize: `${parseFloat(props.plateSize) * 0.055}${props.plateSize.slice(-2)}`,
                    }}
                  >
                    {post.title}
                  </h1>
                  <p
                    className='contentText'
                    style={{
                      fontSize: `${parseFloat(props.plateSize) * 0.035}${props.plateSize.slice(-2)}`,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: he.decode(post.content).replace(/<img/g, `<img style="max-width: 100%; max-height: ${parseFloat(props.plateSize) * 0.7}${props.plateSize.slice(-2)}"`),
                    }}
                  ></p>
                </>
              ))}
          </div>
          {openNotice && (
            <div
              id='noticeCover'
              style={{
                position: "absolute",
                bottom: "0",
                width: "100%",
                height: "85%",
                background: "linear-gradient(#FFFFFF 15%, #0099ff 37%,#0099ff 45% , #FFFFFF 86%)",
                borderRadius: "5%",
                boxShadow: "1px -3px 15.5px rgba(0, 0, 0, 0.25)",
                transition: "0.5s",
              }}
              onClick={() => {
                setOpenNotice(false);
              }}
            >
              <h1
                style={{
                  fontFamily: "Metal",
                  fontSize: `${parseFloat(props.plateSize) * 0.14}${props.plateSize.slice(-2)}`,
                  letterSpacing: "0.15em",
                  marginTop: "30%",
                  textAlign: "center",
                  color: "#FFFF00",
                }}
              >
                NOTIC<span style={{ letterSpacing: 0 }}>E</span>
              </h1>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
}

export default Notice;
