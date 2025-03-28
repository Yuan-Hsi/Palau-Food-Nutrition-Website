import React, { useEffect, Fragment, useState, useRef } from "react";
import Menu from "../Component/Utils/Menu";
import SearchBar from "../Component/Post/SearchBar";
import PostPreview from "../Component/Post/PostPreview";
import WritePostBtn from "../Component/Post/WritePostBtn";
import ForwhoFilter from "../Component/Post/ForwhoFilter";
import { useUser } from "../Component/Utils/UserContext.js";

function Post() {
  // initialize UIsize
  const [size, setSize] = useState("90vh");
  const [isVertical, setIsVertical] = useState(false);
  const [clickFilter, setClickFilter] = useState(false);
  const [q, setQ] = useState("");
  const { user } = useUser();
  const [whoFilter, setWhoFilter] = useState({ forCooker: 0, forStudent: 0 });

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

  useEffect(() => {
    if (user.title === "student") setWhoFilter({ forCooker: 0, forStudent: 1 });
    if (user.title === "cooker") setWhoFilter({ forCooker: 1, forStudent: 0 });
  }, [user]);

  return (
    <Fragment>
      <Menu size={size} />
      <div style={{ display: "flex", marginTop: "3%" }}>
        <SearchBar margin='2vh 0% 0% 3vw' size={size} setQ={setQ} setClickFilter={setClickFilter} />
        {user.title && user.title === "admin" && <WritePostBtn margin='2.5vh 0 0 7vw' size={size} />}
      </div>
      <div style={{ display: "flex", height: "100vh" }}>
        <PostPreview margin='4vh 0% 0% 3vw' size={size} whoFilter={whoFilter} clickFilter={clickFilter} q={q} />
        <ForwhoFilter whoFilter={whoFilter} setWhoFilter={setWhoFilter} setClickFilter={setClickFilter} margin='10vh 0% 0% 0' size={size} />
      </div>
    </Fragment>
  );
}

export default Post;
