import React, { useEffect, Fragment, useState, useRef } from "react";
import Menu from "../Component/Utils/Menu";
import WritePostBtn from "../Component/Post/WritePostBtn";
import { useParams } from "react-router-dom";
import PostContent from "../Component/Post/PostContent";

const url = "http://localhost:3005/";

function OnePost() {
    // initialize UIsize
    const [size, setSize] = useState("90vh");
    const [isVertical, setIsVertical] = useState(false);
    const [post, setPost] = useState({});
    const { id } = useParams();
    
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
    
    // Connect API
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
            }
        }
  
      getOnePost(id);
    },[id]);


    return (
      <Fragment>
        <Menu size = {size}/>
        <PostContent size = {size} post = {post} />
        <WritePostBtn margin="2.5vh 0 0 7vw" size={size}/>
      </Fragment>
    );
  }
  
  export default OnePost;