import { createContext, useState, useContext, useEffect } from "react";

// 1. 建立 Context
const SizeContext = createContext(null);

// 2. Provider 負責管理 `user`
export const SizeProvider = ({ children }) => {
  // initialize UIsize
  const [size, setSize] = useState("90vh");
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    function updateSize() {
      if (window.innerWidth > window.innerHeight) {
        // 橫 > 直
        setSize("90vh");
      } // 直 > 橫
      else {
        setSize("90vw"); // 直向
        setIsVertical(true);
      }
    }

    updateSize();

    window.addEventListener("resize", updateSize);

    // 清理函數
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return <SizeContext.Provider value={{ size, isVertical }}>{children}</SizeContext.Provider>;
};

// 4. 自訂 hook 讓其他元件更容易取用 `user`
export const useSize = () => {
  return useContext(SizeContext);
};
