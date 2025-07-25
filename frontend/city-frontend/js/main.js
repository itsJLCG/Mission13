const $ = _ => document.querySelector(_)

const $c = _ => document.createElement(_)

let canvas, bg, fg, cf, ntiles, tileWidth, tileHeight, texWidth,
    texHeight, map, tools, tool, activeTool, isPlacing, previousState, sidebarTimeout, carbonEmission

/* texture from https://opengameart.org/content/isometric-landscape */
const texture = new Image()
texture.src = "textures/Mission13.png"
texture.onload = _ => init()

// Backend API configuration
const BACKEND_URL = 'http://127.0.0.1:8000'

// Cache for backend CO2 reduction values to avoid repeated API calls
const co2ReductionCache = new Map()

// Map tile titles to backend action names
const tileToActionMap = {
    // Exact matches from ecoTiles.js
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
    "Recycling ": "Recycle waste",  // Note the space
    "Waste recycling ": "Recycle waste",  // Note the space
    "Industrial CCS": "Apply industrial CCS",
    "Compact urban design": "Adopt compact urban design",
    "Plants management": "Manage plants",
    "Plants management ": "Manage plants",  // Note the space
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
};


// Function to fetch CO2 reduction from backend
const getBackendReduction = async (action) => {
    if (!action) return 0.0
    
    // Check cache first
    if (co2ReductionCache.has(action)) {
        return co2ReductionCache.get(action)
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/reduction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: action })
        })
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        if (data.error) {
            console.warn(`Backend error for action "${action}":`, data.error)
            return 0.0
        }
        
        // Ensure we get a float value
        const reduction = parseFloat(data.reduction_percent) || 0.0
        // Cache the result
        co2ReductionCache.set(action, reduction)
        return reduction
    } catch (error) {
        console.error('Error calling backend:', error)
        return 0.0
    }
}

const init = () => {
    tool = [0, 0]
    carbonEmission = 100.0000

    map = [
        [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
    ]

    canvas = $("#bg")
    canvas.width = 910
    canvas.height = 666
    w = 910
    h = 462
    texWidth = 12
    texHeight = 6
    bg = canvas.getContext("2d")
    ntiles = 7
    tileWidth = 128
    tileHeight = 64
    bg.translate(w / 2, tileHeight * 2)

    loadHashState(document.location.hash.substring(1))
    drawMap()

    fg = $('#fg')
    fg.width = canvas.width
    fg.height = canvas.height
    cf = fg.getContext('2d')
    cf.translate(w / 2, tileHeight * 2)
    fg.addEventListener('mousemove', viz)
    fg.addEventListener('contextmenu', e => e.preventDefault())
    fg.addEventListener('mouseup', unclick)
    fg.addEventListener('mousedown', click)
    fg.addEventListener('touchend', click)
    fg.addEventListener('pointerup', click)

    tools = $('#tools')

    // Create tooltip element
    createTooltip()

    let toolCount = 0
    for (let i = 0; i < texHeight; i++) {
        for (let j = 0; j < texWidth; j++) {
            const div = $c('div');
            div.id = `tool_${toolCount++}`
            div.style.display = "block"
            div.style.backgroundPosition = `-${j * 130 + 2}px -${i * 230}px`
            
            // Get tile data for this position
            const tileData = getTileData(j, i)
            const hasAction = tileData && tileData.title && tileToActionMap[tileData.title]
            
            // Add class if tile has an action
            if (hasAction) {
                div.classList.add('has-action')
            }
            
            div.addEventListener('click', e => {
                tool = [i, j]
                if (activeTool)
                    $(`#${activeTool}`).classList.remove('selected')
                activeTool = e.target.id
                $(`#${activeTool}`).classList.add('selected')
            })
            
            // Add hover events for tooltip
            div.addEventListener('mouseenter', e => showTooltip(e, j, i))
            div.addEventListener('mouseleave', hideTooltip)
            
            tools.appendChild(div)
        }
    }

    // Initialize sidebar functionality
    initSidebar()
    
    // Initialize carbon emission gauge
    initCarbonGauge()
}

const initSidebar = () => {
    // Create trigger zone
    const trigger = $c('div')
    trigger.id = 'sidebar-trigger'
    document.body.appendChild(trigger)
    
    // Add event listeners for sidebar control
    document.addEventListener('mousemove', handleMouseMove)
    
    // Initially hide sidebar and center content
    const area = $('#area')
    area.classList.add('sidebar-hidden')
}

const handleMouseMove = (e) => {
    // Only apply on desktop (not mobile)
    if (window.innerWidth <= 966) return
    
    const tools = $('#tools')
    const area = $('#area')
    const mouseX = e.clientX
    
    // Show sidebar when mouse is near left edge (within 50px)
    if (mouseX <= 50) {
        clearTimeout(sidebarTimeout)
        tools.classList.add('visible')
        area.classList.remove('sidebar-hidden')
        area.classList.add('sidebar-visible')
    } 
    // Hide sidebar when mouse moves away from left area (beyond 650px from left)
    else if (mouseX > 650) {
        clearTimeout(sidebarTimeout)
        sidebarTimeout = setTimeout(() => {
            tools.classList.remove('visible')
            area.classList.remove('sidebar-visible')
            area.classList.add('sidebar-hidden')
        }, 500) // Delay before hiding
    }
}

const initCarbonGauge = () => {
    // Create the carbon gauge HTML structure - Tube Style
    const gaugeHTML = `
        <div id="carbon-gauge">
            <div class="gauge-title">🏭 CO2 EMISSION METER</div>
            <div class="gauge-subtitle">City Carbon Emissions</div>
            
            <div class="tube-container">
                <div class="tube-background">
                    <div class="tube-fill" id="tube-fill"></div>
                    <div class="tube-bubbles">
                        <div class="bubble bubble-1"></div>
                        <div class="bubble bubble-2"></div>
                        <div class="bubble bubble-3"></div>
                        <div class="bubble bubble-4"></div>
                        <div class="bubble bubble-5"></div>
                    </div>
                </div>
                <div class="tube-labels">
                    <div class="label label-top">💀 TOXIC</div>
                    <div class="label label-high">🔥 HIGH</div>
                    <div class="label label-medium">⚠️ MEDIUM</div>
                    <div class="label label-low">✅ LOW</div>
                    <div class="label label-clean">🌱 CLEAN</div>
                </div>
            </div>
            
            <div class="emission-value">
                <span id="carbon-percentage">100.0000</span>%
            </div>
            <div class="emission-status status-danger" id="emission-status">
                🚨 CRITICAL POLLUTION
            </div>
            
            <div class="gauge-tip">
                <strong>🎯 Goal:</strong> Reduce CO2 Emission to create a sustainable city!
            </div>
        </div>
    `
    
    // Add the gauge to the body
    document.body.insertAdjacentHTML('beforeend', gaugeHTML)
    
    // Update the gauge display
    updateCarbonGauge()
}

const updateCarbonGauge = () => {
    const fillElement = $('#tube-fill')
    const percentageElement = $('#carbon-percentage')
    const statusElement = $('#emission-status')
    
    // Update percentage display with 4 decimal places for precision
    percentageElement.textContent = carbonEmission.toFixed(4)
    
    // Update tube fill height (inverted - 100% = full tube, 0% = empty)
    const fillHeight = carbonEmission
    fillElement.style.height = `${fillHeight}%`
    
    // Update fill color based on emission level
    let fillColor = ''
    if (carbonEmission <= 20) {
        fillColor = 'linear-gradient(to top, #22c55e, #16a34a)' // Green
    } else if (carbonEmission <= 40) {
        fillColor = 'linear-gradient(to top, #65a30d, #22c55e)' // Light Green
    } else if (carbonEmission <= 60) {
        fillColor = 'linear-gradient(to top, #eab308, #fbbf24)' // Yellow
    } else if (carbonEmission <= 80) {
        fillColor = 'linear-gradient(to top, #f97316, #fb923c)' // Orange
    } else {
        fillColor = 'linear-gradient(to top, #dc2626, #ef4444)' // Red
    }
    
    fillElement.style.background = fillColor
    
    // Update status based on emission level
    statusElement.className = 'emission-status'
    
    if (carbonEmission <= 20) {
        statusElement.classList.add('status-excellent')
        statusElement.innerHTML = '🌟 ECO CHAMPION!'
    } else if (carbonEmission <= 40) {
        statusElement.classList.add('status-good')
        statusElement.innerHTML = '✅ GOOD PROGRESS'
    } else if (carbonEmission <= 60) {
        statusElement.classList.add('status-warning')
        statusElement.innerHTML = '⚠️ NEEDS IMPROVEMENT'
    } else if (carbonEmission <= 80) {
        statusElement.classList.add('status-critical')
        statusElement.innerHTML = '🔥 HIGH CO2 Emission'
    } else {
        statusElement.classList.add('status-danger')
        statusElement.innerHTML = '🚨 CRITICAL CO2 Emission'
    } 
    
    // Update bubble animation speed based on CO2 Emission level
    const bubbles = document.querySelectorAll('.bubble')
    bubbles.forEach(bubble => {
        const speed = (carbonEmission / 100) * 3 + 1 // Faster bubbles = more CO2 Emission
        bubble.style.animationDuration = `${speed}s`
    })
}

// Helper function to find tile data by coordinates (now col, row)
const getTileData = (col, row) => {
    return ecoTiles.find(tile => tile.coords[0] === col && tile.coords[1] === row)
}

const calculateCarbonEmission = async () => {
    let totalReduction = 0.0
    let placedTiles = 0
    
    console.log('Calculating carbon emission...')
    
    // Calculate total CO2 reduction from all placed tiles using backend data
    for (let i = 0; i < ntiles; i++) {
        for (let j = 0; j < ntiles; j++) {
            const [texI, texJ] = map[i][j]
            
            // Skip empty tiles
            if (texI === 0 && texJ === 0) continue
            
            placedTiles++
            
            // Find the tile data from ecoTiles.js (now using texJ as column, texI as row)
            const tileData = getTileData(texJ, texI)
            if (tileData && tileData.title) {
                // Map tile title to backend action
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
    
    // Calculate emission: Start at 100, reduce based on backend values
    let emission = 100.0000 - totalReduction
    
    // Ensure emission stays within reasonable bounds (5.0-100.0%)
    emission = Math.max(5.0, Math.min(100.0, emission))
    
    console.log(`Final emission: ${emission.toFixed(4)}%`)
    
    return emission
}

// From https://stackoverflow.com/a/36046727
const ToBase64 = u8 => {
    return btoa(String.fromCharCode.apply(null, u8))
}

const FromBase64 = str => {
    return atob(str).split('').map(c => c.charCodeAt(0))
}

const updateHashState = () => {
    let c = 0
    const u8 = new Uint8Array(ntiles * ntiles)
    for (let i = 0; i < ntiles; i++) {
        for (let j = 0; j < ntiles; j++) {
            u8[c++] = map[i][j][0] * texWidth + map[i][j][1]
        }
    }
    const state = ToBase64(u8)
    if (!previousState || previousState != state) {
        history.pushState(undefined, undefined, `#${state}`)
        previousState = state
    }
}

window.addEventListener('popstate', async function () {
    loadHashState(document.location.hash.substring(1))
    drawMap()
    // Recalculate carbon emission when state changes using backend data
    carbonEmission = await calculateCarbonEmission()
    updateCarbonGauge()
})

const loadHashState = state => {
    const u8 = FromBase64(state)
    let c = 0
    for (let i = 0; i < ntiles; i++) {
        for (let j = 0; j < ntiles; j++) {
            const t = u8[c++] || 0
            const x = Math.trunc(t / texWidth)
            const y = Math.trunc(t % texWidth)
            map[i][j] = [x, y]
        }
    }
}

const click = async (e) => {
    const pos = getPosition(e)
    if (pos.x >= 0 && pos.x < ntiles && pos.y >= 0 && pos.y < ntiles) {
        map[pos.x][pos.y][0] = (e.which === 3) ? 0 : tool[0]
        map[pos.x][pos.y][1] = (e.which === 3) ? 0 : tool[1]
        isPlacing = true
        drawMap()
        cf.clearRect(-w, -h, w * 2, h * 2)
        
        // Update carbon emission when tiles change using backend data
        carbonEmission = await calculateCarbonEmission()
        updateCarbonGauge()
    }
    updateHashState();
}

const unclick = () => {
    if (isPlacing)
        isPlacing = false
}

const drawMap = () => {
    bg.clearRect(-w, -h, w * 2, h * 2)
    for (let i = 0; i < ntiles; i++) {
        for (let j = 0; j < ntiles; j++) {
            drawImageTile(bg, i, j, map[i][j][0], map[i][j][1])
        }
    }
}

const drawTile = (c, x, y, color) => {
    c.save()
    c.translate((y - x) * tileWidth / 2, (x + y) * tileHeight / 2)
    c.beginPath()
    c.moveTo(0, 0)
    c.lineTo(tileWidth / 2, tileHeight / 2)
    c.lineTo(0, tileHeight)
    c.lineTo(-tileWidth / 2, tileHeight / 2)
    c.closePath()
    c.fillStyle = color
    c.fill()
    c.restore()
}

const drawImageTile = (c, x, y, i, j) => {
    c.save()
    c.translate((y - x) * tileWidth / 2, (x + y) * tileHeight / 2)
    j *= 130
    i *= 230
    c.drawImage(texture, j, i, 130, 230, -65, -130, 130, 230)
    c.restore()
}

const getPosition = e => {
    const _y = (e.offsetY - tileHeight * 2) / tileHeight
    const _x = e.offsetX / tileWidth - ntiles / 2
    x = Math.floor(_y - _x)
    y = Math.floor(_x + _y)
    return { x, y }
}

const viz = (e) => {
    if (isPlacing)
        click(e)
    const pos = getPosition(e)
    cf.clearRect(-w, -h, w * 2, h * 2)
    if (pos.x >= 0 && pos.x < ntiles && pos.y >= 0 && pos.y < ntiles)
        drawTile(cf, pos.x, pos.y, 'rgba(0,0,0,0.2)')
}

const createTooltip = () => {
    const tooltip = $c('div')
    tooltip.id = 'tile-tooltip'
    tooltip.className = 'tile-tooltip'
    document.body.appendChild(tooltip)
}

// Show tooltip with tile information
const showTooltip = async (event, col, row) => {
    const tooltip = $('#tile-tooltip')
    const tileData = getTileData(col, row)
    
    if (!tileData || !tileData.title) {
        hideTooltip()
        return
    }
    
    const backendAction = tileToActionMap[tileData.title]
    let tooltipContent = `
        <div class="tooltip-title">🏗️ TILE INFO</div>
        <div class="tooltip-action">${tileData.title}</div>
    `
    
    if (backendAction) {
        // Get reduction value from backend
        try {
            const reduction = await getBackendReduction(backendAction)
            tooltipContent += `
                <div style="margin: 8px 0; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.2);">
                    <div style="color: #93c5fd; font-size: 10px; margin-bottom: 4px;">🔄 BACKEND ACTION:</div>
                    <div style="color: #fbbf24; font-size: 11px; margin-bottom: 6px;">${backendAction}</div>
                    <div class="tooltip-reduction">📉 -${reduction.toFixed(4)}% CO2</div>
                </div>
            `
        } catch (error) {
            tooltipContent += `
                <div style="margin: 8px 0; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.2);">
                    <div style="color: #93c5fd; font-size: 10px; margin-bottom: 4px;">🔄 BACKEND ACTION:</div>
                    <div style="color: #fbbf24; font-size: 11px;">${backendAction}</div>
                </div>
            `
        }
    } else {
        tooltipContent += `
            <div style="margin: 8px 0; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.2);">
                <div class="no-action">❌ No environmental action</div>
            </div>
        `
    }
    
    tooltip.innerHTML = tooltipContent
    
    // Position tooltip
    const rect = event.target.getBoundingClientRect()
    const tooltipRect = tooltip.getBoundingClientRect()
    
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2
    let top = rect.top - tooltipRect.height - 10
    
    // Ensure tooltip stays within viewport
    if (left < 10) left = 10
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10
    }
    if (top < 10) {
        top = rect.bottom + 10
    }
    
    tooltip.style.left = `${left}px`
    tooltip.style.top = `${top}px`
    tooltip.classList.add('visible')
}

// Hide tooltip
const hideTooltip = () => {
    const tooltip = $('#tile-tooltip')
    tooltip.classList.remove('visible')
}