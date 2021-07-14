import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(undefined);

  async function getLoggedIn() {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/auth/loggedin`
    );
    setLoggedIn(res.data);
  }

  useEffect(() => {
    getLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, getLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
