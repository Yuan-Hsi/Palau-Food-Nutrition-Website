import React, { useEffect, Fragment, useState, useRef } from "react";
import Menu from "../Component/Utils/Menu";
import SearchBar from "../Component/Post/SearchBar";
import PostPreview from "../Component/Post/PostPreview";
import WritePostBtn from "../Component/Post/WritePostBtn";
import ForwhoFilter from "../Component/Post/ForwhoFilter";
import { useUser } from "../Component/Utils/UserContext.js";
import { useSize } from "../Component/Utils/SizeContext.js";

function Post() {
  // initialize UIsize
  const [clickFilter, setClickFilter] = useState(false);
  const [q, setQ] = useState("");
  const { user } = useUser();
  const { size, isVertical } = useSize();
  const [whoFilter, setWhoFilter] = useState({ forCooker: 0, forStudent: 0 });

  useEffect(() => {
    if (user.title === "student") setWhoFilter({ forCooker: 0, forStudent: 1 });
    if (user.title === "cooker") setWhoFilter({ forCooker: 1, forStudent: 0 });
  }, [user]);

  return (
    <Fragment>
      <Menu />
      {!isVertical && (
        <Fragment>
          <div style={{ display: "flex", marginTop: "3%" }}>
            <SearchBar margin='2vh 0% 0% 3vw' setQ={setQ} setClickFilter={setClickFilter} />
            {user.title && user.title === "admin" && <WritePostBtn margin='2.5vh 0 0 7vw' />}
          </div>
          <div style={{ display: "flex", height: "100vh" }}>
            <PostPreview margin='4vh 0% 0% 3vw' whoFilter={whoFilter} clickFilter={clickFilter} q={q} />
            <ForwhoFilter whoFilter={whoFilter} setWhoFilter={setWhoFilter} setClickFilter={setClickFilter} margin='10vh 0% 0% 0' />
          </div>
        </Fragment>
      )}
      {isVertical && (
        <Fragment>
          <div style={{ display: "flex", marginTop: "3%", alignItems: "center" }}>
            <SearchBar margin='0 0% 0% 17vw' setQ={setQ} setClickFilter={setClickFilter} />
          </div>
          <ForwhoFilter whoFilter={whoFilter} setWhoFilter={setWhoFilter} setClickFilter={setClickFilter} />
          <div style={{ display: "flex", height: "100vh" }}>
            <PostPreview margin='0 0% 0% 15vw' whoFilter={whoFilter} clickFilter={clickFilter} q={q} />
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default Post;
