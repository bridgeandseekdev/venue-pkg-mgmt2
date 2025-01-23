
import React, { createContext, useContext, useState } from 'react';



interface AuthContextType {
  auth: AuthType | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthType | null>>;
}

interface AuthType {
  // Define the properties of the auth object here
  userId: string;
  token: string;
}

const AuthContext = createContext<AuthContextType | null>(null);



export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState<AuthType | null>(null);



  return (

    <AuthContext.Provider value={{ auth, setAuth }}>

      {children}

    </AuthContext.Provider>

  );

};



export const useAuth = () => useContext(AuthContext);
