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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#191b40] mb-1">
            {challenge?.title || 'Unknown Challenge'}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {challenge?.description || 'No description available'}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Completed on {formatDate(completedAt)}</span>
            {challenge?.points && (
              <>
                <span>•</span>
                <span className="px-2 py-1 bg-[#b8f772] text-[#191b40] rounded-full font-semibold">
                  +{challenge.points} pts
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <span className="text-2xl">✅</span>
        </div>
      </div>
      
      {/* Proof Section */}
      {(proof?.desc || imageUrl) && (
        <div className="border-t border-gray-100 pt-3 mt-3">
          <h4 className="text-sm font-medium text-[#191b40] mb-2">Proof Submitted:</h4>
          
          {/* Image Proof */}
          {imageUrl && (
            <div className="mb-3">
              <img
                src={imageUrl}
                alt="Challenge proof"
                className="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.target.style.display = 'none'
                  console.error('Failed to load image:', imageUrl)
                }}
              />
            </div>
          )}
          
          {/* Text Proof */}
          {proof?.desc && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                {proof.desc}
              </p>
            </div>
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
      <div className="bg-white rounded-xl shadow p-6 border border-[#b8f772] mt-6">
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
    <div className="bg-white rounded-xl shadow p-6 border border-[#b8f772] mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#191b40]">Challenge History</h2>
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