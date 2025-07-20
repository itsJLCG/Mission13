import React from 'react'
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import {
  People as PeopleIcon,
  EmojiEvents as ChallengesIcon,
  Assignment as SubmissionsIcon,
  Chat as ChatIcon
} from '@mui/icons-material'
import '../../styles/admin/overview.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Tooltip, Legend, Filler)

const metrics = [
  { label: 'Users', value: 1200, icon: PeopleIcon, bgColor: '#184b3e' },
  { label: 'Challenges', value: 35, icon: ChallengesIcon, bgColor: '#599645' },
  { label: 'Submissions', value: 950, icon: SubmissionsIcon, bgColor: '#d8e84e' },
  { label: 'Chats', value: 3200, icon: ChatIcon, bgColor: '#eef7b4' }
]

// Line Chart - User Growth
const userGrowthData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [{ 
    label: 'New Users', 
    data: [50, 80, 120, 200, 250, 300, 400], 
    fill: true, 
    backgroundColor: 'rgba(24,75,62,0.2)', 
    borderColor: '#184b3e', 
    tension: 0.4,
    pointBackgroundColor: '#184b3e',
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    pointRadius: 5
  }]
}

// Horizontal Bar Chart - Challenge Categories
const challengeCategoriesData = {
  labels: ['Environmental', 'Recycling', 'Energy Saving', 'Transportation', 'Water Conservation'],
  datasets: [{
    label: 'Challenges Completed',
    data: [120, 95, 87, 75, 60],
    backgroundColor: [
      '#184b3e',
      '#599645',
      '#d8e84e',
      '#eef7b4',
      '#599645'
    ],
    borderColor: '#ffffff',
    borderWidth: 1
  }]
}

// Doughnut Chart - User Activity Levels
const userActivityData = {
  labels: ['Very Active', 'Active', 'Moderate', 'Low Activity'],
  datasets: [{
    data: [25, 35, 30, 10],
    backgroundColor: ['#184b3e', '#599645', '#d8e84e', '#eef7b4'],
    borderWidth: 3,
    borderColor: '#ffffff',
    cutout: '65%'
  }]
}

// Radar Chart - Platform Performance
const platformPerformanceData = {
  labels: ['User Engagement', 'Challenge Completion', 'Chatbot Usage', 'Community Activity', 'Learning Progress', 'Goal Achievement'],
  datasets: [{
    label: 'Performance Score',
    data: [85, 90, 75, 80, 88, 92],
    backgroundColor: 'rgba(24,75,62,0.2)',
    borderColor: '#184b3e',
    borderWidth: 2,
    pointBackgroundColor: '#599645',
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    pointRadius: 5
  }]
}

const lineChartOptions = {
  plugins: { 
    legend: { display: false },
    tooltip: {
      backgroundColor: '#184b3e',
      titleColor: '#ffffff',
      bodyColor: '#ffffff'
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { 
      beginAtZero: true,
      grid: { color: 'rgba(0,0,0,0.1)' },
      ticks: { color: '#333' }
    },
    x: { 
      grid: { display: false },
      ticks: { color: '#333' }
    }
  }
}

const horizontalBarOptions = {
  indexAxis: 'y',
  plugins: { 
    legend: { display: false },
    tooltip: {
      backgroundColor: '#184b3e',
      titleColor: '#ffffff',
      bodyColor: '#ffffff'
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { 
      beginAtZero: true,
      grid: { color: 'rgba(0,0,0,0.1)' },
      ticks: { color: '#333' }
    },
    y: { 
      grid: { display: false },
      ticks: { color: '#333' }
    }
  }
}

const doughnutChartOptions = {
  plugins: { 
    legend: { 
      position: 'bottom',
      align: 'center',
      labels: { 
        padding: 15,
        usePointStyle: true,
        pointStyle: 'circle',
        color: '#333'
      }
    },
    tooltip: {
      backgroundColor: '#184b3e',
      titleColor: '#ffffff',
      bodyColor: '#ffffff'
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%'
}

const radarChartOptions = {
  plugins: { 
    legend: { display: false },
    tooltip: {
      backgroundColor: '#184b3e',
      titleColor: '#ffffff',
      bodyColor: '#ffffff'
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      grid: { color: 'rgba(0,0,0,0.1)' },
      angleLines: { color: 'rgba(0,0,0,0.1)' },
      pointLabels: { color: '#333', font: { size: 11 } },
      ticks: { color: '#333', stepSize: 20 }
    }
  }
}

const Overview = () => {
  return (
    <div className="overview-container">
      
      {/* Metrics Section: Clean modern cards */}
      <div className="metrics-section">
        {metrics.map((metric, idx) => {
          const IconComponent = metric.icon
          return (
            <div 
              key={idx} 
              className="metric-card" 
              style={{ borderLeftColor: metric.bgColor }}
            >
              <div 
                className="metric-icon"
                style={{ backgroundColor: metric.bgColor }}
              >
                <IconComponent />
              </div>
              <div className="metric-content">
                <div className="metric-label">{metric.label}</div>
                <div className="metric-value">{metric.value.toLocaleString()}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Section: 2 per row */}
      <div className="charts-section">
        <div className="chart-card">
          <h3 className="chart-title">User Growth Trend</h3>
          <p className="chart-description">Monthly new user registrations showing platform growth over time</p>
          <div className="chart-container">
            <Line data={userGrowthData} options={lineChartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Challenge Categories</h3>
          <p className="chart-description">Distribution of completed challenges across different environmental categories</p>
          <div className="chart-container">
            <Bar data={challengeCategoriesData} options={horizontalBarOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">User Activity Distribution</h3>
          <p className="chart-description">Breakdown of user engagement levels based on platform activity</p>
          <div className="chart-container">
            <Doughnut data={userActivityData} options={doughnutChartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Platform Performance</h3>
          <p className="chart-description">Multi-dimensional analysis of platform performance across key metrics</p>
          <div className="chart-container">
            <Radar data={platformPerformanceData} options={radarChartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
