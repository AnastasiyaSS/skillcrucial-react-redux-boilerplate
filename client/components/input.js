import axios from 'axios'
import React, { useState, useEffect } from 'react'

const InputUserId = (props) => {
  const [value, setValue] = useState('1')
  const onChange = (event) => {
    // eslint-disable-next-line
    if (!isNaN(+event.target.value)) {
      const newValue = Math.min(Math.max(+event.target.value, 1), 10)
      setValue(newValue)
      props.onChange(newValue)
    }
  }
  return <div>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
  </div>
}

const User = () => {
  const [user, setUser] = useState({})
  const [toggled, setToggle] = useState(true)
  const [id, setId] = useState(1)

  const onInputChange = (nmb) => {
    setId(nmb)
  }

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/users/${id}`).then(it => {
      setUser(it.data)
    })
    return () => { }
  }, [id])

  return <div>
    <button type="button" onClick={
      () => {
        setToggle(!toggled)
      }
    }>Toggle</button>
    {id}
    {toggled && <InputUserId onChange={onInputChange} />}
    <div>{user.username}</div>
    <div>{user.email}</div>
    <div>{user.website}</div>
    <div>{user.phone}</div>
  </div>
}

export default User
