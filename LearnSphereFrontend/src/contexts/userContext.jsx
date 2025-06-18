import React, { createContext, useState } from 'react';

export const UserContext = createContext();


export const UserContextProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    const value = { 
        token,
        setToken,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};