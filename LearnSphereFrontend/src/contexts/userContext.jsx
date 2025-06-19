import React, { createContext, useState } from 'react';

export const UserContext = createContext();


export const UserContextProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState({});
    const value = { 
        token,
        setToken,
        user,
        setUser
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};