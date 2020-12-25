import React, { useEffect, useState, useReducer } from 'react'

const initialState = {
  user1: {},
  user2: {}
}

const reducerFunc = (acc, rec) => {
  switch (rec.type) {
    case 'UPDATE_USER': {
      return { ...acc, [`user${rec.userIndex}`]: rec.user }
    }
    default:
      return acc
  }
}

const Root = () => {
  const [store, dispatch] = useReducer(reducerFunc, initialState)

  const [userData, setUserData] = useState(initialState)
  useEffect(() => {
    setTimeout(() => {
      console.log(1000, userData)

      setUserData({ ...userData, user1: { name: 'vasya' } })
      dispatch({ type: 'UPDATE_USER', userIndex: 1, user: { name: 'vasya' } })
    }, 1000)

    setTimeout(() => {
      console.log(1200, userData)
      setUserData({ ...userData, user2: { name: 'petr' } })
      dispatch({ type: 'UPDATE_USER', userIndex: 2, user: { name: 'petr' } })
    }, 2000)
  }, [])
  return (
    <div>
      {userData.user1.name}
      {userData.user2.name}
      __________
      <div>{store.user1.name}</div>
      <div>{store.user2.name}</div>
    </div>
  )
}

export default Root
