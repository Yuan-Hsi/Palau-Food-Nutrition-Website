import "./App.css";
import React, { useEffect, Fragment, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Login from "../Component/Utils/Login";
import PlateContent from "../Component/App/PlateCotent";
import Notice from "../Component/App/Notice";
import Credit from "../Component/Utils/Credit";

const plateStyle = {
  borderRadius: "50%",
  background: "linear-gradient(45deg, #FFFF00, #FFFD50 30%,#FFF9F9)",
};

const centerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const lineStyle = {
  border: "1px solid #E4C859",
  width: "70%",
};

function App() {
  const [userInfo, setUserInfo] = useState({ name: "", id: "", title: "" });
  const [newUser, setNewUser] = useState(false);
  const [searchParams] = useSearchParams();
  const isNewUser = searchParams.get("isNewUser");

  // initialize UIsize
  const [plateSize, setplateSize] = useState("90vh");
  useEffect(() => {
    function updateSize() {
      if (window.innerWidth > window.innerHeight) {
        // 橫 > 直
        setplateSize("90vh");
      } // 直 > 橫
      else {
        setplateSize("90vw"); // 直向
      }
    }

    updateSize();

    window.addEventListener("resize", updateSize);

    // 清理函數
    return () => {
      window.removeEventListener("resize", updateSize);
    };
    console.log(isNewUser);
  }, []);

  // isnewuser?
  useEffect(() => {
    if (isNewUser === "true") {
      setNewUser(true);
    }
  }, [isNewUser]);

  return (
    <Fragment>
      <Login plateSize={plateSize} setUserInfo={setUserInfo} googleSignup={newUser} position={plateSize === "90vh" ? "rightCorner" : "upperCenter"} />
      <div id='_menu' style={{ height: "100vh", position: "relative", ...centerStyle }}>
        <Notice plateSize={plateSize} />
        <div id='plateBack' style={{ width: plateSize, height: plateSize, boxShadow: "6px 4px 23.3px rgba(0, 0, 0, 0.25)", position: "absolute", zIndex: 0, ...plateStyle }}></div>
        <div
          id='platefront'
          style={{
            width: `${parseFloat(plateSize) * 0.85}${plateSize.slice(-2)}`, // slice 的部分是看 vw 還是 vh
            height: `${parseFloat(plateSize) * 0.85}${plateSize.slice(-2)}`,
            position: "relative",
            zIndex: 1,
            boxShadow: "inset rgba(0, 0, 0, 0.25) 15px -13px 23.3px -1px",
            ...plateStyle,
            ...centerStyle,
          }}
        >
          <PlateContent plateSize={plateSize} lineStyle={lineStyle} />
        </div>
        <div id='blueLine'></div>
      </div>
      <Credit color={plateSize === "90vw" ? "white" : ""} />
    </Fragment>
  );
}

export default App;
