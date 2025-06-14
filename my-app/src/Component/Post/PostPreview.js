import React, { useEffect, Fragment, useState } from "react";
import PageSection from "../Utils/PageSection";
import "./PostPreview.css";
import SizeHelper from "../Utils/utils.js";
import { useNavigate } from "react-router-dom";
import he from "he";
import { useUser } from "../Utils/UserContext.js";
import { useSize } from "../Utils/SizeContext.js";

const url = process.env.REACT_APP_BACKEND_URL;

const verticalPostStyle = {
  height: "15vh",
  marginBottom: "3vh",
};

const verticalForWhoStyle = {
  height: "2vh",
  padding: "0 2% 0 2%",
};

const verticalMoreStyle = {
  paddingBottom: "3.5%",
};

const loadingStyle = {
  position: "relative",
  overflow: "hidden",
  backgroundColor: "#f2c700",
  borderRadius: "5px",
};

function PostPreview(props) {
  const [posts, setPosts] = useState([1, 2, 3, 4]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();

  const { size, isVertical } = useSize();
  const mySize = new SizeHelper(size);

  // Get all post API
  useEffect(() => {
    async function getPost(args) {
      let api = `${url}api/v1/post?page=${page}&`;

      if (args.q !== "") api += `q=${args.q}&`;
      if (!(args.whoFilter.forCook && args.whoFilter.forStudent)) {
        if (args.whoFilter.forCook) api += "forCook=true&";
        if (args.whoFilter.forStudent) api += "forStudent=true&";
      }

      const response = await fetch(api, {
        method: "GET",
        credentials: "include", // 確保 cookie 會隨請求發送
      });

      const data = await response.json();
      if (data.status === "success") {
        setTotalPage(Math.ceil(data.totalResults / 4));
        setPosts(data.data.posts);
        setLoading(false);
      }
    }

    getPost({ q: props.q, whoFilter: props.whoFilter });
  }, [props.q, props.whoFilter, props.clickFilter, page]);

  // forWho function
  const forwho = function (post) {
    if (post.forCook && post.forStudent) {
      return "For All";
    } else if (post.forCook) {
      return "For Cook";
    }
    return "For Student";
  };

  //  Go to the post
  const goToPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  // Delete post API
  const delPost = async (postId) => {
    if (!window.confirm("Are you sure to delete the post?")) {
      return;
    }

    const response = await fetch(`${url}api/v1/post/${postId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response;
    if (data.status === 204) {
      const updatePosts = posts.filter((item) => item.id !== postId);
      setPosts(updatePosts);
    } else {
      alert("something wrong...");
    }
  };

  return (
    <div className='preSection' style={{ margin: props.margin, width: "130%" }}>
      {loading && (
        <div className='prePost loading' style={isVertical ? verticalPostStyle : {}}>
          <div className='prePhoto loadingImg' style={{ height: "70%", width: mySize.adjust(0.3), ...loadingStyle }}></div>
          <div style={{ width: "100%" }}>
            <div className='preTitleSection loadingTitleSec' style={{ justifyContent: "flex-start" }}>
              <div className='preTitle loadingTitle' style={{ width: "60%", height: mySize.adjust(isVertical ? 0.03 : 0.04), marginTop: "0", ...loadingStyle }}></div>
              <div className='forWho loadingWho' style={isVertical ? verticalForWhoStyle : {}}></div>
            </div>
            <div className='preContext loadingContext' style={{ width: "80%", height: mySize.adjust(isVertical ? 0.05 : 0.055), marginTop: isVertical ? "5%" : "1.5%", ...loadingStyle }}></div>
            <div className='preContext loadingContext' style={{ width: "80%", height: mySize.adjust(isVertical ? 0.05 : 0.055), marginTop: isVertical ? "3%" : "1.5%", ...loadingStyle }}></div>
          </div>
        </div>
      )}

      {/* Post list */}
      {!loading &&
        posts.map((post, idx) => {
          let postContent = "";
          let firstImageBase64 = null;

          if (post.content !== undefined) {
            // Decode HTML entities
            const htmlContent = he.decode(post.content);

            // Drop the decoration of the content
            postContent = htmlContent.replace(/<[^>]+>/g, "");

            // Read the imgfile (only first one)
            const imgRegex = /<img[^>]+src="([^">]+)"/g;
            const match = imgRegex.exec(htmlContent);
            firstImageBase64 = match ? match[1] : null;
          }

          return (
            <div className='prePost' key={`prePost${idx}`} style={isVertical ? verticalPostStyle : {}}>
              {/* Delete button - only visible for admin or post author */}
              {(user.title === "admin" || (post.author && user.id === post.author[0]._id)) && (
                <button className='delBtn' onClick={() => delPost(post.id)}>
                  ✖
                </button>
              )}

              {/* Post thumbnail image */}
              <img className='prePhoto' src={firstImageBase64} alt=''></img>

              <div style={{ width: "100%" }}>
                {/* Post title section */}
                <div className='preTitleSection'>
                  <h1
                    className='preTitle'
                    title={post.title}
                    style={{ fontSize: mySize.adjust(isVertical ? 0.03 : 0.04), overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}
                  >
                    {post.title}
                  </h1>

                  {/* Target audience indicator */}
                  <div className='forWho' style={isVertical ? verticalForWhoStyle : {}}>
                    <p style={{ fontSize: mySize.adjust(0.018), letterSpacing: "0.1em", overflow: "hidden", textOverflow: "clip", whiteSpace: "nowrap" }}>{forwho(post)}</p>
                  </div>
                </div>

                {/* Post content preview - limited to 3 lines */}
                <div
                  className='preContext'
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                  }}
                >
                  <p style={{ fontSize: mySize.adjust(0.022), marginTop: "0.5%" }}>{postContent}</p>
                </div>
              </div>

              {/* Read more button */}
              <button className='forMore' onClick={() => goToPost(post._id)} style={{ fontSize: mySize.adjust(0.02), letterSpacing: "0.3em", ...(isVertical ? verticalMoreStyle : {}) }}>
                More...
              </button>
            </div>
          );
        })}

      {/* Pagination component */}
      {isVertical && (
        <div style={{ marginLeft: "-15%" }}>
          <PageSection totalPage={totalPage} setPage={setPage} page={page} />
        </div>
      )}
      {!isVertical && <PageSection totalPage={totalPage} setPage={setPage} page={page} />}
    </div>
  );
}

export default PostPreview;
