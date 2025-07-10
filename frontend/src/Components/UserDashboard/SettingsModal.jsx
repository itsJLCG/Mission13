import React, { useState, useEffect } from 'react'
import { streakManager } from '../../utils/streakManager'

const SettingsModal = ({ isOpen, onClose, streakData }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: {
      push: true,
      email: true,
      challenges: true,
      achievements: true,
      streak: true
    },
    privacy: {
      profilePublic: false,
      shareProgress: true,
      leaderboard: true
    },
    challenges: {
      difficulty: 'medium',
      categories: {
        water: true,
        energy: true,
        waste: true,
        transport: true,
        food: true,
        lifestyle: true
      },
      reminderTime: '09:00'
    },
    data: {
      autoSync: true,
      dataSharing: false
    }
  })

  const [activeTab, setActiveTab] = useState('general')

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('user_settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('user_settings', JSON.stringify(settings))
    alert('Settings saved successfully!')
  }

  const handleInputChange = (path, value) => {
    const keys = path.split('.')
    setSettings(prev => {
      const newSettings = { ...prev }
      let current = newSettings
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newSettings
    })
  }

  const resetStreak = () => {
    if (window.confirm('Are you sure you want to reset your streak? This action cannot be undone.')) {
      streakManager.resetStreak()
      // Dispatch event to update header
      window.dispatchEvent(new CustomEvent('streakUpdated'))
      alert('Streak reset successfully!')
    }
  }

  const exportData = () => {
    const data = {
      settings,
      streakData: streakManager.getStreakData(),
      challengeHistory: streakManager.getChallengeHistory(),
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mission13-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#191b40]">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-gray-500">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-4 border-r border-gray-200">
            <nav className="space-y-2">
              {[
                { id: 'general', label: 'General', icon: '⚙️' },
                { id: 'notifications', label: 'Notifications', icon: '🔔' },
                { id: 'privacy', label: 'Privacy', icon: '🔒' },
                { id: 'challenges', label: 'Challenges', icon: '🎯' },
                { id: 'streak', label: 'Streak & Data', icon: '🔥' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-[#b8f772] text-[#191b40] font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#191b40] mb-4">General Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#191b40] mb-2">
                        Theme
                      </label>
                      <select
                        value={settings.theme}
                        onChange={(e) => handleInputChange('theme', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772]"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#191b40] mb-2">
                        Language
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772]"
                        defaultValue="en"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#191b40] mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-[#191b40] capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {key === 'push' && 'Receive push notifications'}
                            {key === 'email' && 'Receive email notifications'}
                            {key === 'challenges' && 'Get notified about new challenges'}
                            {key === 'achievements' && 'Get notified about achievements'}
                            {key === 'streak' && 'Get streak milestone notifications'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleInputChange(`notifications.${key}`, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#b8f772]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b8f772]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#191b40] mb-4">Privacy Settings</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.privacy).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-[#191b40] capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {key === 'profilePublic' && 'Make your profile visible to other users'}
                            {key === 'shareProgress' && 'Share your progress with friends'}
                            {key === 'leaderboard' && 'Show your name on leaderboards'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleInputChange(`privacy.${key}`, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#b8f772]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b8f772]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Challenges */}
            {activeTab === 'challenges' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#191b40] mb-4">Challenge Preferences</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#191b40] mb-2">
                        Difficulty Level
                      </label>
                      <select
                        value={settings.challenges.difficulty}
                        onChange={(e) => handleInputChange('challenges.difficulty', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772]"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#191b40] mb-2">
                        Daily Reminder Time
                      </label>
                      <input
                        type="time"
                        value={settings.challenges.reminderTime}
                        onChange={(e) => handleInputChange('challenges.reminderTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#191b40] mb-2">
                        Challenge Categories
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(settings.challenges.categories).map(([key, value]) => (
                          <div key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              id={key}
                              checked={value}
                              onChange={(e) => handleInputChange(`challenges.categories.${key}`, e.target.checked)}
                              className="h-4 w-4 text-[#b8f772] focus:ring-[#b8f772] border-gray-300 rounded"
                            />
                            <label htmlFor={key} className="ml-2 text-sm text-gray-700 capitalize">
                              {key}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Streak & Data */}
            {activeTab === 'streak' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#191b40] mb-4">Streak & Data Management</h3>
                  
                  {/* Streak Stats */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-[#191b40] mb-3">Your Streak Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#b8f772]">{streakData.currentStreak}</div>
                        <div className="text-sm text-gray-600">Current Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#b8f772]">{streakData.longestStreak}</div>
                        <div className="text-sm text-gray-600">Longest Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#b8f772]">{streakData.totalChallenges}</div>
                        <div className="text-sm text-gray-600">Total Challenges</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#b8f772]">
                          {streakData.completedToday ? '✅' : '⏳'}
                        </div>
                        <div className="text-sm text-gray-600">Today's Status</div>
                      </div>
                    </div>
                  </div>

                  {/* Data Actions */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-[#191b40] mb-2">Data Actions</h4>
                      <div className="space-y-3">
                        <button
                          onClick={exportData}
                          className="w-full px-4 py-2 bg-[#b8f772] text-[#191b40] rounded-lg hover:bg-[#a8e762] transition font-semibold"
                        >
                          Export My Data
                        </button>
                        <button
                          onClick={resetStreak}
                          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                        >
                          Reset Streak
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-[#191b40]">Auto Sync</h4>
                        <p className="text-sm text-gray-600">Automatically sync your data</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.data.autoSync}
                          onChange={(e) => handleInputChange('data.autoSync', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#b8f772]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b8f772]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              saveSettings()
              onClose()
            }}
            className="px-4 py-2 bg-[#b8f772] text-[#191b40] rounded-lg hover:bg-[#a8e762] transition font-semibold"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal