import React, { useContext } from 'react'
import { Mycontext } from './Context/CounterContext'


const ComponentAnother = () => {
    const{increment,decrement}=useContext(Mycontext)
  return (
    <div className='flex flex-col space-y-3 mt-5 border bg-red-200'>
     <button type='button' className='border bg-red-600' onClick={increment}>Increment</button>
      <button type='button' onClick={decrement}>Decrement</button>
    </div>
  )
}

export default ComponentAnother