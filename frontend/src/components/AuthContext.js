import React, {createContext, useContext, useEffect, useState} from 'react';
import axiosInstance from "./axiosApi";
import {useNavigate} from "react-router-dom"

const AuthContext = createContext({
    auth: null,
    setAuth: () => {
    },
    loggedUser: null,
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(null);
    const [loggedUser, setLoggedUser] = useState(null)
    const navigate = useNavigate()
    const token = sessionStorage.getItem('access_token');
    const user_Id = sessionStorage.getItem('user_id');

  useEffect(() => {
    const isAuth = async () => {
      if (token) {
        try {
          const response = await axiosInstance.get(`/user/${user_Id}`);
          setLoggedUser(response.data);
          setAuth(true);
        } catch (error) {
          console.error(error);
          setAuth(false);
          navigate('/login');
        }
      } else {
        setAuth(false);
      }
    };

    isAuth();
  }, [token, user_Id]);
    return (
        <AuthContext.Provider value={{auth, setAuth, loggedUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;