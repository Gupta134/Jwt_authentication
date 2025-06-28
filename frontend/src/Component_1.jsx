import React, { useContext } from 'react'
import { Mycontext } from './Context/CounterContext'
import ComponentAnother from './Component_2'


const ChildComponent = () => {
  const{increment,decrement,value}=useContext(Mycontext)
  console.log(increment)
  return (
    <>
    <span>{value}</span>
     <div className='flex flex-col'>
      <button type='button' onClick={increment}>Increment</button>
     
       <button type='button' onClick={decrement}>Decrement</button>
    </div>

    <ComponentAnother/>
    </>
   
  )
}

export default ChildComponent