import React from "react";
import SizeHelper from "../Utils/utils.js"


function SchoolSelection(props) {

    const mySize = new SizeHelper(props.size);
    
    return(
        <select name="school" id="schoolSelect" className={props.cl} style={props.st} onChange={(event)=>props.setSchool(event.target.value)}>
            <option value="Aimeliik">Aimeliik</option>
            <option value="Airai">Airai</option>
            <option value="Angaur">Angaur</option>
            <option value="GB Harris">GB Harris</option>
            <option value="Ibobang">Ibobang</option>
            <option value="JFK">JFK</option>
            <option value="Koror">Koror</option>
            <option value="Melekeok">Melekeok</option>
            <option value="Meyuns">Meyuns</option>
            <option value="Ngaraard">Ngaraard</option>
            <option value="Ngarchelong">Ngarchelong</option>
            <option value="Ngardmau">Ngardmau</option>
            <option value="Ngeremlengui">Ngeremlengui</option>
            <option value="Palau High School">Palau High School</option>
            <option value="Peleliu">Peleliu</option>
        </select>
    )
}

export default SchoolSelection;