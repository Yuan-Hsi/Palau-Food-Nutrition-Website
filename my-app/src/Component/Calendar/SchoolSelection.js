import React, { useEffect, useState } from "react";
import SizeHelper from "../Utils/utils.js";

const url = process.env.REACT_APP_BACKEND_URL;

function SchoolSelection(props) {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const getSchools = async () => {
      const response = await fetch(`${url}api/v1/school?sort=school`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const res = await response.json();
      if (res.status === "success") {
        const schoolArr = res.data.schools.map((item) => item.school);
        setSchools(schoolArr);
      } else {
        console.log("Something wrong... in getSchools");
      }
    };

    getSchools();
  }, []);

  return (
    <select name='school' id='schoolSelect' className={props.cl} style={props.st} onChange={(event) => props.setSchool(event.target.value)}>
      {schools.map((school, index) => {
        return (
          <option key={index} value={school}>
            {school}
          </option>
        );
      })}
    </select>
  );
}

export default SchoolSelection;
