import React, { useEffect, Fragment, useState } from "react";
import "./WritePostForm.css"
import SizeHelper from "../Utils/utils.js"
import Tiptap from "../Utils/Tiptap.js";
import { useUser } from "../Utils/UserContext.js";
import DOMPurify from "dompurify";


const centerStyle={
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
}

const url = process.env.REACT_APP_BACKEND_URL;

function WritePostForm(props) {

    const { user } = useUser();

    const mySize = new SizeHelper(props.size);

    const [cooker, setCooker] = useState(false);
    const [student, setStudent] = useState(false);
    const [content, setContent] = useState("");

    const sendPost = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const safeContent = DOMPurify.sanitize(content);
        
        const req = Object.assign(Object.fromEntries(formData.entries()), {timestamp:Date.now(), author:user.id,content:safeContent,forCooker:cooker,forStudent:student})
        const jsonData = JSON.stringify(req);
        
        if(!(cooker || student)){
            alert('You should specify who you post for.');
            return ;
        }

        const response = await fetch(`${url}api/v1/post`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: jsonData,
          credentials: "include",
        });

        const data = await response.json();
        if (data.status === "success") {
            console.log('success');
        } else {
          alert(data.message);
        }
        
      };
    
    return(
        <Fragment>
          <form id="WritePostForm" style={{flexDirection:"column",...centerStyle}} onSubmit={sendPost}>
            <div style={{width:"60%",...centerStyle,justifyContent:"flex-start"}}>
                <label className="leftLabel" style={{width:"20%",fontSize:mySize.adjust(0.03)}}>TITLE</label>
                <input name='title' id="titleBox" style={{fontSize: mySize.adjust(0.03)}} type="text">
                </input>
            </div>
            <div style={{width:"60%",marginTop:"3%",...centerStyle,justifyContent:"flex-start"}}>
                <label className="leftLabel" style={{width:"20%",fontSize:mySize.adjust(0.03)}}>FOR</label>
                <div style={{width:"78%",display:"flex",justifyContent:"space-evenly"}}>
                <input type='button' name='forCooker' class="forBtn" id="Cooker" style={{fontSize: mySize.adjust(0.03),backgroundColor:(cooker?"#FFDD31":"#efefef")}} value="Cooker"  onClick={()=>setCooker(!cooker)}> 
                </input>
                <input type='button' name='forStudent' class="forBtn" id="Student" style={{fontSize: mySize.adjust(0.03),backgroundColor:(student ?"#FFDD31":"#efefef")}} onClick={()=>setStudent(!student) } value="Student"> 
                </input>
                </div>
            </div>
            <div style={{marginTop:"5%",height:"100%",width:"100%",...centerStyle,flexDirection:"column"}}>
                <h1 id='contextLabel' style={{fontSize: mySize.adjust(0.04)}}>CONTEXT</h1>
                <Tiptap size={props.size}  setContent={setContent}/>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",width:"80%"}}>
                <button id='send' type="submit"  style={{fontSize: mySize.adjust(0.03)}}>Send</button> 
            </div>
            </form>
        </Fragment>
    )
}

export default WritePostForm;