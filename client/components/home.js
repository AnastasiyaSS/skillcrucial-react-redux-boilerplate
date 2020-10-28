import React /* , { useState } */ from 'react'
// import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Head from './head'
import Header from './header'
import Dashboard from './dashboard'
import Main from './main'
import Profile from './profile'
import Counter from './counter'
// import wave from '../assets/images/wave.jpg'

const Home = () => {
  return (
    <div>
      <Head title="Hello" />
      <Header />
        <Switch>
          <Route exact path="/dashboard" component={() => <Dashboard />} />
          <Route exact path="/dashboard/main" component={() => <Main />} />
          <Route exact path="/dashboard/profile/:user" component={() => <Profile />} />
          <Route exact path="/counter" component={() => <Counter />} />          
        </Switch>
    </div>
  )
}

Home.propTypes = {}

export default Home

/*   const [counter, setCounterNew] = useState(0)
      <img alt="wave" src="images/wave.jpg" />  

      <button type="button" onClick={() => setCounterNew(counter + 1)}>
        updateCounter
      </button>
      <div> Hello World Dashboard {counter} </div> 

*/