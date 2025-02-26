import React, { useEffect, Fragment, useState } from "react";
import PageSection from "../Utils/PageSection";
import "./PostPreview.css";
import SizeHelper from "../Utils/utils.js";
import { useNavigate } from "react-router-dom";
import he from "he"

const url = process.env.REACT_APP_BACKEND_URL;

function PostPreview(props) {
  const [posts, setPosts] = useState([1, 2, 3, 4]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const navigate = useNavigate();

  const mySize = new SizeHelper(props.size);

  // Get all post API
  useEffect(() => {
    async function getPost(args) {
      let api = `${url}api/v1/post?page=${page}&`;

      if (props.clickFilter) {
        if (args.q !== "") api += `q=${args.q}&`;
        if (!(args.whoFilter.forCooker && args.whoFilter.forStudent)) {
          if (args.whoFilter.forCooker) api += "forCooker=true&";
          if (args.whoFilter.forStudent) api += "forStudent=true&";
        }
      }

      const response = await fetch(api, {
        method: "GET",
        credentials: "include", // 確保 cookie 會隨請求發送
      });

      const data = await response.json();
      if (data.status === "success") {
        setTotalPage(Math.ceil(data.totalResults / 4));
        setPosts(data.data.posts);
      }
    }

    getPost({ q: props.q, whoFilter: props.whoFilter });
  }, [props.q, props.whoFilter, props.clickFilter, page]);

  // forWho function
  const forwho = function (post) {
    if (post.forCooker && post.forStudent) {
      return "For All";
    } else if (post.forCooker) {
      return "For Cooker";
    }
    return "For Student";
  };

  //  Go to the post
  const goToPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="preSection" style={{ margin: props.margin, width: "130%" }}>
      {posts.map((post, idx) => {

        // Drop the decoration of the content
        const postContent = (post.content===undefined) ? '' : he.decode(post.content).replace(/<[^>]+>/g, "");

        return (
          <div className="prePost">
            <img className="prePhoto" src="imageHolder.png" alt=""></img>
            <div style={{ width: "100%" }}>
              <div className="preTitleSection">
                <h1 className="preTitle" style={{ fontSize: mySize.adjust(0.04) }} > {post.title} </h1>
                <div className="forWho">
                  <p style={{  fontSize: mySize.adjust(0.018), letterSpacing: "0.1em", overflow: "hidden", textOverflow: "clip", whiteSpace: "nowrap", }} >
                    {forwho(post)}</p>
                </div>
              </div>
              <div
                className="preContext"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                }}
              >
                <p style={{ fontSize: mySize.adjust(0.022), marginTop: "2%" }}>
                  {postContent}
                </p>
              </div>
            </div>
            <button
              className="forMore"
              onClick={() => goToPost(post._id)}
              style={{ fontSize: mySize.adjust(0.02), letterSpacing: "0.3em" }}
            >
              More...
            </button>
          </div>
        );
      })}

      <PageSection totalPage={totalPage} setPage={setPage} page={page} />
    </div>
  );
}

export default PostPreview;
