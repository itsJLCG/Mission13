import React, { useState, useEffect } from 'react'
import { fetchChallenges } from '../../../utils/api'
import { streakManager } from '../../../utils/streakManager'

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [
    h.toString().padStart(2, '0'),
    m.toString().padStart(2, '0'),
    s.toString().padStart(2, '0'),
  ].join(':')
}

// Feedback Modal
function FeedbackModal({ open, onClose, onSubmit }) {
  const [desc, setDesc] = useState('')
  const [img, setImg] = useState(null)

  useEffect(() => {
    if (!open) {
      setDesc('')
      setImg(null)
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative border border-[#b8f772]/20">
        <button
          className="absolute top-6 right-6 text-[#020202] hover:text-[#b8f772] text-2xl font-bold transition-colors"
          onClick={onClose}
          aria-label="Close"
        >×</button>
        <h2 className="text-2xl font-bold mb-6 text-[#191b40]" style={{ fontFamily: 'Lexend Deca, sans-serif' }}>
          Submit Challenge Proof
        </h2>
        <form
          onSubmit={e => {
            e.preventDefault()
            onSubmit({ desc, img })
          }}
          className="flex flex-col gap-6"
        >
          <div>
            <label className="block font-semibold text-[#191b40] mb-3" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
              Description
            </label>
            <textarea
              className="w-full rounded-xl border-2 border-[#b8f772]/30 p-4 bg-[#f8f9fa] focus:border-[#b8f772] focus:bg-white transition-all resize-none"
              rows={4}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Describe how you completed this challenge..."
              required
              style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            />
          </div>
          <div>
            <label className="block font-semibold text-[#191b40] mb-3" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
              Proof Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-4 border-2 border-dashed border-[#b8f772]/30 rounded-xl bg-[#f8f9fa] hover:border-[#b8f772] transition-colors"
              onChange={e => setImg(e.target.files[0])}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#b8f772] text-[#191b40] font-bold hover:bg-[#a3e85c] hover:scale-[1.02] transition-all shadow-lg"
            style={{ fontFamily: 'Lexend Deca, sans-serif' }}
          >
            Submit Proof
          </button>
        </form>
      </div>
    </div>
  )
}

// Success Modal
function SuccessModal({ open, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-2xl flex flex-col items-center relative border border-[#b8f772]/20">
        <div className="absolute transform -translate-x-1/2 -top-8 left-1/2">
          <div className="w-16 h-16 bg-[#b8f772] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl">🎉</span>
          </div>
        </div>
        <div className="flex flex-col items-center mt-8">
          <span className="text-2xl font-bold text-[#191b40] mb-3" style={{ fontFamily: 'Lexend Deca, sans-serif' }}>
            Challenge Completed!
          </span>
          <p className="text-center text-[#191b40] opacity-80 mb-6" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
            Great job! You've earned points for making a positive environmental impact.
          </p>
          <button
            className="px-8 py-3 rounded-xl bg-[#b8f772] text-[#191b40] font-bold hover:bg-[#a3e85c] transition-all"
            onClick={onClose}
            style={{ fontFamily: 'Lexend Deca, sans-serif' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

// Function to get difficulty color and style
function getDifficultyStyle(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return {
        bg: 'bg-gradient-to-r from-green-400 to-green-500',
        text: 'text-white',
        icon: '🌱'
      }
    case 'medium':
      return {
        bg: 'bg-gradient-to-r from-yellow-400 to-orange-400',
        text: 'text-white',
        icon: '⚡'
      }
    case 'hard':
      return {
        bg: 'bg-gradient-to-r from-red-400 to-red-500',
        text: 'text-white',
        icon: '🔥'
      }
    default:
      return {
        bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
        text: 'text-white',
        icon: '📊'
      }
  }
}

// Function to get icon based on challenge title/type
function getChallengeIcon(title) {
  const titleLower = title.toLowerCase()
  
  if (titleLower.includes('recycle') || titleLower.includes('waste')) {
    return (
      <div className="w-12 h-12 bg-gradient-to-br from-[#b8f772] to-[#a3e85c] rounded-2xl flex items-center justify-center shadow-lg">
        <svg className="text-white w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </div>
    )
  } else if (titleLower.includes('water') || titleLower.includes('save')) {
    return (
      <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl">
        <svg className="text-white w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zM12 20c-3.35 0-6-2.57-6-5.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.8 6 9.14 0 2.63-2.65 5.2-6 5.2z"/>
        </svg>
      </div>
    )
  } else if (titleLower.includes('energy') || titleLower.includes('electric') || titleLower.includes('power')) {
    return (
      <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl">
        <svg className="text-white w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.69 2.21L4.33 11.49c-.64.58-.28 1.65.58 1.73L13 14l-4.85 6.76c-.22.31-.19.74.08 1.01.3.3.77.31 1.08.02l10.36-9.28c.64-.58.28-1.65-.58-1.73L11 10l4.85-6.76c.22-.31.19-.74-.08-1.01-.3-.3-.77-.31-1.08-.02z"/>
        </svg>
      </div>
    )
  } else {
    return (
      <div className="w-12 h-12 bg-gradient-to-br from-[#b8f772] to-[#a3e85c] rounded-2xl flex items-center justify-center shadow-lg">
        <svg className="text-white w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
        </svg>
      </div>
    )
  }
}

// ChallengeCard
function ChallengeCard({ challenge, onFeedback, timeLeft, completed }) {
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)
  const difficultyStyle = getDifficultyStyle(challenge.difficulty)
  
  useEffect(() => {
    if (completed) {
      setShowPointsAnimation(true)
      const timer = setTimeout(() => {
        setShowPointsAnimation(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [completed])

  if (!challenge) return null
  
  return (
    <div className="relative">
      {/* Main Card */}
      <div
  className={`
    bg-[#fcfbec] rounded-2xl p-6
    border-2 border-black
    backdrop-blur-sm 
    shadow-[0_6px_0_rgba(0,0,0,0.8)]
    transition-all duration-300
    ${completed ? 'opacity-95' : 'hover:shadow-[0_8px_0_rgba(0,0,0,0.8)] hover:scale-[1.02]'}
  `}
  style={{ fontFamily: 'Nunito Sans, sans-serif' }}
>
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="currentColor" className="text-[#b8f772]"/>
          </svg>
        </div>

        {/* Header Section */}
<div className="flex items-start justify-between mb-6">
  {/* Left: Icon and Title */}
  <div className="flex items-center flex-1 gap-4">
    {getChallengeIcon(challenge.title)}
    <div>
      <div className="flex items-center gap-3">
        <h3 
          className="text-xl font-bold text-[#191b40] leading-tight"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {challenge.title}
        </h3>
        {completed && (
          <div className="w-8 h-8 bg-[#fcfbec]/70 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-sm text-white">✓</span>
          </div>
        )}
      </div>
      <p className="text-[#191b40] opacity-60 text-sm mt-1">Today's Climate Action</p>
    </div>
  </div>

  {/* Timer and Difficulty Badges (right side of header) */}
<div className="flex items-center gap-6 ml-auto">
  {/* Timer Icon with Tooltip */}
  <div className="flex items-center gap-2">
    <div className="relative group">
      <svg
        className="w-5 h-5 text-[#b8f772]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        Time remaining
      </div>
    </div>
    <p className="text-sm font-medium text-[#191b40]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
      {timeLeft}
    </p>
  </div>

  {/* Difficulty Icon with Tooltip */}
  {challenge.difficulty && (
    <div className="flex items-center gap-2">
      <div className="relative group">
        <div className={`w-5 h-5 flex items-center justify-center ${difficultyStyle.bg} rounded`}>
          <span className="text-xs">{difficultyStyle.icon}</span>
        </div>
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          {challenge.difficulty} difficulty
        </div>
      </div>
      <p className="text-sm text-[#191b40] font-medium capitalize">
        {challenge.difficulty}
      </p>
    </div>
  )}
</div>
</div>


        {/* Description */}
        <div className="mb-6">
  <h4 
    className="text-sm font-bold text-[#191b40] mb-3 opacity-100" 
    style={{ fontFamily: 'Poppins, sans-serif' }}
  >
    Challenge Description
  </h4>
  <p 
    className="text-[#191b40] leading-relaxed text-xs"
    style={{ fontFamily: 'Poppins, sans-serif' }}
  >
    {challenge.description}
  </p>
</div>


       {/* Impact Section */}
{challenge.impact && (
  <div className="mb-4">
    <div className="bg-[#f5f9ed] rounded-xl p-4 border-l-4 border-[#b8f772]">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-9 h-9 bg-gradient-to-br from-[#b8f772] to-[#a3e85c] rounded-xl flex items-center justify-center shadow-md">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-white">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1">
          <h4
            className="text-sm font-semibold text-[#191b40] mb-1"
            style={{ fontFamily: 'Lexend Deca, sans-serif' }}
          >
            Environmental Impact
          </h4>
          <p className="text-xs text-[#191b40] opacity-100 leading-snug" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {challenge.impact}
          </p>
        </div>
      </div>
    </div>
  </div>
)}

{/* Bottom Section */}
<div className="flex items-center justify-between mt-4">
  {/* Points Display */}
  <div className="flex items-center gap-2">
    <div className="flex items-center justify-center w-9 h-9 shadow-md bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl">
      <span className="text-lg text-white">🏆</span>
    </div>
    <div>
      <p className="text-[11px] font-medium text-[#191b40] opacity-60 leading-tight">
        Reward Points
      </p>
      <p className="text-lg font-bold text-[#191b40]" style={{ fontFamily: 'Poppins, sans-serif' }}>
        +{challenge.points || 50}
      </p>
    </div>
  </div>

  {/* Action Button */}
  <button
    className={`
      px-10 py-4 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md
      ${completed 
        ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed' 
        : 'bg-gradient-to-r from-[#b8f772] to-[#a3e85c] text-[#191b40] hover:shadow-lg hover:scale-[1.02] active:scale-95'
      }
    `}
    onClick={completed ? undefined : onFeedback}
    disabled={completed}
    style={{ fontFamily: 'Lexend Deca, sans-serif' }}
  >
    {completed ? '✅ Completed' : ' Accept Challenge'}
  </button>
</div>


        {/* Points Animation Overlay */}
        {showPointsAnimation && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl">
            <div className="text-center animate-bounce">
              <div className="mb-4 text-6xl">🎉</div>
              <div className="text-3xl font-bold text-[#191b40] mb-2" style={{ fontFamily: 'Lexend Deca, sans-serif' }}>
                +{challenge.points || 50} Points!
              </div>
              <div className="text-lg text-[#191b40] opacity-80">Challenge Completed!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DailyChallenge({ onChallengeComplete }) {
  const [challenge, setChallenge] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [timerStopped, setTimerStopped] = useState(false)

  // Function to fetch a new challenge
  const fetchNewChallenge = () => {
    setLoading(true)
    setError(null)
    setTimerStopped(false)
    fetchChallenges()
      .then(data => {
        const ch = Array.isArray(data) ? data[0] : data
        setChallenge(ch)
        setTimeLeft(ch?.time_remaining?.total_seconds || 24 * 60 * 60)
        setCompleted(false)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load challenge.')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchNewChallenge()
  }, [])

  useEffect(() => {
    if (!challenge || timerStopped) return
    if (timeLeft <= 0) {
      setTimeout(() => {
        fetchNewChallenge()
      }, 1000)
      return
    }
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timeLeft, challenge, timerStopped])

  const handleProofSubmit = ({ desc, img }) => {
    setModalOpen(false)
    setCompleted(true)
    setTimerStopped(true)
    
    const completedChallenge = {
      challenge,
      proof: { desc, img },
      completedAt: new Date(),
    }
    
    onChallengeComplete(completedChallenge)
    
    setTimeout(() => {
      setSuccessOpen(true)
    }, 1500)
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-[#f8f9fa] rounded-3xl p-12 shadow-xl flex items-center justify-center min-h-[400px] border border-[#b8f772]/20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#b8f772] border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
          <span className="text-xl font-bold text-[#191b40]" style={{ fontFamily: 'Lexend Deca, sans-serif' }}>
            Loading Today's Challenge...
          </span>
        </div>
      </div>
    )
  }

  if (error || !challenge) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-12 shadow-xl flex items-center justify-center min-h-[400px] border border-red-200">
        <div className="text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <span className="text-xl font-bold text-red-600" style={{ fontFamily: 'Lexend Deca, sans-serif' }}>
            {error || "No challenge available"}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Completion Banner */}
      {completed && (
        <div className="bg-gradient-to-r from-[#b8f772] to-[#a3e85c] rounded-2xl p-6 shadow-lg border border-[#b8f772]/30">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🎯</div>
            <div>
              <h3 className="text-xl font-bold text-[#191b40]" style={{ fontFamily: 'Lexend Deca, sans-serif' }}>
                Challenge Completed!
              </h3>
              <p className="text-[#191b40] opacity-90">
                Great job! Come back tomorrow for a new environmental challenge.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Card */}
      <ChallengeCard
        challenge={challenge}
        onFeedback={() => setModalOpen(true)}
        timeLeft={formatTime(timeLeft > 0 ? timeLeft : 0)}
        completed={completed}
      />
      
      <FeedbackModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleProofSubmit}
      />
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
    </div>
  )
}