import React, { useEffect, Fragment, useState } from "react";
import SizeHelper from "../Utils/utils.js"

const url = process.env.REACT_APP_BACKEND_URL;

function CategoryView(props) {

    const[foods,setFoods] = useState([]);
    const[curCategory, setCurCategory] = useState('');
    const[curFoods, setcurFoods] = useState([]);
    const[delBtn, setDelBtn] = useState('');

    const mySize = new SizeHelper(props.size);

    // produce a foods map = {categoryName : [foods:{_id,name,...},...]}
    useEffect(() => {

      let foodsBaseket = {};
      if(props.foodDB){
      props.foodDB.map((category) =>{
        foodsBaseket[category.name]=category.foods;
      })

      setFoods(foodsBaseket);
      setCurCategory(props.foodDB[0].name);
      }
    },[props.foodDB,setFoods])
    

    useEffect(() =>{
      if(curCategory !==''){
        setcurFoods(foods[curCategory]);
      }
    }, [curCategory,setcurFoods])
    


    // Create category API
    const addCategory = async(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const objData = Object.fromEntries(formData.entries())
        const jsonData = JSON.stringify(objData);
        

        const response = await fetch(`${url}api/v1/calendar/category`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: jsonData,
        });
    
        const data = await response.json();
        if (data.status === "success") {
            objData._id=data.categoryId;
            props.setCategories([...props.categories,objData]);
            e.target.reset();
        } else {
          alert(response.message);
        }
      }

    // Delete category API
    const delCategory = async (categoryId) => {
      
      if(!window.confirm("Are you sure to delete the category?")){
        return;
      }

      const response = await fetch(`${url}api/v1/calendar/category/${categoryId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response;
      if (data.status === 204) {
        const updateCategories = props.categories.filter(item => item._id !== categoryId);
        props.setCategories(updateCategories);
        setCurCategory(updateCategories[0]._id);
      }
      else{
        alert('something wrong...')
      }

    }

    // Create food API
    const addItem = async(e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const objData = Object.fromEntries(formData.entries())
      const jsonData = JSON.stringify(objData);
 
      const response = await fetch(`${url}api/v1/calendar/foods/${curCategory}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: jsonData,
      });
  
      const data = await response.json();
      if (data.status === "success") {
        objData._id = data.foodId;
        setFoods([...foods,objData]);
        e.target.reset();
      } else {
        alert('Something wrong...');
      }
    }

    // Delete food API
    const delItem = async (foodId) => {
      if(!window.confirm("Are you sure to delete this food?")){
        return;
      }

      const response = await fetch(`${url}api/v1/calendar/foods/${foodId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response;
      if (data.status === 204) {
        const updateFoods = foods.filter(item => item._id !== foodId);
        setFoods(updateFoods);
      }
      else{
        alert('something wrong...')
      }
    }



    function getTextColor(hex) {
        // 將 HEX 顏色轉為 RGB
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);
    
        // 計算亮度 (YIQ公式)
        let brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
        // 如果亮度較低（較暗），使用白色字；否則使用黑色字
        return brightness < 128 ? "#ffffff" : "#000000";
      }


    return(
        <div className = 'categoryView' style={{width:"100%",display:"flex",justifyContent:"center",height:"20vh",marginTop:"3%",marginBottom:"-2%"}}>
            <div className = 'categoryView' id='view' >
                <div  className = 'categoryView' id = 'categoryList' >
                    {
                        props.foodDB && props.foodDB.map((category) =>(
                            <Fragment key={category._id}>
   
                            <button className="categoryView categories" style={{backgroundColor:category.color, color:getTextColor(category.color), fontSize:mySize.adjust(0.02), boxShadow:(category.name === curCategory)?'rgb(255 188 0) -2px 0px 14px 3px':''}} onMouseEnter={()=>setDelBtn(category._id)} onMouseLeave={()=>setDelBtn('')} onClick={()=>setCurCategory(category.name)}>                       
                                { delBtn === category._id && 
                              <button className="categoryView delBtn" id={category._id} onClick={()=>delCategory(category._id)} style={{width:mySize.adjust((0.025))}}> X </button>
                                }
                            {category.name} 
                            </button>
                            </Fragment>
                        ))
                    }
                    <form className="categoryView" id='addCategory' onSubmit={addCategory}>
                        <input type='color' className="categoryView" id='inputColor' style={{width:mySize.adjust(0.03),height:mySize.adjust(0.035)}} name='color'></input>
                        <input type='text' className="categoryView" 
                        id='inputCategory' placeholder="+ new category" style={{fontSize:mySize.adjust(0.02)}} name='name'></input>
                    </form>
                </div>
                <div className = 'categoryView' id = 'itemList'>
                  {
                    curFoods && curFoods.map((item) =>(
                      <Fragment key={item._id}>

                      <button className="categoryView item" id='item_1' style={{fontSize:mySize.adjust(0.02)}} onMouseEnter={()=>setDelBtn(item._id)} onMouseLeave={()=>setDelBtn('')}>          
                      { delBtn === item._id && 
                          <button className="categoryView delBtn" style={{width:mySize.adjust((0.025)),    backgroundColor: "white",
                            color:"black"}} id={item._id}  onClick={()=>delItem(item._id)}> X </button>
                      }
                      {item.name} 
                      </button>
                      </Fragment>
                  ))
                  }
                    <form className="categoryView" id='addItem' onSubmit={addItem}>
                        <input type='text' className="categoryView" 
                        id='inputItem' placeholder="+ new item" style={{fontSize:mySize.adjust(0.02)}} name='name'></input>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CategoryView;