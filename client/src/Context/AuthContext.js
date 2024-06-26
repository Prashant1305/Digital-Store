import React, { createContext, useContext, useEffect, useState } from "react";
import { getAllClientData } from "../utils/ApiUtils";

const clientContext = createContext();

function AuthContext({ children }) {
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [clientData, setClientData] = useState();
  const [token, setToken] = useState();


  useEffect(() => {
    const fetchClientData = () => {
      if (isLogin) {
        // localStorage.setItem("token", JSON.stringify(res.data.token));
        const temp = JSON.parse(localStorage.getItem("token"));
        // console.log(temp)
        setToken(temp);
        getAllClientData(temp)
          .then((res) => {
            // console.log(res.data.msg);
            setClientData({ ...res.data.msg, method_of_payment: undefined, paid: undefined });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setToken();
        setClientData();
        localStorage.removeItem("token");
        if (isLogin) {
          setIsLogin(false); // if user put some random token local storage, that will be be handled by this condition
        }
      }
      // console.log("clientData fetched");
    };

    fetchClientData();
  }, [isLogin]);

  return (
    <clientContext.Provider value={{ isLogin, setIsLogin, clientData, token, setClientData }}>
      {children}
    </clientContext.Provider>
  );
}
export function MyLoginValues() {
  return useContext(clientContext);
}
export default AuthContext;
