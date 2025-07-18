import React from 'react'

// History Card Component
function HistoryCard({ challenge, proof, completedAt }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid date'
    }
  }

  // Safe image URL creation
  const getImageUrl = (imageData) => {
    if (!imageData) return null
    
    try {
      // Check if it's a File object
      if (imageData instanceof File) {
        return URL.createObjectURL(imageData)
      }
      
      // Check if it's a blob
      if (imageData instanceof Blob) {
        return URL.createObjectURL(imageData)
      }
      
      // Check if it's already a URL string
      if (typeof imageData === 'string' && imageData.startsWith('http')) {
        return imageData
      }
      
      // Check if it's a data URL
      if (typeof imageData === 'string' && imageData.startsWith('data:')) {
        return imageData
      }
      
      // If none of the above, return null
      return null
    } catch (error) {
      console.error('Error creating image URL:', error)
      return null
    }
  }

  const imageUrl = getImageUrl(proof?.img)

  return (
<div
  className="
    bg-white rounded-xl border border-gray-300
    p-4 sm:p-5
    shadow-[0_4px_0_rgba(0,0,0,0.5)]
    transition-all duration-200
    space-y-3
  "
  style={{ fontFamily: 'Poppins, sans-serif' }}
>
      {/* Title + Description + Metadata */}
<div className="flex items-start justify-between gap-4">
  <div className="flex-1">
    <h3 className="text-base font-semibold text-[#191b40] mb-1">
      {challenge?.title || 'Unknown Challenge'}
    </h3>
    <p className="text-sm text-gray-600 leading-snug mb-1">
      {challenge?.description || 'No description available'}
    </p>
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span>{formatDate(completedAt)}</span>
      {challenge?.points && (
        <>
          <span>•</span>
          <span className="px-2 py-0.5 bg-[#b8f772] text-[#191b40] rounded-full font-medium">
            +{challenge.points} pts
          </span>
        </>
      )}
    </div>
  </div>
  <div className="text-xl flex-shrink-0">✅</div>
</div>

      
      {/* Proof Section */}
      {(proof?.desc || imageUrl) && (
  <div className="border-t border-gray-100 pt-3 mt-1 space-y-2">
    <h4 className="text-sm font-medium text-[#191b40]">Proof Submitted:</h4>

    {imageUrl && (
      <img
        src={imageUrl}
        alt="Proof"
        className="w-full max-w-xs h-24 object-cover rounded-md border border-gray-200"
      />
    )}

    {proof?.desc && (
      <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-3 leading-snug">
        {proof.desc}
      </p>
    )}
  </div>
)}

    </div>
  )
}

// Main Challenge History Component
export default function ChallengeHistory({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 border border-[#b8f772] mt-1">
        <h2 className="text-xl font-bold text-[#191b40] mb-4">Challenge History</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="text-lg font-semibold text-[#191b40] mb-2">No challenges completed yet</h3>
          <p className="text-gray-600">Start your eco-journey by completing today's challenge!</p>
        </div>
      </div>
    )
  }

  // Sort history by completion date (newest first)
  const sortedHistory = [...history].sort((a, b) => {
    const dateA = new Date(a.completedAt || 0)
    const dateB = new Date(b.completedAt || 0)
    return dateB - dateA
  })

return (
  <div
    className="
      bg-[#fcfbec] rounded-2xl p-6
      border-2 border-black
      backdrop-blur-sm
      shadow-[0_6px_0_rgba(0,0,0,0.8)]
      transition-all duration-300 mt-1
    "
    style={{ fontFamily: 'Nunito Sans, sans-serif' }}
  >
    <div className="flex items-center justify-between mb-6">
<h2
  className="text-xl font-bold text-[#191b40]"
  style={{ fontFamily: 'Poppins, sans-serif' }}
>
  Challenge History
</h2>
      <span className="px-3 py-1 bg-[#b8f772] text-[#191b40] rounded-full text-sm font-semibold">
        {history.length} Completed
      </span>
    </div>

    <div className="space-y-4 max-h-96 overflow-y-auto">
      {sortedHistory.map((item, index) => (
        <HistoryCard
          key={`${item.challenge?.id || index}-${item.completedAt || index}`}
          challenge={item.challenge}
          proof={item.proof}
          completedAt={item.completedAt}
        />
      ))}
    </div>
  </div>
)

}