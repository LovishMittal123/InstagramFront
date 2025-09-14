import React from 'react'
import Navbar from './Navbar'
import { BrowserRouter ,Route,Routes} from 'react-router-dom'
import Layout from './Layout'
import Feed from './Feed'
import Profile from './Profile'
import Signup from './Signup'
import { Provider, useSelector } from 'react-redux'
import appStore from './utils/appStore'
import Login from './Login'
import CreatePost from './CreatePost'
import Suggestions from './Suggestions'
import Requests from './Requests'
import Connections from './Connections'
import EditProfile from './EditProfile'

const App = () => {
  
  return (
    <div>
      <Provider store={appStore}>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
        <Route path='/' element={<Feed/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/createpost' element={<CreatePost/>}/>
        <Route path='/suggestions' element={<Suggestions/>}/>
        <Route path='/editProfile' element={<EditProfile/>}/>
        <Route path='/connections' element={<Connections/>}/>
        <Route path='/requests' element={<Requests/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>

        </Route>
      </Routes>
      </BrowserRouter>
      </Provider>
    </div>
  )
}

export default App
