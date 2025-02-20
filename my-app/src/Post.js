import React, { useEffect, Fragment, useState, useRef } from "react";
import Menu from "./Component/Menu";
import "./Post.css";
import SearchBar from "./Component/Post/SearchBar";
import PostPreview from "./Component/Post/PostPreview";
import WritePostBtn from "./Component/Post/WritePostBtn";
import ForwhoFilter from "./Component/Post/ForwhoFilter";

function Post() {
    // initialize UIsize
    const [size, setSize] = useState("90vh");
    const [isVertical, setIsVertical] = useState(false);
    const [clickFilter, setClickFilter] = useState(false);
    const [q,setQ] = useState('');
    const [whoFilter, setWhoFilter] = useState({forCooker:0,forStudent:0});

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
        <div style={{display:"flex"}}>
        <SearchBar margin="2vh 0% 0% 3vw" size ={size} setQ={setQ}/>
        <WritePostBtn margin="2.5vh 0 0 7vw" size={size}/>
        </div>
        <div style={{display:"flex",height:"100vh"}}>
        <PostPreview margin="4vh 0% 0% 3vw" size ={size} whoFilter={whoFilter} clickFilter={clickFilter} q ={q}/>
        <ForwhoFilter whoFilter={whoFilter} setWhoFilter={setWhoFilter} setClickFilter={setClickFilter} margin="10vh 0% 0% 0"  size ={size} />
        </div>
      </Fragment>
    );
  }
  
  export default Post;