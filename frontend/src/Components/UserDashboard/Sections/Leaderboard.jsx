import React from 'react'

export default function Leaderboard({ currentUserPoints = 0 }) {
  // Use REAL user points, not hardcoded data
  const mockLeaderboard = [
    { name: 'EcoWarrior23', points: 1250 },
    { name: 'GreenThumb', points: 1180 },
    { name: 'NatureLover', points: 1050 },
    { name: 'TreeHugger', points: 950 },
    { name: 'You', points: currentUserPoints }, // Use actual user points
    { name: 'EcoFriend', points: 800 },
    { name: 'PlantMom', points: 750 }
  ]
  
  // Sort by points and find user rank
  const sortedBoard = mockLeaderboard.sort((a, b) => b.points - a.points)
  const userRank = sortedBoard.findIndex(user => user.name === 'You') + 1
  
  return (
<div
  className="bg-[#fcfbec] rounded-2xl p-6 border-2 border-black backdrop-blur-sm shadow-[0_6px_0_rgba(0,0,0,0.8)] transition-all duration-300"
  style={{ fontFamily: 'Poppins, sans-serif' }}
>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#191b40] font-bold text-sm">👥 Leaderboard</span>
      </div>
      <div className="text-xs text-[#191b40] mb-3">
        {currentUserPoints > 0 
          ? `You're #${userRank} this week in Eco Points!`
          : 'Complete challenges to see your ranking!'
        }
      </div>
      <div className="space-y-2">
      {sortedBoard.slice(0, 5).map((user, idx) => {
  const rank = idx + 1

  // Default styles
  let bgColor = 'bg-gray-50'
  let textColor = 'text-[#191b40]'
  let pointColor = 'text-gray-600'
  let hoverEffect = 'hover:bg-gray-100'

  // Style by rank
  if (rank === 1) {
    bgColor = 'bg-[#184b3e]'
    textColor = 'text-white'
    pointColor = 'text-white'
    hoverEffect = 'hover:brightness-110'
  } else if (rank === 2) {
    bgColor = 'bg-[#599645]'
    textColor = 'text-white'
    pointColor = 'text-white'
    hoverEffect = 'hover:brightness-110'
  } else if (rank === 3) {
    bgColor = 'bg-[#d8e84e]'
    textColor = 'text-[#191b40]'
    pointColor = 'text-[#191b40]'
    hoverEffect = 'hover:brightness-105'
  } else if (user.name === 'You') {
    bgColor = 'bg-[#b8f772]'
    textColor = 'text-[#191b40]'
    pointColor = 'text-[#191b40]'
    hoverEffect = 'hover:bg-[#a3e85c]'
  }

  return (
    <div
      key={idx}
      className={`flex items-center justify-between text-sm p-2 rounded ${bgColor} ${textColor} font-medium transition-all duration-200 ${hoverEffect}`}
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <span className="flex items-center gap-2">
        <span className="font-bold">#{rank}</span>
        <span>{user.name}</span>
      </span>
      <span className={`font-semibold ${pointColor}`}>{user.points} pts</span>
    </div>
  )
})}

      </div>
    </div>
  )
}