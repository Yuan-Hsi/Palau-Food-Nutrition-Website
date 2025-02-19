import React, { useEffect, Fragment, useState } from "react";
import "./PostPreview.css"

const url = 'http://localhost:3005/'

function PostPreview(props) {
    const [posts, setPosts] = useState([1,2,3,4]);
    const [position, setPosition] = useState(['','','','']);
    const sizeAdjustment = ( scale ) => 
        parseFloat(props.size) * scale + props.size.slice(-2);
    
    // Get all post API
    useEffect(() => {
    async function getAllPost() {
        try {
          const response = await fetch(`${url}api/v1/post`, {
            method: "GET",
            credentials: "include" // 確保 cookie 會隨請求發送
          });
          
          const data = await response.json();
          if (data.status === "success") {
            console.log(data.data.posts);
            setPosts(data.data.posts);
          }
        } catch (error) {
          alert(error);
        }
      }
      getAllPost();
    }, []);

    // forWho function
    const forwho = function (post){
      if(post.forCooker && post.forStudent){
        return 'For All'
      }
      else if(post.forCooker){
        return 'For Cooker'
      }
      return 'For Student'
    }
    

    return(
        <div className = 'preSection' style={{margin:props.margin}}>
            {posts.map((post,idx) => {
                return (
                    <div className ='prePost'>
                    <img className="prePhoto" src='imageHolder.png' alt=""></img>
                    <div style={{width:"100%"}} >
                        <div className="preTitleSection" >
                        <h1 className="preTitle" style={{fontSize:sizeAdjustment(0.04)
                        }}> {post.title}</h1>
                        <div className="forWho"> <p style={{fontSize:sizeAdjustment(0.018), letterSpacing:"0.1em",overflow: 'hidden', textOverflow: 'clip',whiteSpace: "nowrap"}}> 
                          {forwho(post)} </p> </div>
                        </div>
                        <div className="preContext" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
                        <p style={{fontSize:sizeAdjustment(0.022), marginTop:"2%"}}> {post.content}</p>
                        </div>
                    </div>
                    <a href='#' className="forMore" style={{fontSize:sizeAdjustment(0.02), letterSpacing:"0.3em"}}>More...</a>
                </div>
                )
            })}
        </div>
    )
}

export default PostPreview;