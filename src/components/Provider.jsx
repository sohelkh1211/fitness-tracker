import React, { useState } from 'react'
import { createContext } from 'react';

export const GlobalContext = createContext();

const Provider = ({ children }) => {
    const [profile, setProfile] = useState("Dashboard");
    // console.log("Provider component :- ",profile);
    return (
        <GlobalContext.Provider value={{ profile, setProfile }} >
            {children}
        </GlobalContext.Provider>
    )
}

export default Provider