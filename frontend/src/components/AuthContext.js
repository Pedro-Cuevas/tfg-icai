import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  useEffect(() => {
    // This useEffect will run only once, when the component is mounted
    const token = localStorage.getItem("access_token");
    const savedUsername = localStorage.getItem("username");
    if (token && savedUsername) {
      setCurrentUser(savedUsername);
    }
  }, []);

  const [currentUser, setCurrentUser] = useState(null);

  const setAuthDetails = (user, tokens) => {
    setCurrentUser(user);
    localStorage.setItem("username", user); // save username
    localStorage.setItem("access_token", tokens.access); // save access token
    localStorage.setItem("refresh_token", tokens.refresh); // save refresh token
  };

  const logout = () => {
    setCurrentUser(null); // This clears the current user
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  const handleLogout = (e) => {
    e.preventDefault(); // prevent default behavior
    e.stopPropagation(); // stop event propagation

    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setAuthDetails,
        setCurrentUser,
        logout,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
