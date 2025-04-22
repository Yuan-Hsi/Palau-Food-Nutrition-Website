import React, { useEffect, Fragment, useState, useRef } from "react";
import Menu from "../Component/Utils/Menu";
import { useParams, useNavigate } from "react-router-dom";
import PostContent from "../Component/Post/PostContent";
import CommentSection from "../Component/Post/CommentSection";
import { chunkArray } from "../Component/Utils/utils";

const url = process.env.REACT_APP_BACKEND_URL;

const vlStyle = {
  borderLeft: "2px solid black",
  height: "30vh",
};

function OnePost() {
  const [post, setPost] = useState({ comments: [] });
  const [commentChunk, setCommentChunk] = useState([[]]);
  const navigate = useNavigate();
  const { id } = useParams();

  // Connect to GetPost API
  useEffect(() => {
    async function getOnePost(postId) {
      let api = `${url}api/v1/post/${postId}`;

      const response = await fetch(api, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "success") {
        setPost(data.data.post);
        // Chunk the comment to the size for 'one' page of comment section
        setCommentChunk(chunkArray(data.data.post.comments));
      }
    }

    getOnePost(id);
  }, [id]);

  //  Go to the post
  const goToEdit = () => {
    navigate(`/writeapost/${id}`);
  };

  return (
    <Fragment>
      <Menu />
      <div style={{ display: "flex", height: "100%", marginLeft: "3%" }}>
        <div className='vl' style={{ marginTop: "20%", borderColor: "#50B6F9", ...vlStyle }}></div>
        <PostContent post={post} editFunction={() => goToEdit()} />
        <div className='vl' style={{ marginTop: "10%", borderColor: "#FFDD31", ...vlStyle }}></div>
      </div>
      <CommentSection post={post} commentChunk={commentChunk} setCommentChunk={setCommentChunk} />
    </Fragment>
  );
}

export default OnePost;
