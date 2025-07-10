class StreakManager {
  constructor() {
    this.STREAK_KEY = 'eco_streak_data'
    this.CHALLENGE_HISTORY_KEY = 'challenge-history'
  }

  // Get current streak data
  getStreakData() {
    try {
      const data = localStorage.getItem(this.STREAK_KEY)
      if (data) {
        return JSON.parse(data)
      }
    } catch (error) {
      console.error('Error loading streak data:', error)
    }
    
    // Return default streak data
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastChallengeDate: null,
      totalChallenges: 0,
      streakDates: []
    }
  }

  // Save streak data
  saveStreakData(streakData) {
    try {
      localStorage.setItem(this.STREAK_KEY, JSON.stringify(streakData))
    } catch (error) {
      console.error('Error saving streak data:', error)
    }
  }

  // Check if user completed a challenge today
  completedChallengeToday() {
    const today = new Date().toDateString()
    const history = this.getChallengeHistory()
    
    return history.some(item => {
      const completedDate = new Date(item.completedAt).toDateString()
      return completedDate === today
    })
  }

  // Get challenge history
  getChallengeHistory() {
    try {
      const history = localStorage.getItem(this.CHALLENGE_HISTORY_KEY)
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.error('Error loading challenge history:', error)
      return []
    }
  }

  // Update streak when a challenge is completed
  updateStreakOnChallenge() {
    const streakData = this.getStreakData()
    const today = new Date().toDateString()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()

    // Check if already completed today
    if (streakData.lastChallengeDate === today) {
      return streakData // Already updated today
    }

    // Update streak
    if (streakData.lastChallengeDate === yesterdayStr) {
      // Consecutive day - increment streak
      streakData.currentStreak += 1
    } else if (streakData.lastChallengeDate === null || streakData.lastChallengeDate < yesterdayStr) {
      // First challenge or broke streak - reset to 1
      streakData.currentStreak = 1
    }

    // Update other data
    streakData.lastChallengeDate = today
    streakData.totalChallenges += 1
    streakData.longestStreak = Math.max(streakData.longestStreak, streakData.currentStreak)
    
    // Add today to streak dates
    if (!streakData.streakDates.includes(today)) {
      streakData.streakDates.push(today)
    }

    // Keep only last 30 days of streak dates
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    streakData.streakDates = streakData.streakDates.filter(date => 
      new Date(date) >= thirtyDaysAgo
    )

    this.saveStreakData(streakData)
    return streakData
  }

  // Check and update streak (call this on app load)
  checkAndUpdateStreak() {
    const streakData = this.getStreakData()
    const today = new Date().toDateString()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()

    // If last challenge was not yesterday or today, reset streak
    if (streakData.lastChallengeDate && 
        streakData.lastChallengeDate !== today && 
        streakData.lastChallengeDate !== yesterdayStr) {
      streakData.currentStreak = 0
      this.saveStreakData(streakData)
    }

    return streakData
  }

  // Get streak stats for display
  getStreakStats() {
    const streakData = this.getStreakData()
    const completedToday = this.completedChallengeToday()
    
    return {
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      totalChallenges: streakData.totalChallenges,
      completedToday,
      streakDates: streakData.streakDates,
      canIncrement: !completedToday // Can only increment if not completed today
    }
  }

  // Reset streak (for testing)
  resetStreak() {
    const defaultData = {
      currentStreak: 0,
      longestStreak: 0,
      lastChallengeDate: null,
      totalChallenges: 0,
      streakDates: []
    }
    this.saveStreakData(defaultData)
    return defaultData
  }
}

// Export singleton instance
export const streakManager = new StreakManager()