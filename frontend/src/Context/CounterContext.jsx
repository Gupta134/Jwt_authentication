
import React , {createContext , useState} from "react";

// Create A Context

const Mycontext= createContext();

// Make a provider function

const ContextProvider=({children})=>{
  const[value,setValue]=useState(0);

  const increment=()=>{
    setValue((prev)=>prev+1)
  }

    const decrement=()=>{
    setValue((prev)=>prev-1)
  }
  return(
    <Mycontext.Provider value={{increment,decrement,value}}>
      {children}

    </Mycontext.Provider>

  )
}

export  {Mycontext,ContextProvider}