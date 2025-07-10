import React, { useState } from 'react'
import UserHeader from '../Components/UserDashboard/UserHeader'
import Sidebar from '../Components/UserDashboard/Sidebar'

const Game = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [gameStats, setGameStats] = useState({
    level: 1,
    ecoPoints: 150,
    buildingsBuilt: 8,
    solarPanelsInstalled: 12,
    co2Reduced: 245,
    renewableEnergy: 67
  })

  // Define tools with unlock requirements
  const buildingTools = [
    { id: 'home', icon: '🏠', name: 'Build Home', unlocked: true, requiredPoints: 0 },
    { id: 'road', icon: '🛣️', name: 'Build Road', unlocked: true, requiredPoints: 0 },
    { id: 'commercial', icon: '🏢', name: 'Commercial', unlocked: gameStats.ecoPoints >= 100, requiredPoints: 100 },
    { id: 'electric-car', icon: '🚗', name: 'Electric Car', unlocked: gameStats.ecoPoints >= 200, requiredPoints: 200 },
    { id: 'infrastructure', icon: '🏭', name: 'Infrastructure', unlocked: gameStats.ecoPoints >= 300, requiredPoints: 300 },
  ]

  // Define eco inventory with unlock requirements
  const ecoInventory = [
    { id: 'solar', icon: '☀️', name: 'Solar Panels', unlocked: true, requiredPoints: 0 },
    { id: 'wind', icon: '💨', name: 'Wind Turbines', unlocked: gameStats.ecoPoints >= 80, requiredPoints: 80 },
    { id: 'recycle', icon: '♻️', name: 'Recycling Bins', unlocked: gameStats.ecoPoints >= 120, requiredPoints: 120 },
    { id: 'charger', icon: '🔌', name: 'Electric Chargers', unlocked: gameStats.ecoPoints >= 160, requiredPoints: 160 },
    { id: 'green-roof', icon: '🌿', name: 'Green Roofs', unlocked: gameStats.ecoPoints >= 200, requiredPoints: 200 },
    { id: 'rain-collector', icon: '🌧️', name: 'Rain Collectors', unlocked: gameStats.ecoPoints >= 250, requiredPoints: 250 },
    { id: 'led-lights', icon: '💡', name: 'LED Lights', unlocked: gameStats.ecoPoints >= 100, requiredPoints: 100 },
    { id: 'bike-lane', icon: '🚴', name: 'Bike Lanes', unlocked: gameStats.ecoPoints >= 140, requiredPoints: 140 },
    { id: 'compost', icon: '🗑️', name: 'Compost Bins', unlocked: gameStats.ecoPoints >= 180, requiredPoints: 180 },
  ]

  return (
    <div className="flex min-h-screen bg-[#eaf6ec]">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <UserHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          <section className="my-8 mx-auto max-w-7xl px-4">
            {/* Header */}
            <div
              className="mb-6 flex items-center justify-between"
              style={{ fontFamily: 'Lexend Deca, Poppins, Nunito Sans, sans-serif' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-[#191b40]">Eco City Builder</span>
                <span className="px-3 py-1 rounded-full bg-[#b8f772] text-[#191b40] text-xs font-semibold">Level {gameStats.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-[#191b40]">Eco Points:</span>
                <span className="text-3xl font-bold text-[#b8f772] bg-[#191b40] px-4 py-2 rounded-full">
                  {gameStats.ecoPoints}
                </span>
              </div>
            </div>
            
            {/* Game Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Left Sidebar - Building Tools */}
              <div className="lg:col-span-1 space-y-4">
                {/* Building Tools Panel */}
                <div className="bg-white rounded-xl shadow p-4 border border-[#b8f772]">
                  <h3 className="text-lg font-bold text-[#191b40] mb-3 flex items-center gap-2">
                    🏗️ Building Tools
                  </h3>
                  <div className="space-y-2">
                    {buildingTools.map((tool) => (
                      <button
                        key={tool.id}
                        className={`w-full p-3 rounded-lg transition text-left relative group ${
                          tool.unlocked 
                            ? 'bg-[#f1f3f0] hover:bg-[#b8f772] cursor-pointer' 
                            : 'bg-gray-100 cursor-not-allowed opacity-50'
                        }`}
                        disabled={!tool.unlocked}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tool.icon}</span>
                          <span className="text-sm font-semibold text-[#191b40]">{tool.name}</span>
                          {!tool.unlocked && (
                            <span className="ml-auto text-xs text-red-500">🔒</span>
                          )}
                        </div>
                        {/* Tooltip for locked items */}
                        {!tool.unlocked && (
                          <div className="absolute left-0 top-full mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                            Not enough points (need {tool.requiredPoints})
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eco Inventory */}
                <div className="bg-white rounded-xl shadow p-4 border border-[#b8f772]">
                  <h3 className="text-lg font-bold text-[#191b40] mb-3 flex items-center gap-2">
                    🌱 Eco Inventory
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {ecoInventory.map((item) => (
                      <div
                        key={item.id}
                        className={`aspect-square rounded-lg flex items-center justify-center text-2xl relative group ${
                          item.unlocked 
                            ? 'bg-[#f1f3f0] hover:bg-[#b8f772] cursor-pointer' 
                            : 'bg-gray-100 cursor-not-allowed opacity-50'
                        }`}
                        title={item.unlocked ? item.name : `Locked: Need ${item.requiredPoints} points`}
                      >
                        {item.icon}
                        {!item.unlocked && (
                          <span className="absolute top-0 right-0 text-xs">🔒</span>
                        )}
                        {/* Tooltip for locked items */}
                        {!item.unlocked && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-red-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                            Not enough points
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Game Container */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow border border-[#b8f772] overflow-hidden">
                  <div className="bg-[#b8f772] px-4 py-3 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#191b40] flex items-center gap-2">
                      🌍 Your Eco City
                    </h2>
                  </div>
                  
                  {/* GAME CONTAINER - Modern Drag & Drop Interface */}
                  <div className="w-full h-[600px] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] relative overflow-hidden border-4 border-dashed border-[#b8f772]/30">
                    {/* Grid Pattern Background */}
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `
                          linear-gradient(#b8f772 1px, transparent 1px),
                          linear-gradient(90deg, #b8f772 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px'
                      }}
                    />
                    
                    {/* Drag & Drop Instructions */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center  backdrop-blur-sm rounded-2xl p-8 border border-[#b8f772]/20">
                        <h3 className="text-xl font-bold text-[#191b40] mb-2">Drag & Drop Interface</h3>
                        <p className="text-[#191b40] opacity-70 text-sm mb-3">
                          Drag items from your inventory to build your eco-friendly city
                        </p>
                        <div className="flex items-center justify-center gap-4 text-xs text-[#191b40] opacity-60">
                          <span className="flex items-center gap-1">
                            <span>🖱️</span>
                            <span>Click & Drag</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span>📍</span>
                            <span>Drop to Place</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Corner Indicators */}
                    <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-[#b8f772] rounded-tl-lg"></div>
                    <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-[#b8f772] rounded-tr-lg"></div>
                    <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-[#b8f772] rounded-bl-lg"></div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-[#b8f772] rounded-br-lg"></div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Environmental Impact */}
              <div className="lg:col-span-1 space-y-4">
                {/* Environmental Impact */}
                <div className="bg-white rounded-xl shadow p-4 border border-[#b8f772]">
                  <h3 className="text-lg font-bold text-[#191b40] mb-3 flex items-center gap-2">
                    🌍 Environmental Impact
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-[#191b40]">Air Quality</span>
                        <span className="text-xs text-green-600 font-bold">Excellent</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-[92%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-[#191b40]">Renewable Energy</span>
                        <span className="text-xs text-[#191b40]">{gameStats.renewableEnergy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[#b8f772] h-2 rounded-full w-2/3"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-[#191b40]">Carbon Neutral</span>
                        <span className="text-xs text-[#191b40]">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Game Tips */}
                <div className="bg-white rounded-xl shadow p-4 border border-[#b8f772]">
                  <h3 className="text-lg font-bold text-[#191b40] mb-3 flex items-center gap-2">
                    💡 Tips
                  </h3>
                  <div className="space-y-2 text-sm text-[#191b40]">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Complete challenges to earn more eco points</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Unlock new tools and items with points</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Build renewable energy sources first</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Balance city growth with sustainability</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Game