import React from 'react'

export default function Calendar({ history = [] }) {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  
  // Get first day of the month and number of days in the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  // Create calendar grid
  const calendarDays = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(currentYear, currentMonth, day)
    
    // Check if this day has activity based on REAL history data
    const hasActivity = history && history.length > 0 && history.some(item => {
      const itemDate = new Date(item.completedAt)
      return itemDate.toDateString() === dayDate.toDateString()
    })
    
    const isToday = dayDate.toDateString() === today.toDateString()
    const isPastDate = dayDate < today && !isToday
    
    calendarDays.push({
      day,
      date: dayDate,
      hasActivity,
      isToday,
      isPastDate
    })
  }
  
  // Count ACTUAL active days from real history
  const activeDays = history ? history.filter(item => {
    const itemDate = new Date(item.completedAt)
    return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear
  }).length : 0
  
  return (
<div
  className="bg-[#fcfbec] rounded-2xl p-6 border-2 border-black backdrop-blur-sm shadow-[0_6px_0_rgba(0,0,0,0.8)] transition-all duration-300"
  style={{ fontFamily: 'Poppins, sans-serif' }}
>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#191b40] font-bold text-sm">📅 Monthly Activity</span>
      </div>
      
      {/* Month and Year Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-[#191b40]">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <div className="text-xs text-[#191b40] mt-1">
          {activeDays > 0 
            ? `You completed challenges ${activeDays} out of ${daysInMonth} days this month!`
            : 'No challenges completed this month yet. Start your eco-journey!'
          }
        </div>
      </div>
      
      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, idx) => (
          <div key={idx} className="text-center">
            <div className="text-xs text-[#191b40] font-semibold p-1">{day}</div>
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => (
          <div key={idx} className="text-center">
            {day ? (
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${day.hasActivity 
                    ? 'bg-[#b8f772] text-[#191b40]' 
                    : day.isPastDate 
                      ? 'bg-gray-100 text-gray-400' 
                      : 'bg-gray-200 text-gray-600'
                  }
                  ${day.isToday ? 'ring-2 ring-[#191b40]' : ''}
                `}
              >
                {day.day}
              </div>
            ) : (
              <div className="w-8 h-8"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#b8f772]"></div>
          <span className="text-[#191b40]">Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-200"></div>
          <span className="text-[#191b40]">Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-100"></div>
          <span className="text-[#191b40]">Past</span>
        </div>
      </div>
    </div>
  )
}