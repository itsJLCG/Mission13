
import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import UserHeader from '../Components/UserDashboard/UserHeader'
import Sidebar from '../Components/UserDashboard/Sidebar'
import DailyChallenge from '../Components/UserDashboard/Sections/DailyChallenge'
import ChallengeHistory from '../Components/UserDashboard/Sections/ChallengeHistory'
import Calendar from '../Components/UserDashboard/Sections/Calendar'
import Leaderboard from '../Components/UserDashboard/Sections/Leaderboard'
import '../styles/UserDashboard.css'

const Home = () => {
  // Default open on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024)
  const [history, setHistory] = useState([])
  const [dailyChallenge, setDailyChallenge] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Calculate total points from ACTUAL history
  const totalPoints = history.reduce((sum, item) => sum + (item.challenge.points || 50), 0)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth <= 1024) {
        const sidebar = document.querySelector('.grass-sidebar')
        const toggleBtn = document.querySelector('.sidebar-toggle')
        
        if (sidebar && !sidebar.contains(event.target) && 
            toggleBtn && !toggleBtn.contains(event.target)) {
          setSidebarOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [sidebarOpen])

  // Authentication check - redirect if not authenticated
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated() || !user) {
        console.log('User not authenticated, redirecting to login')
        navigate('/login', { 
          replace: true,
          state: { from: { pathname: '/dashboard' } }
        })
        return
      }
    }
  }, [isAuthenticated, user, authLoading, navigate])

  // Fetch daily challenge from backend
  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchDailyChallenge()
    }
  }, [isAuthenticated, user])

  // Load history when user changes - separate useEffect
  useEffect(() => {
    if (user && isAuthenticated()) {
      loadHistoryFromStorage()
    } else {
      setHistory([])
    }
  }, [user, isAuthenticated])

  const fetchDailyChallenge = async () => {
    try {
      console.log('Fetching daily challenge...')
      const response = await fetch('http://127.0.0.1:5000/api/daily-challenge')
      
      if (response.ok) {
        const data = await response.json()
        console.log('Daily challenge fetched:', data)
        setDailyChallenge(data)
      } else {
        console.error('Failed to fetch daily challenge:', response.status)
        setDailyChallenge({
          title: "Default Eco Challenge",
          description: "Backend offline - using default challenge",
          points: 50,
          date: new Date().toISOString().split('T')[0]
        })
      }
    } catch (error) {
      console.error('Error fetching daily challenge:', error)
      setDailyChallenge({
        title: "Default Eco Challenge", 
        description: "Backend offline - using default challenge",
        points: 50,
        date: new Date().toISOString().split('T')[0]
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load history from localStorage (user-specific)
  const loadHistoryFromStorage = () => {
    try {
      if (!user) return
      
      const userHistoryKey = `challenge-history-${user.email}`
      const savedHistory = localStorage.getItem(userHistoryKey)
      
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        setHistory(parsedHistory)
        console.log(`Loaded ${parsedHistory.length} challenges for user ${user.email}`)
      } else {
        setHistory([])
        console.log('No history found for new user')
      }
    } catch (error) {
      console.error('Error loading history:', error)
      setHistory([])
    }
  }

  // Save history to localStorage (user-specific)
  const saveHistoryToStorage = (newHistory) => {
    try {
      if (!user) return
      
      const userHistoryKey = `challenge-history-${user.email}`
      localStorage.setItem(userHistoryKey, JSON.stringify(newHistory))
      console.log(`Saved ${newHistory.length} challenges for user ${user.email}`)
    } catch (error) {
      console.error('Error saving history:', error)
    }
  }

  // Handle challenge completion
  const handleChallengeComplete = (completedChallenge) => {
    const newHistory = [completedChallenge, ...history]
    setHistory(newHistory)
    saveHistoryToStorage(newHistory)
  }

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="loading-text">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show loading while dashboard data is being fetched
  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated() || !user) {
    return null
  }

  return (
    <div className="dashboard-container">
      {/* Mobile Toggle Button */}
      <button 
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <div className="main-content">
        <UserHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="dashboard-main">
          <div className="dashboard-content">
            {/* Header Section */}
            <div className="dashboard-header-section">
              <div className="header-left-section">
                <h1 className="header-main-title">Today's Challenge</h1>
                <span className="header-date-badge">
                  {dailyChallenge?.date ? new Date(dailyChallenge.date).toLocaleDateString() : 'Eco Daily'}
                </span>
              </div>
              <div className="header-right-section">
                <div className="points-display">
                  <span className="points-label">Total Points:</span>
                  <span className="points-value">{totalPoints}</span>
                </div>
              </div>
            </div>
            
            {/* Main Content Grid */}
            <div className="dashboard-grid">
              {/* Left Column - Challenge Content */}
              <div className="left-column">
                <DailyChallenge 
                  challenge={dailyChallenge} 
                  onChallengeComplete={handleChallengeComplete} 
                />
                <ChallengeHistory history={history} />
              </div>
              
              {/* Right Column - Activity Tracker & Leaderboard */}
              <div className="right-column">
                <Calendar history={history} />
                <Leaderboard currentUserPoints={totalPoints} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home