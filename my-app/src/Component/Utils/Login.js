import React, { useEffect, Fragment, useState } from "react";
import "./Login.css";
import SizeHelper from "./utils.js";
import { useUser } from "../Utils/UserContext.js";
import { useSize } from "../Utils/SizeContext.js";
import GoogleIcon from "./GoogleIcon.js";

const url = process.env.REACT_APP_BACKEND_URL;

const singupColumn = {
  display: "flex",
  margin: "5% 5% 0 3%",
};

const inputFontSize = 0.02;

function Login(props) {
  // For initializing
  const { size, isVertical } = useSize();
  const mySize = new SizeHelper(size);

  // For open the login window
  const [openLogin, setOpenLogin] = useState(false);
  const [googleSignup, setGoogleSignup] = useState(false);
  const [openSignup, setOpenSingup] = useState(false);

  // Login API
  const { user, setUser } = useUser();

  const submitLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
    const response = await fetch(`${url}api/v1/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonData,
      credentials: "include",
    });

    const data = await response.json();
    if (data.status === "success") {
      setUser({ name: data.user, id: data._id, title: data.title });
      setOpenLogin(false);
    } else {
      alert(data.message);
    }
  };

  // Signup API
  const submitSignup = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const objData = Object.fromEntries(formData.entries());
    const jsonData = JSON.stringify(objData);

    // Regular Signup
    let api = `${url}api/v1/user/signup`;

    // Googl Signup
    if (googleSignup) {
      api = `${url}api/v1/user/updateMe`;
    }

    const response = await fetch(api, {
      method: googleSignup ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonData,
      credentials: "include",
    });

    const data = await response.json();
    if (data.status === "success") {
      setUser({ name: data.user, id: data._id, title: data.title });
      if (googleSignup)
        setUser((prevUser) => ({
          ...prevUser,
          name: objData.name,
          title: objData.title,
        }));
      alert("Account create successfully!");
      setOpenSingup(false);
    } else {
      alert("Your email seems have sign up before.");
    }
  };

  // For Log out
  const [clickUser, setClickUser] = useState(false);
  const Logout = async (e) => {
    e.preventDefault();
    const response = await fetch(`${url}api/v1/user/logout`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();
    if (data.status === "success") {
      setUser({ name: "Login" });
    } else {
      alert(response.message);
    }
  };

  // For Google Signup
  useEffect(() => {
    if (props.googleSignup) {
      setGoogleSignup(true);
      setOpenSingup(true);
    }
  }, [props.googleSignup]);

  return (
    <Fragment>
      {props.position === "rightCorner" && ( // 橫向的 Login text
        <div id='Login_text'>
          <button
            onClick={() => {
              if (user.name === "Login") {
                setOpenLogin(true);
              }
            }}
            id='loginButton'
            style={{ fontSize: mySize.adjust(0.04) }}
            onMouseEnter={() => user.name !== "Login" && setClickUser(true)}
          >
            {user.name}
          </button>
          {clickUser && user.name !== "Login" && (
            <ul className='drop-down-menu' onMouseLeave={() => setClickUser(false)} style={{ border: "none" }}>
              <li>
                <button
                  style={{ fontSize: mySize.adjust(0.02) }}
                  onClick={() => {
                    setGoogleSignup(true);
                    setOpenSingup(true);
                  }}
                >
                  Edit
                </button>
              </li>
              <li>
                <button style={{ fontSize: mySize.adjust(0.02) }} onClick={Logout}>
                  Log out
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
      {props.position === "upperCenter" && ( // 在中間 Login text
        <div id='Login_text' style={{ position: "absolute", width: "100%", top: "50%", transform: "translateY(-50vw)", textAlign: "center", zIndex: 99 }}>
          <button id='loginButton' type='submit' onClick={() => setOpenLogin(true)} style={{ fontSize: mySize.adjust(0.04), color: "black" }}>
            {user.name === "Login" ? " - Login - " : user.name}
          </button>
        </div>
      )}
      {openLogin && (
        <div id='loginMask'>
          <div id='outerBox' style={{ width: mySize.adjust(0.6), height: mySize.adjust(0.8) }}>
            <div id='innerBox'>
              <button id='closeBtn' onClick={() => setOpenLogin(false)}>
                <hr id='closeLine' style={{ border: `${mySize.adjust(0.005)} solid white` }}></hr>
              </button>
              <h1 id='loginTitle' style={{ fontSize: mySize.adjust(0.04) }}>
                LOGI<span style={{ letterSpacing: 0 }}>N</span>
              </h1>
              <form id='loginForm' onSubmit={submitLogin}>
                <div className='loginInfo' style={{ marginTop: "7%" }}>
                  <h2 className='accText' style={{ fontSize: mySize.adjust(0.035), textAlign: "center" }}>
                    User
                  </h2>
                  <input id='accInput' className='inputArea' name='email' style={{ fontSize: mySize.adjust(0.025), height: isVertical ? "2vh" : "5vh" }}></input>
                </div>
                <div className='loginInfo' style={{ marginTop: "5%" }}>
                  <h2 className='accText' style={{ fontSize: mySize.adjust(0.035), textAlign: "center" }}>
                    Password
                  </h2>
                  <input type='password' id='pwdInput' className='inputArea' name='pwd' style={{ fontSize: mySize.adjust(0.025), height: isVertical ? "2vh" : "5vh" }}></input>
                </div>
                <div id='loginBtnSet'>
                  <button
                    onClick={() => {
                      setOpenSingup(true);
                      setOpenLogin(false);
                    }}
                    style={{ fontSize: mySize.adjust(0.04) }}
                    className='signupBtn'
                  >
                    Signup
                  </button>
                  <button id='loginBtn' style={{ fontSize: mySize.adjust(0.04) }}>
                    LOGIN
                  </button>
                </div>
                <hr style={{ width: "50%", marginTop: "5%", borderColor: "rgb(140 109 134 / 17%)", borderRadius: "2px" }}></hr>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "5%" }}>
                  <GoogleIcon size={props.plateSize} setGoogleSignup={setGoogleSignup} />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {openSignup && (
        <div id='loginMask'>
          <div id='outerBox' style={{ width: mySize.adjust(0.6), height: mySize.adjust(0.8) }}>
            <div id='innerBox'>
              <button id='closeBtn' onClick={() => setOpenSingup(false)}>
                <hr id='closeLine' style={{ border: `${mySize.adjust(0.005)} solid white` }}></hr>
              </button>
              <h1 id='loginTitle' style={{ fontFamily: "Inria Sans", fontSize: mySize.adjust(0.04), marginTop: "10%" }}>
                Signu<span style={{ letterSpacing: 0 }}>p</span>
              </h1>
              <form className='signupInfo' style={{ marginTop: "8%", display: "flex", flexDirection: "column", justifyContent: "space-around", height: "80%" }} onSubmit={submitSignup}>
                <div style={singupColumn}>
                  <h2 className='accText' style={{ fontSize: mySize.adjust(0.035) }}>
                    Title
                  </h2>
                  <select name='title' className='inputArea' style={{ fontSize: mySize.adjust(0.02) }}>
                    <option value='' disabled>
                      Please choose your title
                    </option>
                    <option value='admin' disabled={user.title === "admin" ? false : true}>
                      {user.title === "admin" ? "admin" : "MOE (Contact the admin)"}
                    </option>
                    <option value='cook'>Cook</option>
                    <option value='student'>Student</option>
                  </select>
                </div>
                <div style={singupColumn}>
                  <h2 className='accText' style={{ fontSize: mySize.adjust(0.035) }}>
                    Name
                  </h2>
                  <input
                    id='accSignup'
                    defaultValue={googleSignup && user.name !== "Login" ? user.name : ""}
                    className='inputArea'
                    name='name'
                    style={{ fontSize: mySize.adjust(inputFontSize) }}
                    required
                  ></input>
                </div>
                {!googleSignup && (
                  <Fragment>
                    <div style={singupColumn}>
                      <h2 className='accText' style={{ fontSize: mySize.adjust(0.035), letterSpacing: "0.1rem" }}>
                        Email
                      </h2>
                      <input required id='emailInput' className='inputArea' name='email' style={{ fontSize: mySize.adjust(inputFontSize) }}></input>
                    </div>
                    <div style={singupColumn}>
                      <h2 className='accText' style={{ fontSize: mySize.adjust(0.035), letterSpacing: "0.1rem" }}>
                        Password
                      </h2>
                      <input required type='password' id='pwdSignup' className='inputArea' name='pwd' style={{ fontSize: mySize.adjust(inputFontSize) }}></input>
                    </div>
                  </Fragment>
                )}
                <div style={singupColumn}>
                  <h2 className='accText' style={{ fontSize: mySize.adjust(0.035), letterSpacing: "0.1rem" }}>
                    School
                  </h2>
                  <input required id='schoolSignup' className='inputArea' name='school' style={{ fontSize: mySize.adjust(inputFontSize) }}></input>
                </div>
                <button type='submit' style={{ fontSize: mySize.adjust(0.04) }} className='signupBtn' id='joinBtn'>
                  JOIN
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Login;
