import React, { useEffect, Fragment, useState } from "react";
import "./Login.css";
import SizeHelper from "./utils.js";
import { useUser } from "../Utils/UserContext.js";

const url = process.env.REACT_APP_BACKEND_URL;

const singupColumn = {
  display: "flex",
  margin: "5% 5% 0 3%",
};

const inputFontSize = 0.02;

function Login(props) {
  // For initializing
  const mySize = new SizeHelper(props.plateSize);
  const [isHorizon, setisHorizon] = useState(true);
  useEffect(() => {
    function screenDetect() {
      if (window.innerWidth > window.innerHeight) {
        // 橫 > 直
        setisHorizon(true);
      } // 直 > 橫
      else {
        setisHorizon(false);
      }
    }

    screenDetect();

    window.addEventListener("resize", screenDetect);

    // 清理函數
    return () => {
      window.removeEventListener("resize", screenDetect);
    };
  }, []);

  // For open the login window
  const [openLogin, setOpenLogin] = useState(false);
  const [googleSignup, setGoogleSignup] = useState(false);
  const [googleLogin, setGoogleLogin] = useState(false);
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
    const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
    const response = await fetch(`${url}api/v1/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonData,
      credentials: "include",
    });

    const data = await response.json();
    if (data.status === "success") {
      setUser({ name: data.user, id: data._id, title: data.title });
      alert("Account create successfully!");
      setOpenSingup(false);
    } else {
      alert(data.message);
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

  return (
    <Fragment>
      {isHorizon && ( // 橫向的 Login text
        <div id='Login_text' style={{ position: "absolute", right: 30, zIndex: 3 }}>
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
            <ul className='drop-down-menu' onMouseLeave={() => setClickUser(false)}>
              <li>
                <button style={{ fontSize: mySize.adjust(0.02) }} onClick={Logout}>
                  Log out
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
      {!isHorizon && ( // 直向的 Login text
        <div
          id='Login_text'
          style={{
            position: "absolute",
            width: "100%",
            top: "50%", // 從中心點開始
            transform: "translateY(-470%)", // 來去向上移動高度
            textAlign: "center",
            zIndex: 99,
          }}
        >
          <button
            id='loginButton'
            type='submit'
            onClick={() => setOpenLogin(true)}
            style={{
              fontSize: mySize.adjust(0.04),
            }}
          >
            - LOGIN -
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
              <h1
                id='loginTitle'
                style={{
                  fontSize: mySize.adjust(0.04),
                }}
              >
                LOGI<span style={{ letterSpacing: 0 }}>N</span>
              </h1>
              <form id='loginForm' onSubmit={submitLogin}>
                <div className='loginInfo' style={{ marginTop: "13%" }}>
                  <h2
                    className='accText'
                    style={{
                      fontSize: mySize.adjust(0.035),
                      textAlign: "center",
                    }}
                  >
                    User
                  </h2>
                  <input
                    id='accInput'
                    className='inputArea'
                    name='email'
                    style={{
                      fontSize: mySize.adjust(0.025),
                      height: "5vh",
                    }}
                  ></input>
                </div>
                <div className='loginInfo' style={{ marginTop: "5%" }}>
                  <h2
                    className='accText'
                    style={{
                      fontSize: mySize.adjust(0.035),
                      textAlign: "center",
                    }}
                  >
                    Password
                  </h2>
                  <input
                    type='password'
                    id='pwdInput'
                    className='inputArea'
                    name='pwd'
                    style={{
                      fontSize: mySize.adjust(0.025),
                      height: "5vh",
                    }}
                  ></input>
                </div>
                <div id='loginBtnSet'>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <button
                      onClick={() => {
                        setOpenSingup(true);
                        setOpenLogin(false);
                      }}
                      style={{
                        fontSize: mySize.adjust(0.04),
                      }}
                      className='signupBtn'
                    >
                      Signup
                    </button>
                    <button
                      onClick={() => {
                        setOpenSingup(true);
                        setGoogleSignup(true);
                        setOpenLogin(false);
                      }}
                      style={{
                        fontSize: mySize.adjust(0.02),
                        whiteSpace: "nowrap",
                        marginTop: "10%",
                      }}
                      className='signupBtn'
                    >
                      Google Signup
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <button
                      id='loginBtn'
                      style={{
                        fontSize: mySize.adjust(0.04),
                      }}
                    >
                      LOGIN
                    </button>
                    <button
                      id='loginBtn'
                      style={{
                        fontSize: mySize.adjust(0.02),
                        whiteSpace: "nowrap",
                        marginTop: "10%",
                      }}
                    >
                      Google LOGIN
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {openSignup && (
        <div id='loginMask'>
          <div
            id='outerBox'
            style={{
              width: mySize.adjust(0.6),
              height: mySize.adjust(0.8),
            }}
          >
            <div id='innerBox'>
              <button id='closeBtn' onClick={() => setOpenSingup(false)}>
                <hr
                  id='closeLine'
                  style={{
                    border: `${mySize.adjust(0.005)} solid white`,
                  }}
                ></hr>
              </button>
              <h1
                id='loginTitle'
                style={{
                  fontFamily: "Inria Sans",
                  fontSize: mySize.adjust(0.04),
                  marginTop: "10%",
                }}
              >
                Signu<span style={{ letterSpacing: 0 }}>p</span>
              </h1>
              <form className='signupInfo' style={{ marginTop: "8%" }} onSubmit={submitSignup}>
                <div style={singupColumn}>
                  <h2
                    className='accText'
                    style={{
                      fontSize: mySize.adjust(0.035),
                    }}
                  >
                    Title
                  </h2>
                  <select
                    name='title'
                    className='inputArea'
                    style={{
                      fontSize: mySize.adjust(0.02),
                    }}
                  >
                    <option value='' disabled>
                      Please choose your title
                    </option>
                    <option value='MOE' disabled>
                      MOE (Contact the admin)
                    </option>
                    <option value='cooker'>Cooker</option>
                    <option value='student'>Student</option>
                  </select>
                </div>
                <div style={singupColumn}>
                  <h2
                    className='accText'
                    style={{
                      fontSize: mySize.adjust(0.035),
                    }}
                  >
                    Name
                  </h2>
                  <input
                    id='accSignup'
                    className='inputArea'
                    name='name'
                    style={{
                      fontSize: mySize.adjust(inputFontSize),
                    }}
                  ></input>
                </div>
                {!googleSignup && (
                  <Fragment>
                    <div style={singupColumn}>
                      <h2
                        className='accText'
                        style={{
                          fontSize: mySize.adjust(0.035),
                          letterSpacing: "0.1rem",
                        }}
                      >
                        Email
                      </h2>
                      <input id='emailInput' className='inputArea' name='email' style={{ fontSize: mySize.adjust(inputFontSize) }}></input>
                    </div>
                    <div style={singupColumn}>
                      <h2 className='accText' style={{ fontSize: mySize.adjust(0.035), letterSpacing: "0.1rem" }}>
                        Password
                      </h2>
                      <input
                        type='password'
                        id='pwdSignup'
                        className='inputArea'
                        name='pwd'
                        style={{
                          fontSize: mySize.adjust(inputFontSize),
                        }}
                      ></input>
                    </div>
                  </Fragment>
                )}
                <div style={singupColumn}>
                  <h2
                    className='accText'
                    style={{
                      fontSize: mySize.adjust(0.035),
                      letterSpacing: "0.1rem",
                    }}
                  >
                    School
                  </h2>
                  <input
                    id='schoolSignup'
                    className='inputArea'
                    name='school'
                    style={{
                      fontSize: mySize.adjust(inputFontSize),
                    }}
                  ></input>
                </div>
                <button
                  type='submit'
                  style={{
                    fontSize: mySize.adjust(0.04),
                  }}
                  className='signupBtn'
                  id='joinBtn'
                >
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
