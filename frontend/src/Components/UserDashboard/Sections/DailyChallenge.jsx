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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#f1f3f0] rounded-2xl p-8 w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-[#020202] hover:text-[#b8f772] text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >×</button>
        <h2 className="text-xl font-bold mb-4 text-[#191b40]">Submit Proof</h2>
        <form
          onSubmit={e => {
            e.preventDefault()
            onSubmit({ desc, img })
          }}
          className="flex flex-col gap-4"
        >
          <label className="font-semibold text-[#191b40]">
            Description
            <textarea
              className="mt-1 w-full rounded-lg border border-[#b8f772] p-2 bg-white"
              rows={3}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              required
            />
          </label>
          <label className="font-semibold text-[#191b40]">
            Proof Image
            <input
              type="file"
              accept="image/*"
              className="block mt-1"
              onChange={e => setImg(e.target.files[0])}
              required
            />
          </label>
          <button
            type="submit"
            className="mt-2 px-4 py-2 rounded-full bg-[#b8f772] text-[#191b40] font-bold hover:bg-[#d6ff8f] transition"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#f1f3f0] rounded-2xl p-8 w-full max-w-xs shadow-lg flex flex-col items-center relative">
        <button
          className="absolute top-3 right-3 text-[#020202] hover:text-[#b8f772] text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >×</button>
        <div className="flex flex-col items-center">
          <span className="text-5xl text-[#b8f772] mb-2">✔️</span>
          <span className="text-lg font-bold text-[#191b40] mb-2">Challenge Completed!</span>
          <button
            className="mt-2 px-4 py-2 rounded-full bg-[#b8f772] text-[#191b40] font-bold hover:bg-[#d6ff8f] transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Function to get icon based on challenge title/type
function getChallengeIcon(title) {
  const titleLower = title.toLowerCase()
  
  if (titleLower.includes('recycle') || titleLower.includes('waste')) {
    return (
      <svg className="w-6 h-6 text-[#b8f772]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    )
  } else if (titleLower.includes('water') || titleLower.includes('save')) {
    return (
      <svg className="w-6 h-6 text-[#b8f772]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zM12 20c-3.35 0-6-2.57-6-5.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.8 6 9.14 0 2.63-2.65 5.2-6 5.2z"/>
      </svg>
    )
  } else if (titleLower.includes('energy') || titleLower.includes('electric') || titleLower.includes('power')) {
    return (
      <svg className="w-6 h-6 text-[#b8f772]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.69 2.21L4.33 11.49c-.64.58-.28 1.65.58 1.73L13 14l-4.85 6.76c-.22.31-.19.74.08 1.01.3.3.77.31 1.08.02l10.36-9.28c.64-.58.28-1.65-.58-1.73L11 10l4.85-6.76c.22-.31.19-.74-.08-1.01-.3-.3-.77-.31-1.08-.02z"/>
      </svg>
    )
  } else if (titleLower.includes('transport') || titleLower.includes('bike') || titleLower.includes('walk')) {
    return (
      <svg className="w-6 h-6 text-[#b8f772]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm14.8-8.5c-1.8 0-3.3-1.2-3.8-2.8l-1.7-5.3C14.1 3.1 13.4 2.5 12.6 2.5H8.8c-.8 0-1.5.6-1.7 1.4L5.4 9.2c-.3.8.2 1.6 1 1.9.8.3 1.6-.2 1.9-1l1.7-5.3h1.6L12.3 7c.3.8 1.1 1.4 1.9 1.4h3.6c.8 0 1.5-.6 1.7-1.4l1.7-5.3c.3-.8-.2-1.6-1-1.9-.8-.3-1.6.2-1.9 1l-1.7 5.3h-1.6l.7-2.2c.3-.8-.2-1.6-1-1.9-.8-.3-1.6.2-1.9 1l-.7 2.2h-1.6l1.7-5.3c.3-.8-.2-1.6-1-1.9-.8-.3-1.6.2-1.9 1L8.1 3.9c-.3.8.2 1.6 1 1.9.8.3 1.6-.2 1.9-1l1.7-5.3h1.6l-.7 2.2c-.3.8.2 1.6 1 1.9.8.3 1.6-.2 1.9-1l.7-2.2h1.6l-1.7 5.3c-.3.8.2 1.6 1 1.9.8.3 1.6-.2 1.9-1l1.7-5.3h3.6c.8 0 1.5.6 1.7 1.4l1.7 5.3c.5 1.6 2 2.8 3.8 2.8 2.8 0 5-2.2 5-5s-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
      </svg>
    )
  } else if (titleLower.includes('plant') || titleLower.includes('garden') || titleLower.includes('grow')) {
    return (
      <svg className="w-6 h-6 text-[#b8f772]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0-1.38 1.12-2.5 2.5-2.5.53 0 1.01.16 1.42.44l-.02.19c0 1.38-1.12 2.5-2.5 2.5-.53 0-1.01-.16-1.42-.44l.02-.19zM12 5.25c0-1.38 1.12-2.5 2.5-2.5.53 0 1.01.16 1.42.44l-.02.19c0 1.38-1.12 2.5-2.5 2.5-.53 0-1.01-.16-1.42-.44l.02-.19z"/>
      </svg>
    )
  } else if (titleLower.includes('food') || titleLower.includes('eat') || titleLower.includes('organic')) {
    return (
      <svg className="w-6 h-6 text-[#b8f772]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-.78-.78-2.05-.78-2.83 0l-.01.01c-.78.78-.78 2.05 0 2.83l7.02 7.02zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
      </svg>
    )
  } else if (titleLower.includes('clean') || titleLower.includes('pollution')) {
    return (
      <svg className="w-6 h-6 text-[#b8f772]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    )
  } else {
    // Default eco-friendly icon
    return (
      <svg className="w-6 h-6 text-[#b8f772]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
      </svg>
    )
  }
}

// ChallengeCard
function ChallengeCard({ challenge, onFeedback, timeLeft, completed }) {
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)
  
  useEffect(() => {
    if (completed) {
      // Trigger points animation when challenge is completed
      setShowPointsAnimation(true)
      const timer = setTimeout(() => {
        setShowPointsAnimation(false)
      }, 3000) // Animation lasts 3 seconds
      return () => clearTimeout(timer)
    }
  }, [completed])

  if (!challenge) return null
  
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 transition relative
        border-2 border-transparent
        ${completed ? 'opacity-90 bg-[#f1f3f0]' : 'hover:border-[#b8f772] hover:shadow-lg'}
      `}
      style={{ minWidth: 260, fontFamily: 'Poppins, Lexend Deca, Nunito Sans, sans-serif' }}
    >
      {/* Timer - Upper Right */}
      <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-[#191b40] font-semibold">
        <svg className="w-4 h-4" fill="none" stroke="#b8f772" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#b8f772" />
          <path d="M12 6v6l4 2" stroke="#191b40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {timeLeft}
      </div>

      {/* Points Animation */}
      {showPointsAnimation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="animate-bounce">
            <div className="bg-[#b8f772] text-[#191b40] px-4 py-2 rounded-full font-bold text-lg shadow-lg animate-pulse">
              +{challenge.points || 50} pts! 🎉
            </div>
          </div>
        </div>
      )}

      {/* Title with Icon and Completed Check */}
      <div className="flex items-center gap-2 pr-16">
        {/* Challenge Icon */}
        <div className="flex-shrink-0">
          {getChallengeIcon(challenge.title)}
        </div>
        <span className="text-lg font-bold text-[#191b40]">{challenge.title}</span>
        {completed && (
          <span className="ml-2 text-[#b8f772] text-xl" title="Completed">✔️</span>
        )}
      </div>

      {/* Description */}
      <div className="text-sm text-[#191b40] opacity-80 pr-4">
        {challenge.description}
      </div>

      {/* Bottom Section - Points and Button */}
      <div className="flex items-center justify-between mt-4">
        {/* Points Badge */}
        <span className="px-3 py-1 rounded-full bg-[#b8f772] text-[#191b40] text-xs font-bold">
          +{challenge.points || 50} pts
        </span>
        
        {/* Challenge Button - Right Side */}
        <button
          className={`
            px-6 py-2 rounded-full font-semibold text-[#191b40] transition
            focus:outline-none
            ${completed 
              ? 'bg-[#b8f772] opacity-80 cursor-not-allowed' 
              : 'bg-[#b8f772] hover:bg-[#d6ff8f] hover:scale-105 active:scale-95'
            }
          `}
          onClick={completed ? undefined : onFeedback}
          disabled={completed}
        >
          {completed ? 'Challenge Successful' : 'Accept Challenge'}
        </button>
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
  const [proof, setProof] = useState({ img: null, desc: '' })
  const [showProofModal, setShowProofModal] = useState(false)

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

  // Initial fetch challenge on component mount
  useEffect(() => {
    fetchNewChallenge()
  }, [])

  // Timer countdown with auto-fetch when time expires
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

  const handleCompleteChallenge = () => {
    if (onChallengeComplete) {
      const completedChallenge = {
        challenge,
        proof,
        completedAt: new Date().toISOString()
      }
      
      onChallengeComplete(completedChallenge)
      
      // Update streak
      streakManager.updateStreakOnChallenge()
      
      // Dispatch event to update header
      window.dispatchEvent(new CustomEvent('streakUpdated'))
    }
    
    setShowProofModal(false)
    setProof({ img: null, desc: '' })
  }

  const handleProofSubmit = ({ desc, img }) => {
    setModalOpen(false)
    setCompleted(true)
    setTimerStopped(true)
    
    const completedChallenge = {
      challenge,
      proof: { desc, img },
      completedAt: new Date(),
    }
    
    // Notify parent component
    onChallengeComplete(completedChallenge)
    
    setTimeout(() => {
      setSuccessOpen(true)
    }, 1500)
  }

  const handleSuccessClose = () => {
    setSuccessOpen(false)
  }

  if (loading) {
    return (
      <div className="bg-[#f1f3f0] rounded-3xl p-8 shadow-lg flex items-center justify-center min-h-[200px]">
        <span className="text-[#191b40] font-bold">Loading challenge...</span>
      </div>
    )
  }

  if (error || !challenge) {
    return (
      <div className="bg-[#f1f3f0] rounded-3xl p-8 shadow-lg flex items-center justify-center min-h-[200px]">
        <span className="text-red-600 font-bold">{error || "No challenge available."}</span>
      </div>
    )
  }

  return (
    <div>
      {/* Daily Challenge Information - Only show when challenge is completed */}
      {completed && (
        <div className="bg-[#b8f772] rounded-xl p-4 mb-6 border-l-4 border-[#191b40]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#191b40] font-bold text-sm">📅 Daily Challenge Info</span>
          </div>
          <p className="text-[#191b40] text-sm opacity-90">
            Challenge completed! Come back tomorrow for a new one! 🌱
          </p>
        </div>
      )}

      <div className="bg-[#f1f3f0] rounded-3xl p-8 shadow-lg mb-8">
        <ChallengeCard
          challenge={challenge}
          onFeedback={() => setModalOpen(true)}
          timeLeft={formatTime(timeLeft > 0 ? timeLeft : 0)}
          completed={completed}
        />
      </div>
      
      <FeedbackModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleProofSubmit}
      />
      <SuccessModal
        open={successOpen}
        onClose={handleSuccessClose}
      />
    </div>
  )
}