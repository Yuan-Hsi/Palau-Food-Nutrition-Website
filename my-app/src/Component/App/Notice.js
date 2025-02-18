import React, { Fragment, useEffect, useState } from "react";
import "./Notice.css";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function Notice(props) {
  // Notice close
  const [closeNotice, setCloseNotice] = useState(false);
  const [openNotice, setOpenNotice] = useState(true);

  useEffect(() => {
    const handleClick = () => {
      setOpenNotice((prevOpenNotice) => {
        // 利用函數式更新來讓 openNotice 到最新的值
        if (prevOpenNotice) {
          // 如果 openNotice 是 true，則關閉它
          return false;
        } else {
          // 如果 openNotice 已經是 false，則關閉 closeNotice
          setCloseNotice(true);
          return false; // 確保 openNotice 仍然是 false
        }
      });
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  // Notice content
  // Date
  const time_stamp = [1737605433150, 1737605433150]; // 透過 Date.now() 拿
  const dayArr = [];
  const monthArr = [];
  time_stamp.map((item) => {
    const time = new Date();
    time.setTime(item); // 轉成標準 Thu Jan 23 2025 13:10:33 GMT+0900 (Palau Time)
    dayArr.push(time.getDate());
    monthArr.push(months[time.getMonth()]);
  });
  // Title
  const titelArr = ["Title", "Title"];
  // context
  const contextArr = [
    "Lorem ipsum dolor sit amet consectetur. Mauris quam sed euismod sed maecenas amet euismod. Facilisi dui erat ut velit facilisis facilisi. Justo urna amet sit amet faucibus. Enim eget integer tempor pharetra.",
    "Lorem ipsum dolor sit amet consectetur. Mauris quam sed euismod sed maecenas amet euismod. Facilisi dui erat ut velit facilisis facilisi. Justo urna amet sit amet faucibus. Enim eget integer tempor pharetra.",
  ];

  return (
    <Fragment>
      {!closeNotice && (
        <div
          id="noticeBack"
          style={{
            width: `${
              parseFloat(props.plateSize) * 0.65
            }${props.plateSize.slice(-2)}`, // slice 的部分是看 vw 還是 vh
            height: `${
              parseFloat(props.plateSize) * 0.9
            }${props.plateSize.slice(-2)}`,
            backgroundColor: "white",
            position: "fixed",
            zIndex: 50,
            borderRadius: "5%",
            boxShadow: "8px 5px 20.6px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="content" style={{ overflow: "auto", height: "100%" }}>
            {dayArr.map(
              (
                item,
                idx // 注意這邊的匿名函數是用 () 而不是 {}!!!!
              ) => (
                <>
                  <h1
                    className="contentDate"
                    style={{
                      fontSize: `${
                        parseFloat(props.plateSize) * 0.055
                      }${props.plateSize.slice(-2)}`,
                    }}
                  >
                    {item + " " + monthArr[idx]}
                  </h1>
                  <h1
                    className="contentTitle"
                    style={{
                      fontSize: `${
                        parseFloat(props.plateSize) * 0.055
                      }${props.plateSize.slice(-2)}`,
                    }}
                  >
                    {titelArr[idx]}
                  </h1>
                  <p
                    className="contentText"
                    style={{
                      fontSize: `${
                        parseFloat(props.plateSize) * 0.035
                      }${props.plateSize.slice(-2)}`,
                    }}
                  >
                    {contextArr[idx]}
                  </p>
                </>
              )
            )}
          </div>
          {openNotice && (
            <div
              id="noticeCover"
              style={{
                position: "absolute",
                bottom: "0",
                width: "100%",
                height: "85%",
                background:
                  "linear-gradient(#FFFFFF 15%, #0099ff 37%,#0099ff 45% , #FFFFFF 86%)",
                borderRadius: "5%",
                boxShadow: "1px -3px 15.5px rgba(0, 0, 0, 0.25)",
                transition: "0.5s",
              }}
            >
              <h1
                style={{
                  fontFamily: "Metal",
                  fontSize: `${
                    parseFloat(props.plateSize) * 0.14
                  }${props.plateSize.slice(-2)}`,
                  letterSpacing: "0.15em",
                  marginTop: "30%",
                  textAlign: "center",
                  color: "#FFFF00",
                }}
              >
                NOTIC<span style={{ letterSpacing: 0 }}>E</span>
              </h1>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
}

export default Notice;
