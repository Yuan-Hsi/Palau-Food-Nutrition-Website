import React, { useEffect, useState } from "react";
import SchoolSelection from "../Utils/SchoolSelection.js";
import { useUser } from "../Utils/UserContext.js";
import SizeHelper from "../Utils/utils.js";
import "./FormAccess.css";

const url = process.env.REACT_APP_BACKEND_URL;

function FormAccess(props) {
  const [school, setSchool] = useState("67e63350944e3010a95752b5");
  const mySize = new SizeHelper(props.size);
  const { user } = useUser();

  const redirection = async (e) => {
    e.preventDefault();
    const jsonData = JSON.stringify({ _id: school });
    const response = await fetch(`${url}api/v1/user/formAccess/${props.formType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonData,
      credentials: "include",
    });

    const res = await response.json();
    if (res.status === "success") {
      window.open(res.url);
    } else {
      alert("You seems not authorizing to access, please contact the admin.");
    }
  };

  return (
    <div className='formAccess' id='formMask'>
      <form className='formAccess' id='background' onSubmit={redirection}>
        <button type='button' className='formAccess' id='closeBtn' onClick={() => props.setAccess(false)}></button>
        <h1 className='formAccess' style={{ fontSize: mySize.adjust(0.04) }}>
          Your School:
        </h1>
        <div style={{ display: "flex", width: "100%", height: "25%", justifyContent: "center", alignItems: "center" }}>
          <SchoolSelection cl='formAccess' size={props.size} setSchool={setSchool} />
          <button type='submit' className='formAccess' id='submitBtn' style={{ fontSize: mySize.adjust(0.045) }}>
            ➭
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormAccess;
