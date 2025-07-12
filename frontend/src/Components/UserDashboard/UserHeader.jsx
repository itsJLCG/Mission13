import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext' // Add this import
import { streakManager } from '../../utils/streakManager'
import SettingsModal from './SettingsModal'

const UserHeader = ({ onMenuClick }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [streakData, setStreakData] = useState({ currentStreak: 0, completedToday: false })
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get user from auth context
  const { user, logout } = useAuth()
  
  // Create personalized welcome message
  const getUserName = () => {
    if (!user) return 'Eco Warrior'
    
    // // Try to get full name first
    // if (user.firstName && user.lastName) {
    //   return `${user.firstName} ${user.lastName}`
    // }
    // If only first name is available
    if (user.firstName) {
      return user.firstName
    }
    // If only email is available, use the part before @
    if (user.email) {
      return user.email.split('@')[0]
    }
    // Fallback
    return 'Eco Warrior'
  }
  
  const welcomeMessage = `Welcome back, ${getUserName()}!`
  const isDashboard = location.pathname === '/dashboard'
  
  // Load streak data on component mount
  useEffect(() => {
    const loadStreakData = () => {
      const data = streakManager.checkAndUpdateStreak()
      const stats = streakManager.getStreakStats()
      setStreakData(stats)
    }
    
    loadStreakData()
    
    // Listen for streak updates
    const handleStreakUpdate = () => {
      loadStreakData()
    }
    
    window.addEventListener('streakUpdated', handleStreakUpdate)
    return () => window.removeEventListener('streakUpdated', handleStreakUpdate)
  }, [])

  // Sample notifications data
  const notifications = [
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
      message: `You've maintained your eco-streak for ${streakData.currentStreak} days!`,
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
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  // Typing animation effect - reset when user changes
  useEffect(() => {
    if (!isDashboard) return
    
    // Reset animation when welcome message changes
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
  }, [isDashboard, welcomeMessage]) // Added welcomeMessage as dependency

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-modal') && !event.target.closest('.notification-btn')) {
        setShowNotifications(false)
      }
      if (!event.target.closest('.profile-menu') && !event.target.closest('.profile-btn')) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleNotificationClick = (notification) => {
    // Mark as read and handle notification action
    console.log('Notification clicked:', notification)
    setShowNotifications(false)
  }

  const handleProfileClick = () => {
    navigate('/profile')
    setShowProfileMenu(false)
  }

  const handleLogout = () => {
    // Use auth context logout method
    logout()
    navigate('/login')
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

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥💪'
    if (streak >= 14) return '🔥🔥'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '🌟'
    return '🌱'
  }

  const getStreakMessage = (streak, completedToday) => {
    if (completedToday) {
      return `Amazing! ${streak} day streak! 🎉`
    }
    if (streak === 0) {
      return 'Start your eco-journey today! 💚'
    }
    return `${streak} day streak! Complete today's challenge to continue! 🚀`
  }

  return (
    <>
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
            <h1 className="text-4xl font-bold text-[#191b40]">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-0.5 h-6 bg-[#191b40] ml-1 animate-pulse"></span>
              )}
            </h1>
          )}
        </div>

        {/* Right: Streak Badge, Notification, & Profile */}
        <div className="flex items-center gap-4">
          {/* Streak Badge */}
          <div className="relative group flex items-center" tabIndex={0}>
            <span
              className={`flex items-center gap-1 px-3 py-1 rounded-full font-bold text-[#020202] text-sm bg-transparent border-2 transition-all duration-200 ${
                streakData.completedToday 
                  ? 'border-[#bafe40] bg-[#bafe40]/20 animate-pulse' 
                  : 'border-[#bafe40] hover:bg-[#bafe40]/10'
              }`}
              style={{
                fontWeight: 700,
                cursor: 'pointer',
                userSelect: 'none',
              }}
              title={getStreakMessage(streakData.currentStreak, streakData.completedToday)}
            >
              <span className="text-xl">{getStreakEmoji(streakData.currentStreak)}</span>
              {streakData.currentStreak}-Day Streak
            </span>
            {/* Enhanced Tooltip */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 rounded-lg bg-black text-white text-xs opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity whitespace-nowrap z-50 max-w-xs text-center"
              style={{ pointerEvents: 'none' }}
            >
              <div className="font-semibold">
                {getStreakMessage(streakData.currentStreak, streakData.completedToday)}
              </div>
              <div className="text-xs opacity-80 mt-1">
                Longest streak: {streakData.longestStreak} days
              </div>
            </div>
          </div>

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

            {/* Notification Modal */}
            {showNotifications && (
              <div className="notification-modal absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-[#191b40]">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-sm text-gray-600">{unreadCount} new notifications</p>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{notification.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-[#191b40] truncate">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-[#b8f772] hover:text-[#a8e762] font-medium">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Button */}
          <div className="relative">
            <button
              className="profile-btn w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center text-gray-900 font-bold text-lg hover:bg-lime-500 transition"
              aria-label="User Profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <span>{getUserInitials()}</span>
            </button>

            {/* Profile Menu */}
            {showProfileMenu && (
              <div className="profile-menu absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-gray-500">
                      <path
                        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowSettings(true)
                      setShowProfileMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-gray-500">
                      <path
                        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Settings
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-red-500">
                      <path
                        d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)}
          streakData={streakData}
        />
      )}
    </>
  )
}

export default UserHeader