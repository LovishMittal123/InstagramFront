import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from './utils/constants'
import { addUser } from './utils/userSlice'
import axios from 'axios'

const Layout = () => {
    const user=useSelector(store=>store.user)
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const fetchUser=async()=>{
        try {
            if(user)return
            const res=await axios.get(BASE_URL+'/profile/view',{withCredentials:true})
            dispatch(addUser(res.data))
            
        } catch (error) {
            navigate('/login')
            console.log(error);
            
        }
    }
    useEffect(()=>{
        fetchUser()
    },[])
  return (
    <div>
     { user && <Navbar/>}
      <Outlet/>
    </div>
  )
}

export default Layout
