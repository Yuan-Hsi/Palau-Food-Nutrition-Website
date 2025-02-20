import React, { useEffect, Fragment, useState } from "react";
import "./Login.css";

const url = 'http://localhost:3005/'

const singupColumn ={
  display:"flex",
  margin:"5% 5% 0 3%"
}

const inputFontSize = 0.02;

function Login(props) {
  // For initializing
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
  const [openSignup, setOpenSingup] = useState(false);

  // isLogin
  const [user, setUser] = useState('Login');

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await fetch(`${url}api/v1/user/isLoggedin`, {
          method: "GET",
          credentials: "include" // 確保 cookie 會隨請求發送
        });

        const data = await response.json();
        if (data.status === "success") {
          setUser(`Hi, ${data.name}`); // 設置用戶狀態
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    }

    checkLoginStatus();
  }, []); // 依賴陣列為空，表示只在組件掛載時執行一次

    // Login API
    const submitLogin = async (e) =>{
      e.preventDefault();
      const formData = new FormData(e.target);
      const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
      const response = await fetch(`${url}api/v1/user/login`,{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: jsonData,
        credentials: "include"
      });
  
      const data = await response.json();
      if (data.status === "success") {
        setUser(`Hi, ${data.user}`);
        setOpenLogin(false);
      }
      else{
        alert(data.message)
      }
    }

    // Signup API
    const submitSignup = async (e) =>{
      e.preventDefault();
      const formData = new FormData(e.target);
      const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
      const response = await fetch(`${url}api/v1/user/signup`,{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: jsonData,
        credentials: "include"
      });
  
      const data = await response.json();
      if (data.status === "success") {
        setUser(`Hi, ${data.user}`);
        alert("Account create successfully!");
        setOpenSingup(false);
      }
      else{
        alert(data.message)
      }
    }

  return (
    <Fragment>
      {isHorizon && ( // 橫向的 Login text
        <div
          id="Login_text"
          style={{ position: "absolute", right: 30, zIndex: 3 }}
        >
          <button
            onClick={() => setOpenLogin(true)}
            id="loginButton"
            style={{
              fontSize: `${
                parseFloat(props.plateSize) * 0.04
              }${props.plateSize.slice(-2)}`,
            }}
          >
            {user}
          </button>
        </div>
      )}
      {!isHorizon && ( // 直向的 Login text
        <div
          id="Login_text"
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
            id="loginButton"
            type="submit"
            onClick={() => setOpenLogin(true)}
            style={{
              fontSize: `${
                parseFloat(props.plateSize) * 0.04
              }${props.plateSize.slice(-2)}`,
            }}
          >
            - LOGIN -
          </button>
        </div>
      )}
      {openLogin && (
        <div id="loginMask">
          <div
            id="outerBox"
            style={{
              width: `${
                parseFloat(props.plateSize) * 0.6
              }${props.plateSize.slice(-2)}`,
              height: `${
                parseFloat(props.plateSize) * 0.8
              }${props.plateSize.slice(-2)}`,
            }}
          >
            <div id="innerBox">
              <button id="closeBtn" onClick={() => setOpenLogin(false)}>
                <hr
                  id="closeLine"
                  style={{
                    border: `${
                      parseFloat(props.plateSize) * 0.005
                    }${props.plateSize.slice(-2)} solid white`,
                  }}
                ></hr>
              </button>
              <h1
                id="loginTitle"
                style={{
                  fontSize: `${
                    parseFloat(props.plateSize) * 0.04
                  }${props.plateSize.slice(-2)}`,
                }}
              >
                LOGI<span style={{ letterSpacing: 0 }}>N</span>
              </h1>
              <form id="loginForm" onSubmit={submitLogin}>
              <div className="loginInfo" style={{ marginTop: "13%" }}>
                <h2
                  className="accText"
                  style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * 0.035
                    }${props.plateSize.slice(-2)}`,
                    textAlign:"center"
                  }}
                >
                  User
                </h2>
                <input
                  id="accInput"
                  className="inputArea"
                  name="email"
                  style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * 0.025
                    }${props.plateSize.slice(-2)}`,
                    height:"5vh"
                  }}
                ></input>
              </div>
              <div className="loginInfo" style={{ marginTop: "5%" }}>
                <h2
                  className="accText"
                  style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * 0.035
                    }${props.plateSize.slice(-2)}`,
                    textAlign:"center",
                  }}
                >
                  Password
                </h2>
                <input
                  type="password"
                  id="pwdInput"
                  className="inputArea"
                  name="pwd"
                  style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * 0.025
                    }${props.plateSize.slice(-2)}`,
                    height:"5vh"
                  }}
                ></input>
              </div>
              <div id="loginBtnSet">
                <button
                  onClick={() => {
                    setOpenSingup(true);
                    setOpenLogin(false);
                  }
                  }
                  style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * 0.04
                    }${props.plateSize.slice(-2)}`,
                  }}
                  className="signupBtn"
                >
                  Signup
                </button>
                <button
                  id="loginBtn"
                  style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * 0.04
                    }${props.plateSize.slice(-2)}`,
                  }}
                >
                  LOGIN
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {openSignup && (
        <div id="loginMask">
          <div
            id="outerBox"
            style={{
              width: `${
                parseFloat(props.plateSize) * 0.6
              }${props.plateSize.slice(-2)}`,
              height: `${
                parseFloat(props.plateSize) * 0.8
              }${props.plateSize.slice(-2)}`,
            }}
          >
            <div id="innerBox">
              <button id="closeBtn" onClick={() => setOpenSingup(false)}>
                <hr
                  id="closeLine"
                  style={{
                    border: `${
                      parseFloat(props.plateSize) * 0.005
                    }${props.plateSize.slice(-2)} solid white`,
                  }}
                ></hr>
              </button>
              <h1
                id="loginTitle"
                style={{
                  fontFamily: "Inria Sans",
                  fontSize: `${
                    parseFloat(props.plateSize) * 0.04
                  }${props.plateSize.slice(-2)}`,
                  marginTop:'10%'
                }}
              >
                Signu<span style={{ letterSpacing: 0 }}>p</span>
              </h1>
              <form className="signupInfo" style={{marginTop:"8%"}} onSubmit = {submitSignup}>
              <div style={singupColumn}>
                <h2
                    className="accText"
                    style={{
                      fontSize: `${
                        parseFloat(props.plateSize) * 0.035
                      }${props.plateSize.slice(-2)}`,
                    }}
                  >
                    Title
                  </h2>
                  <select name="title" className="inputArea"                   style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * 0.02
                    }${props.plateSize.slice(-2)}`,
                  }}>
                    <option value="" disabled>Please choose your title</option>
                    <option value="MOE" disabled>MOE (Contact the admin)</option>
                    <option value="cooker">Cooker</option>
                    <option value="student">Student</option>
                </select>
                </div>
                <div style={singupColumn}>
                <h2
                    className="accText"
                    style={{
                      fontSize: `${
                        parseFloat(props.plateSize) * 0.035
                      }${props.plateSize.slice(-2)}`,
                    }}
                  >
                    Name
                  </h2>
                  <input
                  id="accSignup"
                  className="inputArea"
                  name="name"
                  style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * inputFontSize
                    }${props.plateSize.slice(-2)}`,
                  }}
                ></input>
                </div>
                <div style={singupColumn}>
                <h2
                  className="accText"
                  style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * 0.035
                    }${props.plateSize.slice(-2)}`,
                    letterSpacing:"0.1rem"
                  }}
                >
                  Email
                </h2>
                <input
                  id="emailInput"
                  className="inputArea"
                  name="email"
                  style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * inputFontSize
                    }${props.plateSize.slice(-2)}`,
                  }}
                ></input>
                </div>
                <div style={singupColumn}>
                <h2
                  className="accText"
                  style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * 0.035
                    }${props.plateSize.slice(-2)}`,
                    letterSpacing:"0.1rem"
                  }}
                >
                  Password
                </h2>
                <input
                  type="password"
                  id="pwdSignup"
                  className="inputArea"
                  name="pwd"
                  style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * inputFontSize
                    }${props.plateSize.slice(-2)}`,
                  }}
                ></input>
                </div>
                <div style={singupColumn}>
                <h2
                  className="accText"
                  style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * 0.035
                    }${props.plateSize.slice(-2)}`,
                    letterSpacing:"0.1rem"
                  }}
                >
                  School
                </h2>
                <input
                  id="schoolSignup"
                  className="inputArea"
                  name="school"
                  style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * inputFontSize
                    }${props.plateSize.slice(-2)}`,
                  }}
                ></input>
                </div>
                <button
                type="submit"
                  style={{
                    fontSize: `${
                      parseFloat(props.plateSize) * 0.04
                    }${props.plateSize.slice(-2)}`,
                  }}
                  className="signupBtn"
                  id = "joinBtn"
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
