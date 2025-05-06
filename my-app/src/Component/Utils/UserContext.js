import { createContext, useState, useContext, useEffect } from "react";

const url = process.env.REACT_APP_BACKEND_URL;

// 1. 建立 Context
const UserContext = createContext(null);

// 2. Provider 負責管理 `user`
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ name: "Login" });

  // 3. 在 useEffect 內部發 API 確保 `user` 狀態能保留
  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await fetch(`${url}api/v1/user/isLoggedin`, {
          method: "GET",
          credentials: "include", // 確保 cookie 會隨請求發送
        });

        const data = await response.json();
        if (data.status === "success") {
          setUser({ name: data.name, id: data._id, title: data.title, school: data.school }); // 設置用戶狀態
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    }

    checkLoginStatus();
  }, []); // 依賴陣列為空，表示只在組件掛載時執行一次

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

// 4. 自訂 hook 讓其他元件更容易取用 `user`
export const useUser = () => {
  return useContext(UserContext);
};
