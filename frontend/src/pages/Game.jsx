import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../auth/AuthContext' // Add this import for user authentication
import UserHeader from '../Components/UserDashboard/UserHeader'
import Sidebar from '../Components/UserDashboard/Sidebar'
import '../styles/Game.css' // Import game-specific styles
import textureImage from '../assets/components/Mission13.png' // Import texture

const Game = () => {
  const { user } = useAuth() // Get current authenticated user
  
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

  // Isometric city game state
  const canvasRef = useRef(null)
  const fgCanvasRef = useRef(null)
  const [gameLoaded, setGameLoaded] = useState(false)
  const [tool, setTool] = useState([0, 0])
  const [activeTool, setActiveTool] = useState(null)
  const [carbonEmission, setCarbonEmission] = useState(100.0000)
  const [isPlacing, setIsPlacing] = useState(false)
  const [cityMap, setCityMap] = useState([])
  const [gameToolsOpen, setGameToolsOpen] = useState(false)
  
  // Database save/load state
  const [isLoading, setIsLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('')

  // Game constants
  const ntiles = 7
  const tileWidth = 128
  const tileHeight = 64
  const texWidth = 12
  const texHeight = 6
  const BACKEND_URL = 'http://127.0.0.1:8000'

  // Eco tiles data
  const ecoTiles = [
    // Row 0
    { coords: [0, 0], co2Reduction: 0, title: "Blank Tile" },
    { coords: [1, 0], co2Reduction: 15, title: "Wind Turbine" },
    { coords: [2, 0], co2Reduction: 0, title: "Road" },
    { coords: [3, 0], co2Reduction: 0, title: "Road" },
    { coords: [4, 0], co2Reduction: 0, title: "Road" },
    { coords: [5, 0], co2Reduction: 0, title: "Road" },
    { coords: [6, 0], co2Reduction: 10, title: "Road with Plants" },
    { coords: [7, 0], co2Reduction: 0, title: "Road with Plants" },
    { coords: [8, 0], co2Reduction: 0, title: "Road" },
    { coords: [9, 0], co2Reduction: 0, title: "Road" },
    { coords: [10, 0], co2Reduction: 0, title: "Road" },
    { coords: [11, 0], co2Reduction: 0, title: "Road" },
    // Row 1
    { coords: [0, 1], co2Reduction: 0, title: "Road" },
    { coords: [1, 1], co2Reduction: 0, title: "Road" },
    { coords: [2, 1], co2Reduction: 0, title: "Road" },
    { coords: [3, 1], co2Reduction: 4, title: "Public Transport" },
    { coords: [4, 1], co2Reduction: 4, title: "Building Insulation" },
    { coords: [5, 1], co2Reduction: 1.5, title: "Biofuels" },
    { coords: [6, 1], co2Reduction: 3, title: "Cycling" },
    { coords: [7, 1], co2Reduction: 1.5, title: "Freight Modal Shift" },
    { coords: [8, 1], co2Reduction: 2, title: "Hybrid Vehicles" },
    { coords: [9, 1], co2Reduction: 2, title: "Hybrid Vehicles" },
    { coords: [10, 1], co2Reduction: 0, title: "Hybrid Vehicles" },
    { coords: [11, 1], co2Reduction: 2, title: "Hybrid Vehicles" },
    // Row 2
    { coords: [0, 2], co2Reduction: 10, title: "Afforestation" },
    { coords: [1, 2], co2Reduction: 8, title: "Avoid deforestation" },
    { coords: [2, 2], co2Reduction: 3, title: "Food waste reduction" },
    { coords: [3, 2], co2Reduction: 4, title: "Plant-based diets" },
    { coords: [4, 2], co2Reduction: 1.5, title: "District Heating" },
    { coords: [5, 2], co2Reduction: 2, title: "Recycling/materials" },
    { coords: [6, 2], co2Reduction: 1.5, title: "Cement/steel improvements" },
    { coords: [7, 2], co2Reduction: 1, title: "Biochar" },
    { coords: [8, 2], co2Reduction: 4, title: "Industrial CCS" },
    { coords: [9, 2], co2Reduction: 2.5, title: "Compact urban design" },
    { coords: [10, 2], co2Reduction: 0, title: "Street Tunnel" },
    { coords: [11, 2], co2Reduction: 0, title: "Street Tunnel" },
    // Row 3
    { coords: [0, 3], co2Reduction: 5, title: "Street Tunnel" },
    { coords: [1, 3], co2Reduction: 8, title: "Street Tunnel" },
    { coords: [2, 3], co2Reduction: 2, title: "Recycling/materials" },
    { coords: [3, 3], co2Reduction: 2, title: "Recycling/materials" },
    { coords: [4, 3], co2Reduction: 4, title: "Soil carbon sequestration" },
    { coords: [5, 3], co2Reduction: 2, title: "Landfill methane capture" },
    { coords: [6, 3], co2Reduction: 2, title: "Freight Efficiency" },
    { coords: [7, 3], co2Reduction: 5, title: "Industrial Efficiency" },
    { coords: [8, 3], co2Reduction: 3, title: "Livestock management" },
    { coords: [9, 3], co2Reduction: 2, title: "Hydrogen/electrification" },
    { coords: [10, 3], co2Reduction: 0, title: "Simple Building" },
    { coords: [11, 3], co2Reduction: 2.5, title: "Geothermal" },
    // Row 4
    { coords: [0, 4], co2Reduction: 3, title: "Plants management" },
    { coords: [1, 4], co2Reduction: 3, title: "Plants management " },
    { coords: [2, 4], co2Reduction: 1, title: "Rice methane reduction" },
    { coords: [3, 4], co2Reduction: 3, title: "Plants management " },
    { coords: [4, 4], co2Reduction: 3, title: "Plants management " },
    { coords: [5, 4], co2Reduction: 2.5, title: "Improved crop practices" },
    { coords: [6, 4], co2Reduction: 3, title: "Waste recycling " },
    { coords: [7, 4], co2Reduction: 0, title: "Simple Building" },
    { coords: [8, 4], co2Reduction: 1, title: "Wastewater treatment" },
    { coords: [9, 4], co2Reduction: 3, title: "Plants management " },
    { coords: [10, 4], co2Reduction: 2, title: "Recycling/materials" },
    { coords: [11, 4], co2Reduction: 0, title: "Plants management" },
    // Row 5
    { coords: [0, 5], co2Reduction: 0, title: "Plants management" },
    { coords: [1, 5], co2Reduction: 10, title: "Solar Power" },
    { coords: [2, 5], co2Reduction: 10, title: "Solar Power" },
    { coords: [3, 5], co2Reduction: 0, title: "Simple Building" },
    { coords: [4, 5], co2Reduction: 0, title: "Simple Building" },
    { coords: [5, 5], co2Reduction: 0, title: "Plants management" },
    { coords: [6, 5], co2Reduction: 0.5, title: "Agri-drainage improvements" },
    { coords: [7, 5], co2Reduction: 2, title: "Heat recovery & CHP" },
    { coords: [8, 5], co2Reduction: 0, title: "Simple House" },
    { coords: [9, 5], co2Reduction: 10, title: "Solar Power" },
    { coords: [10, 5], co2Reduction: 0, title: "Simple Building" },
    { coords: [11, 5], co2Reduction: 3, title: "Rooftop Solar" }
  ]

  // Backend action mapping (same as main.js)
  const tileToActionMap = {
    "Wind Turbine": "Add onshore wind",
    "Solar Power": "Add solar power",
    "Rooftop Solar": "Install rooftop solar",
    "Building Insulation": "Install building insulation",
    "Public Transport": "Use public transport",
    "Biofuels": "Use biofuels",
    "Cycling": "Use cycling & walking",
    "Hybrid Vehicles": "Use hybrid vehicles",
    "Avoid deforestation": "Avoid deforestation",
    "Park with Trees": "Avoid deforestation",
    "Afforestation": "Do afforestation",
    "Food waste reduction": "Reduce food waste",
    "Plant-based diets": "Adopt plant-based diets",
    "District Heating": "Expand district heating",
    "Recycling/materials": "Recycle materials",
    "Recycling ": "Recycle waste",
    "Waste recycling ": "Recycle waste",
    "Industrial CCS": "Apply industrial CCS",
    "Compact urban design": "Adopt compact urban design",
    "Plants management": "Manage plants",
    "Plants management ": "Manage plants",
    "Soil carbon sequestration": "Apply soil carbon sequestration",
    "Landfill methane capture": "Capture landfill methane",
    "Industrial Efficiency": "Improve industrial efficiency",
    "Freight Efficiency": "Improve freight efficiency",
    "Livestock management": "Manage livestock",
    "Hydrogen/electrification": "Use hydrogen/electrification",
    "Wastewater treatment": "Treat wastewater",
    "Water Treatment": "Treat wastewater",
    "Rice methane reduction": "Reduce rice methane",
    "Heat recovery & CHP": "Use heat recovery & CHP",
    "Agri-drainage improvements": "Improve agri-drainage",
    "Freight Modal Shift": "Shift freight modes",
    "Cement/steel improvements": "Improve cement/steel",
    "Biochar": "Apply biochar",
    "Geothermal": "Add geothermal",
    "Improved crop practices": "Use improved crop practices"
  }

  // Cache for backend CO2 reduction values
  const [co2ReductionCache] = useState(new Map())
  const [backendReductions, setBackendReductions] = useState(new Map())

  // Database Functions for MongoDB
  const saveCityMapToDatabase = async (cityMapData) => {
    if (!user || !user.email) {
      console.warn('No user logged in, cannot save city map')
      return
    }

    try {
      setSaveStatus('Saving...')
      
      const response = await fetch('http://127.0.0.1:5000/api/city-map/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          cityMap: cityMapData
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        setSaveStatus('Saved ✓')
        setTimeout(() => setSaveStatus(''), 2000)
        console.log('City map saved successfully to MongoDB')
      } else {
        setSaveStatus('Save failed')
        setTimeout(() => setSaveStatus(''), 3000)
        console.error('Failed to save city map:', data.message)
      }
    } catch (error) {
      setSaveStatus('Save failed')
      setTimeout(() => setSaveStatus(''), 3000)
      console.error('Error saving city map:', error)
    }
  }

  // New function to save carbon emission
  const saveCarbonEmissionToDatabase = async (emission) => {
    if (!user || !user.email) {
      console.warn('No user logged in, cannot save carbon emission')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/carbon-emission/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          emission: emission
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        console.log('Carbon emission saved successfully to MongoDB')
      } else {
        console.error('Failed to save carbon emission:', data.message)
      }
    } catch (error) {
      console.error('Error saving carbon emission:', error)
    }
  }

  // New function to load carbon emission
  const loadCarbonEmissionFromDatabase = async () => {
    if (!user || !user.email) {
      console.warn('No user logged in, cannot load carbon emission')
      return null
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/carbon-emission/load', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        return data.carbonEmission.emission
      } else {
        console.error('Failed to load carbon emission:', data.message)
        return null
      }
    } catch (error) {
      console.error('Error loading carbon emission:', error)
      return null
    }
  }

  const loadCityMapFromDatabase = async () => {
    if (!user || !user.email) {
      console.warn('No user logged in, cannot load city map')
      return null
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/city-map/load', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        return data.cityMap
      } else {
        console.error('Failed to load city map:', data.message)
        return null
      }
    } catch (error) {
      console.error('Error loading city map:', error)
      return null
    }
  }

  // Get backend reduction function (same as main.js)
  const getBackendReduction = async (action) => {
    if (!action) return 0.0

    if (co2ReductionCache.has(action)) {
      return co2ReductionCache.get(action)
    }

    try {
      const response = await fetch(`${BACKEND_URL}/reduction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: action })
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      if (data.error) {
        console.warn(`Backend error for action "${action}":`, data.error)
        return 0.0
      }

      const reduction = parseFloat(data.reduction_percent) || 0.0
      co2ReductionCache.set(action, reduction)
      setBackendReductions(prev => new Map(prev.set(action, reduction)))
      return reduction
    } catch (error) {
      console.error('Error calling backend:', error)
      return 0.0
    }
  }

  const getTileData = (col, row) => {
    return ecoTiles.find(tile => tile.coords[0] === col && tile.coords[1] === row)
  }

  // Updated calculateCarbonEmission to save to database
  const calculateCarbonEmission = async () => {
    let totalReduction = 0.0

    console.log('Calculating carbon emission...')

    for (let i = 0; i < ntiles; i++) {
      for (let j = 0; j < ntiles; j++) {
        const [texI, texJ] = cityMap[i][j]
        if (texI === 0 && texJ === 0) continue

        const tileData = getTileData(texJ, texI)
        if (tileData && tileData.title) {
          const backendAction = tileToActionMap[tileData.title]
          if (backendAction) {
            const reduction = await getBackendReduction(backendAction)
            totalReduction += reduction
            console.log(`Tile: ${tileData.title} -> Action: ${backendAction} -> Reduction: ${reduction}%`)
          }
        }
      }
    }

    console.log(`Total reduction: ${totalReduction.toFixed(4)}%`)

    let emission = 100.0000 - totalReduction
    emission = Math.max(5.0, Math.min(100.0, emission))

    console.log(`Final emission: ${emission.toFixed(4)}%`)

    setCarbonEmission(emission)
    
    // Save carbon emission to database
    await saveCarbonEmissionToDatabase(emission)
    
    return emission
  }

  // Initialize city map - Load from MongoDB or create empty
  useEffect(() => {
    const initializeCityMap = async () => {
      setIsLoading(true)
      
      if (user && user.email) {
        // Try to load from MongoDB first
        const savedCityMap = await loadCityMapFromDatabase()
        const savedEmission = await loadCarbonEmissionFromDatabase()
        
        if (savedCityMap) {
          setCityMap(savedCityMap)
          console.log('Loaded city map from MongoDB')
        } else {
          // Create empty city map if none exists
          const initialMap = []
          for (let i = 0; i < ntiles; i++) {
            initialMap[i] = []
            for (let j = 0; j < ntiles; j++) {
              initialMap[i][j] = [0, 0] // [texI, texJ] - start with blank tiles
            }
          }
          setCityMap(initialMap)
          console.log('Created new empty city map')
        }
        
        if (savedEmission !== null) {
          setCarbonEmission(savedEmission)
          console.log('Loaded carbon emission from MongoDB:', savedEmission)
        }
      } else {
        // No user logged in, create empty map
        const initialMap = []
        for (let i = 0; i < ntiles; i++) {
          initialMap[i] = []
          for (let j = 0; j < ntiles; j++) {
            initialMap[i][j] = [0, 0]
          }
        }
        setCityMap(initialMap)
      }
      
      setIsLoading(false)
    }

    initializeCityMap()
  }, [user]) // Re-run when user changes

  // Auto-save city map when it changes
  useEffect(() => {
    if (cityMap.length > 0 && !isLoading && user && user.email) {
      // Debounce the save operation
      const saveTimer = setTimeout(() => {
        saveCityMapToDatabase(cityMap)
      }, 1000) // Save 1 second after last change

      return () => clearTimeout(saveTimer)
    }
  }, [cityMap, isLoading, user])

  // Handle user logout - clear city map
  useEffect(() => {
    if (!user) {
      const emptyMap = []
      for (let i = 0; i < ntiles; i++) {
        emptyMap[i] = []
        for (let j = 0; j < ntiles; j++) {
          emptyMap[i][j] = [0, 0]
        }
      }
      setCityMap(emptyMap)
      setCarbonEmission(100.0000)
    }
  }, [user])

  // Preload backend reductions for all tiles
  useEffect(() => {
    const preloadBackendReductions = async () => {
      const uniqueActions = new Set()
      ecoTiles.forEach(tile => {
        if (tile.title && tileToActionMap[tile.title]) {
          uniqueActions.add(tileToActionMap[tile.title])
        }
      })

      // Load all unique actions
      for (const action of uniqueActions) {
        await getBackendReduction(action)
      }
    }

    preloadBackendReductions()
  }, [])

  // Canvas drawing functions
  const drawImageTile = (ctx, x, y, i, j, texture) => {
    ctx.save()
    ctx.translate((y - x) * tileWidth / 2, (x + y) * tileHeight / 2)
    const texJ = j * 130
    const texI = i * 230
    ctx.drawImage(texture, texJ, texI, 130, 230, -65, -130, 130, 230)
    ctx.restore()
  }

  const drawTile = (ctx, x, y, color) => {
    ctx.save()
    ctx.translate((y - x) * tileWidth / 2, (x + y) * tileHeight / 2)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(tileWidth / 2, tileHeight / 2)
    ctx.lineTo(0, tileHeight)
    ctx.lineTo(-tileWidth / 2, tileHeight / 2)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
    ctx.restore()
  }

  const drawMap = (bgCtx, texture) => {
    if (!bgCtx || !texture || !cityMap.length) return

    const w = 910
    const h = 462
    bgCtx.clearRect(-w, -h, w * 2, h * 2)

    for (let i = 0; i < ntiles; i++) {
      for (let j = 0; j < ntiles; j++) {
        drawImageTile(bgCtx, i, j, cityMap[i][j][0], cityMap[i][j][1], texture)
      }
    }
  }

  const getPosition = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    const _y = (offsetY - tileHeight * 2) / tileHeight
    const _x = offsetX / tileWidth - ntiles / 2
    const x = Math.floor(_y - _x)
    const y = Math.floor(_x + _y)

    return { x, y }
  }

  // Game initialization
  useEffect(() => {
    if (!cityMap.length) return

    const texture = new Image()
    texture.src = textureImage

    texture.onload = () => {
      const canvas = canvasRef.current
      const fgCanvas = fgCanvasRef.current

      if (!canvas || !fgCanvas) return

      // Setup background canvas
      canvas.width = 910
      canvas.height = 666
      const w = 910
      const h = 462
      const bgCtx = canvas.getContext("2d")
      bgCtx.translate(w / 2, tileHeight * 2)

      // Setup foreground canvas
      fgCanvas.width = canvas.width
      fgCanvas.height = canvas.height
      const fgCtx = fgCanvas.getContext('2d')
      fgCtx.translate(w / 2, tileHeight * 2)

      // Draw initial map
      drawMap(bgCtx, texture)
      setGameLoaded(true)

      // Mouse event handlers
      const handleMouseMove = (e) => {
        const pos = getPosition(e, fgCanvas)
        fgCtx.clearRect(-w, -h, w * 2, h * 2)

        // Only show hover preview if a tool is selected and we're not currently placing
        if (pos.x >= 0 && pos.x < ntiles && pos.y >= 0 && pos.y < ntiles && activeTool !== null && !isPlacing) {
          // Show a lighter preview of where the tile would be placed
          drawTile(fgCtx, pos.x, pos.y, 'rgba(0,255,0,0.3)') // Green preview
        }
      }

      const handleClick = async (e) => {
        const pos = getPosition(e, fgCanvas)

        if (pos.x >= 0 && pos.x < ntiles && pos.y >= 0 && pos.y < ntiles) {
          const newMap = [...cityMap]

          if (e.button === 2) { // Right click - remove tile
            newMap[pos.x][pos.y] = [0, 0]
          } else { // Left click - place tile
            if (activeTool !== null) { // Only place if a tool is selected
              newMap[pos.x][pos.y] = [tool[0], tool[1]]
            }
          }

          setCityMap(newMap) // This will trigger the auto-save effect
          setIsPlacing(true)

          // Redraw map
          drawMap(bgCtx, texture)

          // Clear the foreground canvas after placing
          setTimeout(() => {
            fgCtx.clearRect(-w, -h, w * 2, h * 2)
            setIsPlacing(false)
          }, 100)

          // Recalculate CO2 emission
          await calculateCarbonEmission()
        }
      }

      const handleMouseUp = () => {
        if (isPlacing) setIsPlacing(false)
      }

      const handleMouseLeave = () => {
        // Clear hover preview when mouse leaves canvas
        fgCtx.clearRect(-w, -h, w * 2, h * 2)
      }

      // Add event listeners
      fgCanvas.addEventListener('mousemove', handleMouseMove)
      fgCanvas.addEventListener('mousedown', handleClick)
      fgCanvas.addEventListener('mouseup', handleMouseUp)
      fgCanvas.addEventListener('mouseleave', handleMouseLeave)
      fgCanvas.addEventListener('contextmenu', (e) => e.preventDefault())

      // Cleanup
      return () => {
        fgCanvas.removeEventListener('mousemove', handleMouseMove)
        fgCanvas.removeEventListener('mousedown', handleClick)
        fgCanvas.removeEventListener('mouseup', handleMouseUp)
        fgCanvas.removeEventListener('mouseleave', handleMouseLeave)
      }
    }

    texture.onerror = () => {
      console.error('Failed to load texture image')
    }
  }, [cityMap, tool, isPlacing])

  // Recalculate CO2 when city map changes
  useEffect(() => {
    if (cityMap.length && gameLoaded) {
      calculateCarbonEmission()
    }
  }, [cityMap, gameLoaded])

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
    <div className="relative flex dashboard-container">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main Content - Properly positioned next to sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${window.innerWidth > 1024 ? 'ml-[280px]' : 'ml-0'
          } lg:ml-[280px]`}
        style={{
          marginLeft: window.innerWidth > 1024 ? '280px' : '0'
        }}
      >
        <UserHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* CO2 Emission Gauge */}
        <div className="fixed z-50 top-20 right-5">
          <CarbonGauge emission={carbonEmission} />
        </div>

        {/* Save Status Indicator */}
        {saveStatus && (
          <div className="fixed z-50 transform -translate-x-1/2 top-20 left-1/2">
            <div className={`px-4 py-2 rounded-lg text-white font-medium ${
              saveStatus.includes('Saved') ? 'bg-green-500' : 
              saveStatus.includes('failed') ? 'bg-red-500' : 'bg-blue-500'
            }`}>
              {saveStatus}
            </div>
          </div>
        )}

        <main className="p-6 pt-16 lg:pt-6">
          <section className="px-4 mx-auto my-8 max-w-7xl">
            {/* Game Header */}
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold text-gray-800">EcoCity Builder</h1>
              <p className="text-gray-600">
                Build your sustainable city and reduce CO2 emissions! 
                {user && <span className="ml-2 text-sm text-blue-600">Playing as: {user.firstName || user.email}</span>}
              </p>
            </div>

            {/* Show loading spinner while initializing */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-green-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600">Loading your city from database...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Game Controls */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <button
                    onClick={() => setGameToolsOpen(!gameToolsOpen)}
                    className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    {gameToolsOpen ? 'Hide Tools' : 'Show Building Tools'}
                  </button>

                  <div className="text-sm text-gray-600">
                    CO2 Emission: <span className="font-bold text-red-600">{carbonEmission.toFixed(4)}%</span>
                  </div>

                  {user && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveCityMapToDatabase(cityMap)}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        disabled={saveStatus === 'Saving...'}
                      >
                        💾 Save Now
                      </button>
                      
                      <button
                        onClick={async () => {
                          const savedMap = await loadCityMapFromDatabase()
                          const savedEmission = await loadCarbonEmissionFromDatabase()
                          if (savedMap) {
                            setCityMap(savedMap)
                            console.log('City reloaded from MongoDB')
                          }
                          if (savedEmission !== null) {
                            setCarbonEmission(savedEmission)
                            console.log('Carbon emission reloaded from MongoDB')
                          }
                        }}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                      >
                        🔄 Reload
                      </button>
                    </div>
                  )}

                  {!user && (
                    <div className="text-sm text-red-600">
                      Please login to save your progress
                    </div>
                  )}
                </div>

                {/* Building Tools Panel with overflow fix */}
                {gameToolsOpen && (
                  <div className="relative p-6 mb-6 overflow-visible bg-white border rounded-lg shadow-lg">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">🏗️ Building Tools</h3>

                    {/* Selected Tool Display */}
                    {activeTool !== null && (
                      <div className="p-3 mb-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-green-800">
                              {getTileData(tool[1], tool[0])?.title || 'Unknown Tool'}
                            </div>
                            <div className="text-sm text-green-600">
                              Backend Action: {tileToActionMap[getTileData(tool[1], tool[0])?.title] || 'No action'}
                            </div>
                            <div className="text-sm text-blue-600">
                              Backend Reduction: {backendReductions.get(tileToActionMap[getTileData(tool[1], tool[0])?.title]) || '0.0'}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="relative overflow-visible">
                      <div className="flex flex-wrap justify-center gap-3 p-2 overflow-y-auto max-h-[600px]">
                        {Array.from({ length: texHeight }, (_, i) =>
                          Array.from({ length: texWidth }, (_, j) => {
                            const toolId = i * texWidth + j
                            const tileData = getTileData(j, i)
                            const hasAction = tileData && tileData.title && tileToActionMap[tileData.title]
                            const backendAction = tileData ? tileToActionMap[tileData.title] : null
                            const backendReduction = backendAction ? backendReductions.get(backendAction) : 0

                            return (
                              <div
                                key={toolId}
                                className="relative flex-shrink-0 group building-tool-container"
                                style={{ width: '130px', height: '230px' }}
                              >
                                {/* Building Tool */}
                                <div
                                  className={`building-tool-fixed relative cursor-pointer transition-all duration-300 ${activeTool === toolId ? 'selected' : ''
                                    } ${hasAction ? 'has-action' : 'no-action'}`}
                                  style={{
                                    backgroundImage: `url(${textureImage})`,
                                    backgroundPosition: `-${j * 130}px -${i * 230}px`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'auto',
                                    width: '130px',
                                    height: '230px',
                                    border: hasAction ? '2px dashed #10b981' : '2px dashed #dc2626',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    imageRendering: 'pixelated',
                                    boxSizing: 'border-box'
                                  }}
                                  onClick={async () => {
                                    setTool([i, j])
                                    setActiveTool(toolId)
                                    if (backendAction) {
                                      await getBackendReduction(backendAction)
                                    }
                                  }}
                                />

                                {/* CO2 Reduction Badge */}
                                {backendReduction > 0 && (
                                  <div className="absolute z-10 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-green-500 rounded-full -top-1 -right-1">
                                    {typeof backendReduction === 'number' ? backendReduction.toFixed(1) : '...'}
                                  </div>
                                )}

                                {/* Tooltip with smart positioning */}
                                <div className={`absolute z-50 mb-2 transition-opacity duration-200 transform opacity-0 pointer-events-none group-hover:opacity-100 ${
                                  i < 2 ? 'top-full mt-2' : 'bottom-full mb-2'
                                  } ${j < 3 ? 'left-0' : j > 8 ? 'right-0' : 'left-1/2 -translate-x-1/2'
                                  }`}>
                                  <div className="max-w-xs px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap">
                                    <div className="font-semibold">{tileData?.title || `Tool ${toolId}`}</div>
                                    {backendAction && (
                                      <>
                                        <div className="mt-1 text-xs text-blue-300">Action: {backendAction}</div>
                                        <div className="text-green-300">
                                          Backend Reduction: {backendReduction ? `${typeof backendReduction === 'number' ? backendReduction.toFixed(4) : backendReduction}%` : 'Loading...'}
                                        </div>
                                      </>
                                    )}
                                    {!hasAction && !backendReduction && (
                                      <div className="mt-1 text-xs text-red-300">
                                        No Climate Action
                                      </div>
                                    )}

                                    {/* Tooltip Arrow */}
                                    <div className={`absolute border-4 border-transparent ${i < 2 ? 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900' : 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900'
                                      }`}></div>
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="p-3 mt-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-green-50">
                      <div className="text-sm text-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🎯</span>
                          <span className="font-semibold">Instructions:</span>
                        </div>
                        <ul className="ml-6 space-y-1">
                          <li>• <span className="font-semibold text-green-600">Green badges</span> show backend CO2 reduction percentage</li>
                          <li>• <span className="font-semibold text-blue-600">Hover</span> over tools to see backend details</li>
                          <li>• <span className="font-semibold text-purple-600">Left click</span> on grid to place, <span className="font-semibold text-red-600">right click</span> to remove</li>
                          <li>• <span className="font-semibold text-green-600">Green border</span> indicates eco-friendly buildings</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Isometric City Game Canvas */}
                <div className="relative p-6 bg-white rounded-lg shadow-lg">
                  <div className="flex items-center justify-center overflow-auto">
                    <div className="relative" style={{ width: '910px', height: '666px', minWidth: '910px', minHeight: '666px' }}>
                      <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 z-10 isometric-canvas"
                        style={{
                          imageRendering: 'pixelated',
                          width: '910px',
                          height: '666px'
                        }}
                      />
                      <canvas
                        ref={fgCanvasRef}
                        className="absolute top-0 left-0 z-20 isometric-canvas"
                        style={{
                          imageRendering: 'pixelated',
                          width: '910px',
                          height: '666px'
                        }}
                      />

                      {!gameLoaded && (
                        <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-green-600 rounded-full animate-spin"></div>
                            <p className="text-gray-600">Loading EcoCity Builder...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Game Instructions */}
                  <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-green-50">
                    <h4 className="flex items-center gap-2 mb-3 font-semibold text-blue-800">
                      <span className="text-xl">🎮</span>
                      How to Play:
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <ul className="space-y-2 text-sm text-blue-700">
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">🔧</span>
                          Select a building tool from the panel above
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-blue-500">🖱️</span>
                          Click on the isometric grid to place buildings
                        </li>
                      </ul>
                      <ul className="space-y-2 text-sm text-blue-700">
                        <li className="flex items-center gap-2">
                          <span className="text-red-500">🗑️</span>
                          Right-click to remove buildings
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">🌱</span>
                          Reduce CO2 below 20% to become Eco Champion!
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

// Carbon Gauge Component - Redesigned as floating meter
const CarbonGauge = ({ emission }) => {
  const getStatusInfo = () => {
    if (emission <= 20) {
      return {
        status: 'ECO CHAMPION!',
        color: 'text-green-700',
        bgColor: 'bg-gradient-to-br from-green-400 to-green-600',
        icon: '🌟',
        textColor: 'text-white'
      }
    } else if (emission <= 40) {
      return {
        status: 'GOOD PROGRESS',
        color: 'text-green-600',
        bgColor: 'bg-gradient-to-br from-green-300 to-green-500',
        icon: '✅',
        textColor: 'text-white'
      }
    } else if (emission <= 60) {
      return {
        status: 'NEEDS WORK',
        color: 'text-yellow-700',
        bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500',
        icon: '⚠️',
        textColor: 'text-white'
      }
    } else if (emission <= 80) {
      return {
        status: 'HIGH POLLUTION',
        color: 'text-orange-700',
        bgColor: 'bg-gradient-to-br from-orange-500 to-red-500',
        icon: '🔥',
        textColor: 'text-white'
      }
    } else {
      return {
        status: 'CRITICAL!',
        color: 'text-red-700',
        bgColor: 'bg-gradient-to-br from-red-500 to-red-700',
        icon: '🚨',
        textColor: 'text-white'
      }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="co2-floating-meter">
      {/* Main Meter Container */}
      <div className={`${statusInfo.bgColor} rounded-2xl shadow-2xl p-4 backdrop-blur-lg border border-white/20`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className={`text-sm font-bold ${statusInfo.textColor} tracking-wide`}>
            CO₂ EMISSION
          </span>
        </div>

        {/* Main Display */}
        <div className="mb-3 text-center">
          <div className={`text-3xl font-black ${statusInfo.textColor} mb-1`}>
            {emission.toFixed(4)}%
          </div>
          <div className={`text-xs ${statusInfo.textColor} opacity-90 font-medium`}>
            {statusInfo.icon} {statusInfo.status}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-3">
          <div className="w-full h-2 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full transition-all duration-1000 ease-out rounded-full"
              style={{
                width: `${emission}%`,
                background: emission <= 20
                  ? 'linear-gradient(90deg, #ffffff, #f0fdf4)'
                  : emission <= 40
                    ? 'linear-gradient(90deg, #ffffff, #fef3c7)'
                    : emission <= 60
                      ? 'linear-gradient(90deg, #ffffff, #fed7aa)'
                      : 'linear-gradient(90deg, #ffffff, #fecaca)'
              }}
            />
          </div>

          {/* Progress indicators */}
          <div className="flex justify-between mt-1 text-xs text-white/80">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Goal indicator */}
        <div className="text-center">
          <div className="text-xs font-medium text-white/90">
            🎯 Target: Below 20%
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="co2-particles">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="co2-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Game