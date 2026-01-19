import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

  const navigate = useNavigate()

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header (no cover banner) */}
      <div className="flex items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-5">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-sky-400 shadow-lg bg-white">
            <img src={user.photoUrl || 'https://via.placeholder.com/150'} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-slate-600 mt-1">{user.about || 'No bio available'}</p>
            <p className="text-xs text-slate-500 mt-1">{user.gender || ''}{user.gender && user.age ? ', ' : ''}{user.age ? `${user.age} yrs` : ''}</p>
          </div>
        </div>

    
      </div>

      {/* Posts Section */}
      <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Posts</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id} className="relative overflow-hidden rounded-lg bg-slate-100 hover:shadow-lg transition group">
              <img src={post.imageUrl} alt={post.caption} className="w-full h-48 sm:h-44 object-cover transform group-hover:scale-105 transition-transform" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x800?text=No+Image')} />
              {post.caption && <div className="absolute bottom-2 left-2 right-2 bg-black/40 text-white text-xs py-1 px-2 rounded-md truncate">{post.caption}</div>}
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
