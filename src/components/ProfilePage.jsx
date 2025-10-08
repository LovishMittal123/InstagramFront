import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnection } from '../utils/connectionSlice'
import { setSuggestions } from '../utils/suggestionsSlice'

const ProfilePage = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])


  const connections = useSelector(store => store.connection)
  const suggestions = useSelector(store => store.suggestions)
  const dispatch = useDispatch()

  // Update

  // Fetch user profile and posts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/${userId}`, {
          withCredentials: true
        })
        setUser(res.data.user)
        setPosts(res.data.posts)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUserProfile()
  }, [userId])

  if (!user) return <div className="text-center mt-10 text-gray-600">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img
            src={user.photoUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-600 mt-1">{user.about}</p>
            <p className="text-gray-500 text-sm mt-1">{user.gender}, {user.age} yrs</p>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <h3 className="text-lg font-semibold mb-3">Posts</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id} className="aspect-square">
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">No posts yet</p>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
