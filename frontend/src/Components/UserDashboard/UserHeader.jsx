import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const UserHeader = ({ onMenuClick }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImage: '',
    joinDate: '',
    preferences: {
      notifications: true,
      newsletter: true,
      challenges: true,
      tips: false
    }
  })
  const [formData, setFormData] = useState(profileData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notification, setNotification] = useState(null)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: 'You completed 5 challenges this week!',
      time: '2 hours ago',
      read: false,
      icon: '🏆'
    },
    {
      id: 2,
      type: 'challenge',
      title: 'Daily Challenge Available',
      message: 'A new eco-challenge is waiting for you!',
      time: '1 day ago',
      read: false,
      icon: '🌱'
    },
    {
      id: 3,
      type: 'streak',
      title: 'Streak Milestone!',
      message: 'You\'ve maintained your eco-streak for 7 days!',
      time: '2 days ago',
      read: true,
      icon: '🔥'
    },
    {
      id: 4,
      type: 'tip',
      title: 'Eco Tip of the Day',
      message: 'Did you know? LED bulbs use 75% less energy than traditional bulbs.',
      time: '3 days ago',
      read: true,
      icon: '💡'
    }
  ])
  
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get user from auth context
  const { user, logout, login } = useAuth()
  
  // Create personalized welcome message
  const getUserName = () => {
    if (!user) return 'Eco Warrior'
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user.firstName) {
      return user.firstName
    }
    if (user.email) {
      return user.email.split('@')[0]
    }
    return 'Eco Warrior'
  }
  
  const welcomeMessage = `Hello, ${getUserName()}!`
  const isDashboard = location.pathname === '/dashboard'

  const unreadCount = notifications.filter(n => !n.read).length

  // Load user data when modal opens
  useEffect(() => {
    if (showProfileModal && user) {
      const mappedData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        profileImage: user.profileImage || '',
        joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        preferences: {
          notifications: user.preferences?.notifications ?? true,
          newsletter: user.preferences?.newsletter ?? true,
          challenges: user.preferences?.challenges ?? true,
          tips: user.preferences?.tips ?? false
        }
      }
      setProfileData(mappedData)
      setFormData(mappedData)
    }
  }, [showProfileModal, user])

  // Typing animation effect
  useEffect(() => {
    if (!isDashboard) return
    
    setDisplayedText('')
    setIsTyping(true)
    
    let index = 0
    const typingInterval = setInterval(() => {
      if (index < welcomeMessage.length) {
        setDisplayedText(welcomeMessage.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(typingInterval)
      }
    }, 100)
    
    return () => clearInterval(typingInterval)
  }, [isDashboard, welcomeMessage])

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-modal') && !event.target.closest('.notification-btn')) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // NOTIFICATION FUNCTIONALITY
  const handleNotificationClick = (notification) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    )
    
    switch (notification.type) {
      case 'achievement':
        console.log('Navigate to achievements')
        break
      case 'challenge':
        navigate('/dashboard')
        break
      case 'streak':
        console.log('Show streak details')
        break
      case 'tip':
        console.log('Show eco tip')
        break
      default:
        break
    }
    
    setShowNotifications(false)
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (notificationId, event) => {
    event.stopPropagation()
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    )
  }

  // PROFILE MODAL FUNCTIONS
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleSave = async () => {
    if (!user) {
      showNotification('User not found. Please login again.', 'error')
      return
    }

    try {
      setLoading(true)
      setError('')

      const updateData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        profileImage: formData.profileImage,
        preferences: formData.preferences
      }

      const response = await fetch('http://127.0.0.1:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setProfileData(formData)
        setIsEditing(false)
        
        const updatedUser = {
          ...user,
          firstName: formData.firstName,
          lastName: formData.lastName,
          profileImage: formData.profileImage,
          preferences: formData.preferences
        }
        
        login(updatedUser)
        showNotification('Profile updated successfully!', 'success')
      } else {
        setError(data.message || 'Failed to update profile')
        showNotification(data.message || 'Failed to update profile. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setError('Failed to connect to server')
      showNotification('Unable to connect to server. Please check your connection and try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(profileData)
    setIsEditing(false)
    setError('')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowProfileModal(false)
  }

  const closeProfileModal = () => {
    setShowProfileModal(false)
    setIsEditing(false)
    setError('')
    setFormData(profileData)
  }

  // Get user initials for profile button
  const getUserInitials = () => {
    if (!user) return 'U'
    
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    if (user.firstName) {
      return user.firstName[0].toUpperCase()
    }
    if (user.email) {
      return user.email[0].toUpperCase()
    }
    return 'U'
  }

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'achievement': return 'text-yellow-600'
      case 'challenge': return 'text-green-600'
      case 'streak': return 'text-orange-600'
      case 'tip': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || ''
    const last = lastName?.charAt(0) || ''
    return `${first}${last}`.toUpperCase() || 'U'
  }

  return (
    <>
      {/* Enhanced Notification Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-[9999] w-80 animate-slide-in-right">
          <div className={`
            bg-white rounded-xl shadow-2xl border-l-4 overflow-hidden 
            transform transition-all duration-300 ease-out
            ${notification.type === 'success' 
              ? 'border-l-[#b8f772] shadow-[#b8f772]/10' 
              : 'border-l-red-500 shadow-red-500/10'
            }
          `}>
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 pt-1">
                  {notification.type === 'success' ? (
                    <div className="w-8 h-8 bg-[#b8f772] rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${
                    notification.type === 'success' ? 'text-[#191b40]' : 'text-red-900'
                  }`}>
                    {notification.type === 'success' ? '🎉 Success!' : '❌ Error'}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 leading-relaxed break-words">
                    {notification.message}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <button
                    onClick={() => setNotification(null)}
                    className="inline-flex rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#b8f772] transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-1 ${
                  notification.type === 'success' ? 'bg-[#b8f772]' : 'bg-red-500'
                } animate-progress rounded-full`}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between px-8 py-4 relative">
        {/* Left: Welcome Message with Typing Animation (Dashboard only) */}
        <div className="flex items-center gap-4">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
            onClick={onMenuClick}
            aria-label="Open sidebar"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-gray-900">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          
          {/* Welcome Message - Only show on dashboard */}
          {isDashboard && (
            <h1 className="text-3xl font-bold text-black font-poppins">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-0.5 h-6 bg-[#191b40] ml-1"></span>
              )}
            </h1>
          )}
        </div>

        {/* Right: Notification & Profile */}
        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <div className="relative">
            <button
              className="notification-btn relative p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-gray-700">
                <path
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Notification Badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Enhanced Notification Modal */}
            {showNotifications && (
              <div className="notification-modal absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                <div className="bg-gradient-to-r from-[#b8f772] to-[#a8e762] px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#191b40]">Notifications</h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          {unreadCount} new
                        </span>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-[#191b40] hover:bg-black/10 rounded-full p-1"
                      >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">🔔</div>
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition group ${
                          !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`text-2xl flex-shrink-0 ${getNotificationTypeColor(notification.type)}`}>
                            {notification.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-[#191b40] truncate">
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                )}
                                <button
                                  onClick={(e) => deleteNotification(notification.id, e)}
                                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1"
                                  title="Delete notification"
                                >
                                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {notifications.length > 0 && unreadCount > 0 && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <button 
                      onClick={markAllAsRead}
                      className="w-full text-center text-sm text-[#191b40] hover:text-[#b8f772] font-medium py-2 hover:bg-white rounded-lg transition"
                    >
                      Mark all as read
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Button */}
          <div className="relative">
            <button
              className="profile-btn w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center text-gray-900 font-bold text-lg hover:bg-lime-500 transition shadow-lg"
              aria-label="User Profile"
              onClick={() => setShowProfileModal(!showProfileModal)}
            >
              <span>{getUserInitials()}</span>
            </button>
          </div>
        </div>
      </header>

     {showProfileModal && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 font-[Poppins]">
    <div className="relative bg-[#fcfbec] rounded-2xl p-6 border-2 border-black shadow-[0_6px_0_rgba(0,0,0,0.8)] backdrop-blur-sm transition-all duration-300 w-full max-w-md mt-2">

      {/* Close Button */}
      <button
        onClick={closeProfileModal}
        className="absolute top-4 right-4 text-gray-500 hover:text-black p-2 rounded-full hover:bg-black/10 transition"
        aria-label="Close modal"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Avatar & Info */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-[#599645] flex items-center justify-center mb-3">
          <span className="text-3xl font-bold text-white">
            {getInitials(profileData.firstName, profileData.lastName)}
          </span>
        </div>

        {!isEditing && (
          <>
            <h3 className="text-lg font-semibold text-[#184b3e]">
              {profileData.firstName} {profileData.lastName}
            </h3>
            <p className="text-sm text-gray-600">
              Joined {formatDate(profileData.joinDate)}
            </p>
          </>
        )}
      </div>

      {/* Profile Form */}
      <div className="space-y-4">
        {/* First + Last Name Side-by-Side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#184b3e] mb-1">First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#599645]"
              />
            ) : (
              <p className="text-gray-700">{profileData.firstName || 'Not specified'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#184b3e] mb-1">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#599645]"
              />
            ) : (
              <p className="text-gray-700">{profileData.lastName || 'Not specified'}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#184b3e] mb-1">Email</label>
          <input
            type="email"
            value={profileData.email}
            disabled
            className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md text-gray-700"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col items-center gap-3 mt-6">
        {isEditing ? (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-[#599645] text-white rounded-md hover:bg-[#4b8539] transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 bg-[#d8e84e] text-[#184b3e] rounded-lg hover:bg-[#cfe043] transition font-semibold"
          >
            Edit Profile
          </button>
        )}

        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 text-red-600 border border-red-300 hover:bg-red-50 rounded-lg transition font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
)}


      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        .animate-progress {
          animation: progress 4s linear forwards;
        }
      `}</style>
    </>
  )
}

export default UserHeader