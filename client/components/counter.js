import React, { useState } from 'react'

const MAX_COUNTER = 10 

const CounterView = (props) => {  
  return <div>{props.counter}</div>  
}  
  
const ButtonPanel = (props) => {  
  const inc = () => {  
    props.setCounter(Math.min(props.counter + 1, MAX_COUNTER))  
  }  
    
  const dec = () => {  
    props.setCounter(Math.max(0, props.counter - 1))  
  }  
    
  const reset = () => {  
    props.setCounter(0)  
  }  
  return <div>  
    <button type="button" onClick={inc}>+</button>  
    <button type="button" onClick={dec}>-</button>  
    <button type="button" onClick={reset}>0</button>  
  </div>  
}  
  
const Counter = () => {  
  const [counter, setCounter] = useState(0)  
  
  return <div>  
    <CounterView counter={counter} />  
    <ButtonPanel setCounter={setCounter} counter={counter}  />  
  </div>  
} 

export default Counter
