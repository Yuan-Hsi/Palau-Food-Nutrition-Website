import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import App from "./Pages/App.js";
import Posts from "./Pages/Posts.js";
import OnePost from "./Pages/OnePost.js";
import WriteAPost from "./Pages/WriteAPost.js";
import Calendar from "./Pages/Calendar.js";
import { UserProvider } from "./Component/Utils/UserContext.js";
import { SizeProvider } from "./Component/Utils/SizeContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* prettier-ignore */}
    <Router>
      <Routes>
        <Route path="/" element={<UserProvider><SizeProvider><App /></SizeProvider></UserProvider>}/>
        <Route path="/:isNewUser" element={<UserProvider><SizeProvider><App /></SizeProvider></UserProvider>}/>
        <Route path="/posts" element={<UserProvider><SizeProvider><Posts /></SizeProvider></UserProvider>} />
        <Route path="/post/:id" element={<UserProvider><SizeProvider><OnePost /></SizeProvider></UserProvider>} />
        <Route path="/writeapost" element={<UserProvider><SizeProvider><WriteAPost /></SizeProvider></UserProvider>} />
        <Route path="/writeapost/:id" element={<UserProvider><SizeProvider><WriteAPost /></SizeProvider></UserProvider>} />
        <Route path="/calendar" element={<UserProvider><SizeProvider><Calendar /></SizeProvider></UserProvider>} />
      </Routes>
    </Router>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
//
