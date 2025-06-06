import React, { useEffect, Fragment, useState, useRef } from "react";
import SizeHelper from "../Utils/utils.js";
import { produce } from "immer";
import { useUser } from "../Utils/UserContext.js";

const url = process.env.REACT_APP_BACKEND_URL;

function DayCalendar(props) {
  const [addItem, setAddItem] = useState(false);
  const [showFoods, setShowFoods] = useState({});
  const [showList, setShowList] = useState(false);
  const [theDate, setTheDate] = useState("");
  const [delBtn, setDelBtn] = useState({ foodId: "", date: "", listIdx: "" });
  const [preferenceBtn, setpreferenceBtn] = useState({ foodId: "", date: "", listIdx: "" });
  const mySize = new SizeHelper(props.size);
  const { user } = useUser();

  // auto floatwindow position
  const listRef = useRef(null);
  const [listPosition, setListPosition] = useState("left");

  useEffect(() => {
    function autoPosition() {
      if (listRef.current && showList) {
        const rect = listRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;

        if (listPosition === "right") {
          return 0;
        }

        if (rect.right > windowWidth) {
          setListPosition("right");
          return 0;
        }

        setListPosition("left");
      }
    }

    autoPosition();
  }, [showList, listPosition]);

  useEffect(() => {
    const d = props.date < 10 ? "0" + props.date : props.date;
    const m = props.month < 10 ? "0" + props.month : props.month;
    setTheDate(`${props.year}-${m}-${d}`);
  }, [props.year, props.month, props.date]);

  useEffect(() => {}, []);

  function clickCategory(categoryName) {
    if (showFoods[categoryName]) {
      setShowFoods((pre) => {
        const state = { ...pre };
        state[categoryName] = undefined;
        return state;
      });
    } else {
      const updateFoods = props.foods[categoryName];
      setShowFoods((pre) => ({
        ...pre,
        [categoryName]: updateFoods,
      }));
    }
  }

  // auto tuning text color
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

  const addCalendar = async (foodId, categoryId, foodName) => {
    if (props.calendarDB[theDate] === undefined || props.calendarDB[theDate].foods.length === 0) {
      // create the day

      const jsonData = JSON.stringify({ schoolType: props.school, date: theDate, foods: [foodId] });

      const response = await fetch(`${url}api/v1/calendar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: jsonData,
      });

      const data = await response.json();

      if (data.status === "success") {
        props.setCalendarDB(
          produce((prevCalendarDB) => {
            prevCalendarDB[theDate] = {
              foods: [{ _id: foodId, name: foodName, category_id: categoryId }],
              _id: data.update._id,
            };
          }),
        );
      } else {
        alert("Something wrong... in addCalendar");
      }
    } else {
      // update the day

      const foodsBaseket = props.calendarDB[theDate].foods.map((food) => food._id);
      foodsBaseket.push(foodId);
      const jsonData = JSON.stringify({ foods: foodsBaseket });
      const response = await fetch(`${url}api/v1/calendar/${props.calendarDB[theDate]._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: jsonData,
      });
      const data = await response.json();

      if (data.status === "success") {
        props.setCalendarDB(
          produce((prevCalendarDB) => {
            prevCalendarDB[theDate] = {
              foods: [...prevCalendarDB[theDate].foods, { _id: foodId, name: foodName, category_id: categoryId }],
              _id: data.update._id,
            };
          }),
        );
      } else {
        alert("Something wrong... in addCalendar");
      }
    }
  };

  const deleteMeal = async (idx) => {
    // the same as update the day
    const foodsBaseket = [...props.calendarDB[theDate].foods];
    foodsBaseket.splice(idx, 1); // remove that
    const update = foodsBaseket.map((food) => food._id);

    let response;

    if (update.length === 0) {
      // remove 整個 date
      response = await fetch(`${url}api/v1/calendar/?schoolType=${props.school}&date=${theDate}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    } else {
      const jsonData = JSON.stringify({ foods: update });
      response = await fetch(`${url}api/v1/calendar/${props.calendarDB[theDate]._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: jsonData,
      });
    }

    const data = await response;
    if (data.status === 204 || data.status === 200) {
      props.setCalendarDB(
        produce((prevCalendarDB) => {
          prevCalendarDB[theDate] = {
            foods: foodsBaseket,
            _id: props.calendarDB[theDate]._id,
          };
        }),
      );
    } else {
      alert("Something wrong... in deleteMeal");
    }
  };

  const updatePreference = async (preference) => {
    // preference = {favorite: name) or {dislike: name}

    let update;
    let jsonData;

    // update favorite
    if (preference.favorite) {
      if (props.favorite.includes(preference.favorite)) {
        update = props.favorite.filter((name) => name !== preference.favorite);
        props.setFavorite(update);
      } else {
        update = [...props.favorite, preference.favorite];
        props.setFavorite(update);
      }
      jsonData = JSON.stringify({ favorite: update });
    }

    // updat dislike
    if (preference.dislike) {
      if (props.dislike.includes(preference.dislike)) {
        update = props.dislike.filter((name) => name !== preference.dislike);
        props.setDislike(update);
      } else {
        update = [...props.dislike, preference.dislike];
        props.setDislike(update);
      }
      jsonData = JSON.stringify({ dislike: update });
    }

    // using put function of user route
    const response = await fetch(`${url}api/v1/user/updateMe`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: jsonData,
    });
    const data = await response.json();

    if (data.status === "success") {
    } else {
      alert("Something wrong... in updatePreference");
    }
  };

  function hoverOnMeal(foodId, date, listIdx) {
    setDelBtn({ foodId, date, listIdx });
    setpreferenceBtn({ foodId, date, listIdx });
  }

  return (
    <td className='foodCalendar' onMouseEnter={() => setAddItem(true)} onMouseLeave={() => setAddItem(false)} style={{ verticalAlign: "top" }}>
      <div style={{ position: "relative", paddingTop: "10px" }}>
        <div id='date' style={{ textAlign: "right" }}>
          {props.date}{" "}
        </div>
        {props.date !== "" && (
          <Fragment>
            <div>
              {props.calendarDB[theDate] !== undefined &&
                props.calendarDB[theDate].foods.map((food, idx) => (
                  <Fragment>
                    {/* Meal item */}
                    <div
                      style={{ display: "flex", alignItems: "center", marginBottom: "3%" }}
                      onMouseEnter={() => hoverOnMeal(food._id, theDate, idx)}
                      onMouseLeave={() => {
                        setDelBtn("");
                        setpreferenceBtn("");
                      }}
                    >
                      {/* Preference button  */}
                      {user.title && props.mode === "view" && preferenceBtn.date === theDate && preferenceBtn.listIdx === idx && food.category_id !== "67dd6acc1a713300eb4b4ef9" && (
                        <div style={{ display: "flex", position: "absolute", zIndex: 10, right: -50 }}>
                          <button
                            id='like'
                            className='dayCalendar preferBtn'
                            onClick={() => updatePreference({ favorite: food.name })}
                            disabled={props.dislike.includes(food.name)}
                            style={{ boxShadow: props.favorite.includes(food.name) ? "inset 1px 2px #999" : "" }}
                          >
                            ❤️
                          </button>
                          <button
                            id='dislike'
                            className='dayCalendar preferBtn'
                            onClick={() => updatePreference({ dislike: food.name })}
                            disabled={props.favorite.includes(food.name)}
                            style={{ boxShadow: props.dislike.includes(food.name) ? "inset 2px 2px 5px rgba(255, 255, 255, 0.83)" : "" }}
                          >
                            {" "}
                            💔{" "}
                          </button>
                        </div>
                      )}

                      {/* Category color icon */}
                      <div style={{ minWidth: "15px", marginRight: "3%" }}>
                        {props.mode === "view" && props.favorite && props.favorite.includes(food.name) && <p>❤️</p>}
                        {props.mode === "view" && props.dislike && props.dislike.includes(food.name) && <p>💔</p>}
                        {props.mode === "edit" && (
                          <input type='color' id='inputColor' className='categoryView' disabled value={props.colors[food.category_id]} style={{ width: "100%", height: "20px" }}></input>
                        )}
                      </div>

                      {/* Meal name */}
                      <p className='dayCalendar foodName' key={food._id} title={food.name} style={{ color: food.category_id === "67dd6acc1a713300eb4b4ef9" ? "rgb(201, 44, 219)" : "black" }}>
                        {food.name}
                      </p>

                      {/* Delete button */}
                      {props.mode === "edit" && delBtn.date === theDate && delBtn.listIdx === idx && (
                        <div style={{ minWidth: "20px" }}>
                          <button className='dayCalendar delBtn' id={food._id} onClick={() => deleteMeal(idx)} style={{ width: "20px" }}>
                            X
                          </button>
                        </div>
                      )}
                    </div>
                  </Fragment>
                ))}
              {props.mode === "edit" && addItem && (
                <button className='foodCalendar' style={{ zIndex: 3 }} id='addFood' onClick={() => setShowList(true)}>
                  add food
                </button>
              )}
            </div>

            {/* Food selection list */}
            {showList && (
              <div
                className='foodCalendar'
                id='foodList'
                onMouseLeave={() => setShowList(false)}
                ref={listRef}
                style={{
                  right: listPosition === "right" ? "0" : "auto",
                  left: listPosition === "left" ? "0" : "auto",
                }}
              >
                {props.foodDB.map((category) => (
                  <Fragment key={category._id}>
                    {/* Category selection */}
                    <button
                      className='foodCalendar foodList category'
                      style={{ backgroundColor: category.color, color: getTextColor(category.color) }}
                      onClick={() => clickCategory(category.name)}
                      key={category._id}
                    >
                      {category.name}{" "}
                    </button>

                    {/* Food selection */}
                    {showFoods[category.name] &&
                      showFoods[category.name].map((item) => (
                        <button className='foodCalendar foodList food' key={item._id} onClick={() => addCalendar(item._id, category._id, item.name)}>
                          {item.name}
                        </button>
                      ))}
                  </Fragment>
                ))}
              </div>
            )}
          </Fragment>
        )}
      </div>
    </td>
  );
}

export default DayCalendar;
