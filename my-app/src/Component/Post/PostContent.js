import React, { useEffect, Fragment, useState } from "react";
import SizeHelper from "../Utils/utils.js"
import "./PostContent.css"
import {transformDate} from "../Utils/utils.js"
import he from "he";
import { useUser } from "../Utils/UserContext.js";

const url = process.env.REACT_APP_BACKEND_URL;


function PostContent(props) {
    const onePost = props.post;
    const mySize = new SizeHelper(props.size);
    const contentHTML = onePost.content ? he.decode(onePost.content) : '';
    const { user } = useUser();
    // 使用 useState 來管理勾選框的狀態
    const [check, setCheck] = useState(false);


    // 使用 useEffect 來監聽 onePost 的變化
    useEffect(() => {
        if (onePost) {
            setCheck(onePost.setNotice ? true : false); // 在 onePost 加載完成後賦值
        }
    }, [onePost]); // 依賴於 onePost

    const handleCheckboxChange = async () => {
        
        const response = await fetch(`${url}api/v1/post/${props.post._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({setNotice: !check}),
            credentials: "include",
        });

        const data = await response.json();
        if (data.status === "success") {
            console.log('finish make it ' + (check ? "not announce" : "announce"));
            setCheck(!check); // 切換勾選框的狀態
        } else {
            alert(data.message);
        }

    };

    return(
        <div id='postColumn' >
            {user.title==='admin' && 
            <div style={{display:"flex",justifyContent:"center",width:"100%"}}> 
                <label className="container" style={{fontSize: mySize.adjust(0.02),paddingLeft:"3.5%",fontWeight:"bold" }}>Announcement
                {check && <input type="checkbox" checked="false" onChange={()=>{}} onClick={() => handleCheckboxChange()}/>}
                {!check && <input type="checkbox" onClick={() => handleCheckboxChange()} onChange={()=>{}}/>}
                    <span className="checkmark" style={{width: mySize.adjust(0.02),height:mySize.adjust(0.02),'--checkmark-width': mySize.adjust(0.004),'--checkmark-height': mySize.adjust(0.009)}}></span>
                </label>
            </div>
            }
            <h1 id='postTitle' style={{fontSize: mySize.adjust(0.07)}} > {onePost.title} </h1>
            <div style={{display:"flex",alignItems:"center",marginTop:"2%",justifyContent:"center"}}>
                <p id='postDate' style={{fontSize: mySize.adjust(0.02)}} > {transformDate(onePost.timestamp)} </p>
                {onePost.author && onePost.author[0]._id === user.id && 
                <button id='editBtn' className="onePost" style={{width:"3%",height:"3%"}} onClick={props.editFunction}> ✎ </button>}
            </div>
            <div id='postContent' style={{fontSize: mySize.adjust(0.03)}} dangerouslySetInnerHTML={{ __html: contentHTML }} />
        </div>
    )
}

export default PostContent;