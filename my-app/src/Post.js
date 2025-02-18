import React, { useEffect, Fragment, useState, useRef } from "react";
import Menu from "./Component/Menu";
import "./Post.css";
import SearchBar from "./Component/Post/SearchBar";
import PostPreview from "./Component/Post/PostPreview";

function Post() {
    // initialize UIsize
    const [size, setSize] = useState("90vh");
    const [isVertical, setIsVertical] = useState(false);

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
  
    return (
      <Fragment>
        <Menu size = {size}/>
        <SearchBar margin="2vh 0% 0% 3vw" size ={size}/>
        <PostPreview margin="4vh 0% 0% 3vw" size ={size} />
      </Fragment>
    );
  }
  
  export default Post;