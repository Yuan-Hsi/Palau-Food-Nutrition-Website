import React, { useEffect, useState, useRef } from "react";
import { useUser } from "./UserContext.js";

const url = process.env.REACT_APP_BACKEND_URL;

function SchoolSelection(props) {
  const [schoolData, setSchoolData] = useState([{ name: "", id: "" }]);
  const { user, setUser } = useUser();
  const [userSchool, setUserSchool] = useState(user.school);

  useEffect(() => {
    const getSchools = async () => {
      const response = await fetch(`${url}api/v1/school?sort=school`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const res = await response.json();
      if (res.status === "success") {
        const data = res.data.schools.map((item) => ({
          name: item.school,
          id: item._id,
        }));
        setSchoolData(data);
      } else {
        console.log("Something wrong... in getSchools");
      }
    };

    getSchools();
  }, []);

  useEffect(() => {
    if (schoolData.find((school) => school.name === user.school)) {
      setUserSchool(user.school);
    }
  }, [user, schoolData]);

  const sentSchool = (schoolName) => {
    setUserSchool(schoolName);
    const school = schoolData.find((school) => school.name === schoolName);
    props.setSchool(school.id);
  };

  return (
    <select name='school' id='schoolSelect' className={props.cl} style={props.st} value={userSchool || ""} onChange={(event) => sentSchool(event.target.value)}>
      {schoolData.map((school) => {
        return (
          <option key={school.id} value={school.name}>
            {school.name}
          </option>
        );
      })}
    </select>
  );
}

export default SchoolSelection;
