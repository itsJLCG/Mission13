import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserHeader from '../Components/UserDashboard/UserHeader'
import Sidebar from '../Components/UserDashboard/Sidebar'

const UserProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-15',
    location: 'New York, NY',
    bio: 'Passionate about environmental conservation and sustainable living. Love hiking and outdoor activities.',
    joinDate: '2024-01-15',
    preferences: {
      notifications: true,
      newsletter: true,
      challenges: true,
      tips: false
    }
  })

  const [formData, setFormData] = useState(profileData)
  const navigate = useNavigate()

  // Load profile data from localStorage if available
  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile')
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfileData(parsed)
      setFormData(parsed)
    }
  }, [])

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

  const handleSave = () => {
    setProfileData(formData)
    localStorage.setItem('user_profile', JSON.stringify(formData))
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    setFormData(profileData)
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="flex min-h-screen bg-[#eaf6ec]">
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
                className="px-4 py-2 bg-[#b8f772] text-[#191b40] rounded-lg hover:bg-[#a8e762] transition font-semibold"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

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
                      
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-[#b8f772]">
                          <path
                            d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        {profileData.location}
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
                        <p className="text-gray-700">{profileData.firstName}</p>
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
                        <p className="text-gray-700">{profileData.lastName}</p>
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772]"
                        />
                      ) : (
                        <p className="text-gray-700">{profileData.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-[#191b40] mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772]"
                        />
                      ) : (
                        <p className="text-gray-700">{profileData.phone}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-[#191b40] mb-2">
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772]"
                        />
                      ) : (
                        <p className="text-gray-700">{formatDate(profileData.dateOfBirth)}</p>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-[#191b40] mb-2">
                        Location
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772]"
                        />
                      ) : (
                        <p className="text-gray-700">{profileData.location}</p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-[#191b40] mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772]"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-700">{profileData.bio}</p>
                    )}
                  </div>

                  {/* Save/Cancel Buttons */}
                  {isEditing && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-[#b8f772] text-[#191b40] rounded-lg hover:bg-[#a8e762] transition font-semibold"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
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
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-[#191b40]">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications about new challenges and achievements</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="preferences.notifications"
                          checked={isEditing ? formData.preferences.notifications : profileData.preferences.notifications}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#b8f772]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b8f772]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-[#191b40]">Email Newsletter</h4>
                        <p className="text-sm text-gray-600">Weekly eco-tips and environmental news</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="preferences.newsletter"
                          checked={isEditing ? formData.preferences.newsletter : profileData.preferences.newsletter}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#b8f772]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b8f772]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-[#191b40]">Daily Challenges</h4>
                        <p className="text-sm text-gray-600">Get notified about new daily challenges</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="preferences.challenges"
                          checked={isEditing ? formData.preferences.challenges : profileData.preferences.challenges}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#b8f772]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b8f772]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-[#191b40]">Eco Tips</h4>
                        <p className="text-sm text-gray-600">Daily sustainability tips and advice</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="preferences.tips"
                          checked={isEditing ? formData.preferences.tips : profileData.preferences.tips}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#b8f772]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b8f772]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default UserProfile