import React, { useEffect, useState } from "react";
const url = process.env.REACT_APP_BACKEND_URL;

function SchoolSelection(props) {
  const [schoolData, setSchoolData] = useState([{ name: "", id: "" }]);

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

  return (
    <select name='school' id='schoolSelect' className={props.cl} style={props.st} onChange={(event) => props.setSchool(event.target.value)}>
      {schoolData.map((school) => {
        return (
          <option key={school.id} value={school.id}>
            {school.name}
          </option>
        );
      })}
    </select>
  );
}

export default SchoolSelection;
