import React, { useEffect, Fragment, useState, useRef } from "react";
import Menu from "../Component/Utils/Menu";
import { useParams } from "react-router-dom";
import PostContent from "../Component/Post/PostContent";
import CommentSection from "../Component/Post/CommentSection";
import {chunkArray} from "../Component/Utils/utils";

const url = "http://localhost:3005/";

const vlStyle={
    borderLeft: "2px solid black",
    height: "30vh",
}

function OnePost() {
    // initialize UIsize
    const [size, setSize] = useState("90vh");
    const [isVertical, setIsVertical] = useState(false);
    const [post, setPost] = useState({comments:[]});
    const [userInfo, setUserInfo] = useState({name:'Please Log in to comment',id:''});
    const [commentChunk, setCommentChunk]= useState([[]]);
    const { id } = useParams();
    
    // UI Size Initilization
    useEffect(() => {
      function updateSize() {
        if (window.innerWidth > window.innerHeight) {
          // 橫 > 直
          setSize("90vh");
        } // 直 > 橫
        else {
          setSize("90vw"); // 直向
          setIsVertical(true); // 直向
        }
      }
  
      updateSize();
  
      window.addEventListener("resize", updateSize);
  
      // 清理函數
      return () => {
        window.removeEventListener("resize", updateSize);
      };
    }, []);
    
    // Connect to GetPost API
    useEffect( () => {
        async function getOnePost(postId) {
          
            let api = `${url}api/v1/post/${postId}`;
            
            const response = await fetch(api, {
                method:"GET",
                credentials:"include"
            });
            
            const data = await response.json();

            if (data.status === "success") {
                setPost(data.data.post);
                // Chunk the comment to the size for 'one' page of comment section
                setCommentChunk(chunkArray(data.data.post.comments));
            }
        }
  
      getOnePost(id);
    },[id]);


    return (
      <Fragment>
        <Menu size = {size} setUserInfo = {setUserInfo}/>
        <div style={{display:"flex",height:"100%",marginLeft:"3%"}}>
        <div className='vl' style={{marginTop:"20%", borderColor:"#50B6F9",...vlStyle}}></div>
        <PostContent size = {size} post = {post} />
        <div className='vl' style={{marginTop:"10%",borderColor:"#FFDD31",...vlStyle}}></div>
        </div>
        <CommentSection post={post} userInfo={userInfo} size = {size} commentChunk={commentChunk}/>
      </Fragment>
    );
  }
  
  export default OnePost;