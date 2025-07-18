import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import UserHeader from '../Components/UserDashboard/UserHeader'
import Sidebar from '../Components/UserDashboard/Sidebar'

const UserProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImage: '', // Add this line
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
  
  const { user, login } = useAuth()
  const navigate = useNavigate()

  // Load user data from auth context
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Map user data from auth context
    const mappedData = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      profileImage: user.profileImage || '', // Add this line
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
  }, [user, navigate])

  // Show notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    // Auto hide after 4 seconds
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

  // Add image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification('Please select a valid image file.', 'error')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size should be less than 5MB.', 'error')
      return
    }

    try {
      setLoading(true)
      
      // Convert to base64
      const reader = new FileReader()
      reader.onload = async (event) => {
        const imageDataUrl = event.target.result
        
        // Update form data
        const updatedFormData = {
          ...formData,
          profileImage: imageDataUrl
        }
        setFormData(updatedFormData)
        
        showNotification('Profile image updated! Don\'t forget to save your changes.', 'success')
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      showNotification('Failed to upload image. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) {
      showNotification('User not found. Please login again.', 'error')
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setError('')

      // Prepare data for backend including profile image
      const updateData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        profileImage: formData.profileImage, // Add this line
        preferences: formData.preferences
      }

      console.log('Sending update data:', updateData)

      // Make API call to update profile in database
      const response = await fetch('http://127.0.0.1:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()
      console.log('Server response:', data)

      if (response.ok && data.success) {
        // Update local state
        setProfileData(formData)
        setIsEditing(false)
        
        // Update user in auth context and localStorage
        const updatedUser = {
          ...user,
          firstName: formData.firstName,
          lastName: formData.lastName,
          profileImage: formData.profileImage, // Add this line
          preferences: formData.preferences
        }
        
        // Update auth context (this will update localStorage too)
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

  // Show loading or error state
  if (!user) {
    return (
      <div className="flex min-h-screen bg-[#eaf6ec] items-center justify-center">
        <div className="text-center">
          <p className="text-[#191b40] font-semibold mb-4">Please log in to view your profile</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-[#b8f772] text-[#191b40] rounded-lg hover:bg-[#a8e762] transition font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#eaf6ec]">
      {/* Enhanced Notification Toast - Fixed positioning */}
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
                {/* Icon */}
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
                
                {/* Content */}
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
                
                {/* Close button */}
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
              
              {/* Progress bar */}
              <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${
                  notification.type === 'success' ? 'bg-[#b8f772]' : 'bg-red-500'
                } animate-progress rounded-full`}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <UserHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6 flex-1">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="p-2 rounded-lg hover:bg-white/50 transition"
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-[#191b40]">
                    <path
                      d="M19 12H5M12 19l-7-7 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <h1 className="text-3xl font-bold text-[#191b40]">My Profile</h1>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={loading}
                className="px-4 py-2 bg-[#b8f772] text-[#191b40] rounded-lg hover:bg-[#a8e762] transition font-semibold disabled:opacity-50"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow p-6 border border-[#b8f772]">
                  <div className="text-center">
                    {/* Profile Picture */}
                    <div className="w-24 h-24 rounded-full bg-[#b8f772] flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-[#191b40]">
                        {getInitials(profileData.firstName, profileData.lastName)}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-[#191b40] mb-2">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    
                    <p className="text-gray-600 mb-4">{profileData.email}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-[#b8f772]">
                          <path
                            d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 10h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Joined {formatDate(profileData.joinDate)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow p-6 border border-[#b8f772]">
                  <h3 className="text-lg font-bold text-[#191b40] mb-6">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-[#191b40] mb-2">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772]"
                        />
                      ) : (
                        <p className="text-gray-700">{profileData.firstName || 'Not specified'}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-[#191b40] mb-2">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772]"
                        />
                      ) : (
                        <p className="text-gray-700">{profileData.lastName || 'Not specified'}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-[#191b40] mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772] bg-gray-100"
                          disabled
                        />
                      ) : (
                        <p className="text-gray-700">{profileData.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Save/Cancel Buttons */}
                  {isEditing && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-[#b8f772] text-[#191b40] rounded-lg hover:bg-[#a8e762] transition font-semibold disabled:opacity-50 flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#191b40]"></div>
                            Saving...
                          </>
                        ) : (
                          'Save'
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-xl shadow p-6 border border-[#b8f772] mt-6">
                  <h3 className="text-lg font-bold text-[#191b40] mb-6">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(profileData.preferences).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-[#191b40] capitalize">
                            {key === 'notifications' && 'Push Notifications'}
                            {key === 'newsletter' && 'Email Newsletter'}
                            {key === 'challenges' && 'Daily Challenges'}
                            {key === 'tips' && 'Eco Tips'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {key === 'notifications' && 'Receive notifications about new challenges and achievements'}
                            {key === 'newsletter' && 'Weekly eco-tips and environmental news'}
                            {key === 'challenges' && 'Get notified about new daily challenges'}
                            {key === 'tips' && 'Daily sustainability tips and advice'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name={`preferences.${key}`}
                            checked={isEditing ? formData.preferences[key] : profileData.preferences[key]}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#b8f772]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b8f772]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

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
    </div>
  )
}

export default UserProfile