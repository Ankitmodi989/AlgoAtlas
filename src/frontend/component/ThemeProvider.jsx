import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
    const [dark, setDark] = useState(true);

    useEffect(()=>{
        if(dark)
          document.documentElement.setAttribute("data-theme","dark")
        else
          document.documentElement.setAttribute("data-theme","")
        },[dark]);

    return(
        <ThemeContext.Provider value={{dark,setDark}}>
            {children}
        </ThemeContext.Provider>

    );
}