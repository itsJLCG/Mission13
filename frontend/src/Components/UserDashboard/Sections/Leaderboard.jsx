import React from 'react'

export default function Leaderboard({ currentUserPoints }) {
  // Mock leaderboard data - replace with real data from API
  const mockLeaderboard = [
    { name: 'EcoWarrior23', points: 1250 },
    { name: 'GreenThumb', points: 1180 },
    { name: 'NatureLover', points: 1050 },
    { name: 'TreeHugger', points: 950 },
    { name: 'You', points: currentUserPoints },
    { name: 'EcoFriend', points: 800 },
    { name: 'PlantMom', points: 750 }
  ]
  
  // Sort by points and find user rank
  const sortedBoard = mockLeaderboard.sort((a, b) => b.points - a.points)
  const userRank = sortedBoard.findIndex(user => user.name === 'You') + 1
  
  return (
    <div className="bg-white rounded-xl shadow p-4 border border-[#b8f772]">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#191b40] font-bold text-sm">👥 Leaderboard</span>
      </div>
      <div className="text-xs text-[#191b40] mb-3">
        You're #{userRank} this week in Eco Points!
      </div>
      <div className="space-y-2">
        {sortedBoard.slice(0, 5).map((user, idx) => (
          <div 
            key={idx} 
            className={`
              flex items-center justify-between text-xs p-2 rounded
              ${user.name === 'You' ? 'bg-[#b8f772] text-[#191b40] font-bold' : 'bg-gray-50'}
            `}
          >
            <span className="flex items-center gap-2">
              <span className="font-bold">#{idx + 1}</span>
              <span>{user.name}</span>
            </span>
            <span className="font-semibold">{user.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}