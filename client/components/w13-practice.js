import React, {useState, useEffect} from 'react'

const Root = () => {

  const [userData, setUserData] = useState({
    user1: {},
    user2: {}
  })
  useEffect(() => {
    setTimeout(() => {
      console.log(1000, userData)

      setUserData({ ...userData, user1: {name: 'Vasya'} })
    }, 1000)

    setTimeout(() => {
      console.log(1200, userData)

      setUserData({ ...userData, user1: { name: 'Peter' } })
    }, 1200)
  }, [])
  return (
    <div>
      {userData.user1.name}
      {userData.user1.name}
    </div>
  )
}


export default Root