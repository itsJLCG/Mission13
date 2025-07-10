import React, { useState, useEffect } from 'react'
import UserHeader from '../Components/UserDashboard/UserHeader'
import Sidebar from '../Components/UserDashboard/Sidebar'
import DailyChallenge from '../Components/UserDashboard/Sections/DailyChallenge'
import ChallengeHistory from '../Components/UserDashboard/Sections/ChallengeHistory'
import Calendar from '../Components/UserDashboard/Sections/Calendar'
import Leaderboard from '../Components/UserDashboard/Sections/Leaderboard'

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [history, setHistory] = useState([])
  const [dailyChallenge, setDailyChallenge] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Calculate total points from history
  const totalPoints = history.reduce((sum, item) => sum + (item.challenge.points || 50), 0)

  // Fetch daily challenge from backend
  useEffect(() => {
    fetchDailyChallenge()
    loadHistoryFromStorage()
  }, [])

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
        // Fallback to default challenge
        setDailyChallenge({
          title: "Default Eco Challenge",
          description: "Backend offline - using default challenge",
          points: 50,
          date: new Date().toISOString().split('T')[0]
        })
      }
    } catch (error) {
      console.error('Error fetching daily challenge:', error)
      // Fallback to default challenge
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

  // Load history from localStorage
  const loadHistoryFromStorage = () => {
    try {
      const savedHistory = localStorage.getItem('challenge-history')
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory))
      }
    } catch (error) {
      console.error('Error loading history:', error)
    }
  }

  // Save history to localStorage
  const saveHistoryToStorage = (newHistory) => {
    try {
      localStorage.setItem('challenge-history', JSON.stringify(newHistory))
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#eaf6ec] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b8f772] mx-auto mb-4"></div>
          <p className="text-[#191b40] font-semibold">Loading today's challenge...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#eaf6ec]">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <UserHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          <section className="my-8 mx-auto max-w-6xl px-4">
            {/* Header */}
            <div
              className="mb-6 flex items-center justify-between"
              style={{ fontFamily: 'Lexend Deca, Poppins, Nunito Sans, sans-serif' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#191b40]">Today's Challenge</span>
                <span className="px-3 py-1 rounded-full bg-[#b8f772] text-[#191b40] text-xs font-semibold">
                  {dailyChallenge?.date ? new Date(dailyChallenge.date).toLocaleDateString() : 'Eco Daily'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-[#191b40]">Total Points:</span>
                <span className="text-3xl font-bold text-[#b8f772] bg-[#191b40] px-4 py-2 rounded-full">
                  {totalPoints}
                </span>
              </div>
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side - Challenge Content */}
              <div className="lg:col-span-2">
                <DailyChallenge 
                  challenge={dailyChallenge} 
                  onChallengeComplete={handleChallengeComplete} 
                />
                <ChallengeHistory history={history} />
              </div>
              
              {/* Right Side - Activity Tracker & Leaderboard */}
              <div className="lg:col-span-1 space-y-4">
                <Calendar history={history} />
                <Leaderboard currentUserPoints={totalPoints} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Home