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

const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<UserProvider><App /></UserProvider>}/>
        <Route path="/posts" element={<UserProvider><Posts /></UserProvider>} />
        <Route path="/post/:id" element={<UserProvider><OnePost /></UserProvider>} />
        <Route path="/writeapost" element={<UserProvider><WriteAPost /></UserProvider>} />
        <Route path="/writeapost/:id" element={<UserProvider><WriteAPost /></UserProvider>} />
        <Route path="/calendar" element={<UserProvider><Calendar /></UserProvider>} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
//
