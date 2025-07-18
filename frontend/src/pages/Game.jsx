
import React, { useState, useEffect } from 'react'
import UserHeader from '../Components/UserDashboard/UserHeader'
import Sidebar from '../Components/UserDashboard/Sidebar'
import '../styles/Game.css' // Import game-specific styles

const Game = () => {
  // Default open on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024)
  const [gameStats, setGameStats] = useState({
    level: 1,
    ecoPoints: 150,
    buildingsBuilt: 8,
    solarPanelsInstalled: 12,
    co2Reduced: 245,
    renewableEnergy: 67
  })

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth <= 1024) {
        const sidebar = document.querySelector('.grass-sidebar')
        const toggleBtn = document.querySelector('.sidebar-toggle')
        
        if (sidebar && !sidebar.contains(event.target) && 
            toggleBtn && !toggleBtn.contains(event.target)) {
          setSidebarOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [sidebarOpen])

 

  return (
    <div className="dashboard-container flex relative">
      {/* Mobile Toggle Button */}
     

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Main Content - Properly positioned next to sidebar */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          window.innerWidth > 1024 ? 'ml-[280px]' : 'ml-0'
        } lg:ml-[280px]`}
        style={{
          marginLeft: window.innerWidth > 1024 ? '280px' : '0'
        }}
      >
        <UserHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6 pt-16 lg:pt-6">
          <section className="my-8 mx-auto max-w-7xl px-4">
            {/* Header */}
           
          </section>
        </main>
      </div>
    </div>
  )
}


export default Game