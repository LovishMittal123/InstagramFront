import React from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter ,Route,Routes} from 'react-router-dom'
import Layout from './components/Layout'
import Feed from './components/Feed'
import Profile from './components/Profile'
import Signup from './components/Signup'
import { Provider, useSelector } from 'react-redux'
import appStore from './utils/appStore'
import Login from './components/Login'
import CreatePost from './components/CreatePost'
import Suggestions from './components/Suggestions'
import Requests from './components/Requests'
import Connections from './components/Connections'
import EditProfile from './components/EditProfile'

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
