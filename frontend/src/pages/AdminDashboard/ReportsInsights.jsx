import React from 'react'
import { Grid, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, LinearProgress, Button, Box } from '@mui/material'
import { Bar, Pie, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

// --- User Engagement Metrics ---
const userMetrics = [
  { label: 'Total Registered Users', value: 4200 },
  { label: 'Active Users (Daily)', value: 1200 },
  { label: 'Active Users (Weekly)', value: 2500 },
  { label: 'Active Users (Monthly)', value: 3900 },
  { label: 'Avg. Session Duration', value: '8m 30s' },
  { label: 'Gamified Actions/User', value: '5.2' },
  { label: 'Return User Rate', value: '68%' },
]

// --- User Engagement Chart ---
const engagementBarData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Active Users',
      data: [900, 1100, 1200, 1000, 950, 800, 700],
      backgroundColor: '#4e7d10ff',
    },
    {
      label: 'Games Played',
      data: [400, 500, 600, 550, 500, 450, 400],
      backgroundColor: '#78ce43ff',
    },
  ],
}

// --- Game Analytics Table ---
const games = [
  { name: 'Eco Sorter', plays: 3250, avgScore: '88%', completion: '92%', feedback: '4.5 / 5' },
  { name: 'Quiz Challenge', plays: 1200, avgScore: '76%', completion: '61%', feedback: '4.0 / 5' },
]

// --- Game Category Pie ---
const gameCategoryPie = {
  labels: ['Puzzle', 'Trivia', 'Adventure', 'Arcade'],
  datasets: [
    {
      label: 'Game Category',
      data: [40, 30, 20, 10],
      backgroundColor: ['#769810ff', '#4dae0dff', '#7dc03fff', '#c0db37ff'],
    },
  ],
}

// --- Game Heatmap Table ---
const heatmapData = [
  { hour: '08:00', plays: 10 },
  { hour: '09:00', plays: 25 },
  { hour: '10:00', plays: 40 },
  { hour: '11:00', plays: 35 },
  { hour: '12:00', plays: 20 },
  { hour: '13:00', plays: 15 },
  { hour: '14:00', plays: 30 },
]

// --- Eco Challenge Impact ---
const ecoGoals = [
  { label: 'Plastic bottles saved', value: 3214, goal: 5000 },
  { label: 'Trees planted', value: 96, goal: 200 },
  { label: 'Avg. eco-steps walked', value: 4812, goal: 10000 },
  { label: 'Liters of water saved', value: 2100, goal: 5000 },
]

// --- Exportable Reports (Mockup) ---
const exportReports = [
  "Monthly Game Activity Summary",
  "Top Eco Achievers",
  "Overall Campaign Impact"
]

const ReportsInsights = () => (
  <div style={{
    fontFamily: 'Poppins, sans-serif',
    color: '#333',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh'
  }}>
    <Typography 
      variant="h4" 
      gutterBottom 
      fontWeight={700} 
      fontFamily="Poppins, sans-serif"
      sx={{
        textAlign: 'center',
        color: '#314b18ff',
        marginBottom: '25px',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      Reports & Insights
    </Typography>

    {/* Export Buttons */}
    <Box sx={{ 
      mb: 4, 
      display: 'flex', 
      justifyContent: 'center',
      gap: 2,
      flexWrap: 'wrap'
    }}>
      <Button 
        variant="contained" 
        startIcon={<PictureAsPdfIcon />}
        sx={{
          background: 'linear-gradient(135deg, #184b3e 0%, #599645 100%)',
          color: 'white',
          borderRadius: '8px',
          padding: '10px 24px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: '0.9rem',
          textTransform: 'none',
          boxShadow: '0 4px 15px rgba(24, 75, 62, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(24, 75, 62, 0.4)'
          }
        }}
      >
        Export PDF Report
      </Button>
    </Box>

    <Grid container spacing={3}>
      {/* User Engagement - Full Width */}
      <Grid item xs={12}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #fafffe 100%)',
          boxShadow: '0 6px 20px rgba(24, 75, 62, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(200, 217, 130, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 30px rgba(24, 75, 62, 0.12), 0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(89, 150, 69, 0.3)'
          }
        }}>
          <CardContent sx={{ padding: '25px' }}>
            <Typography 
              variant="h6" 
              fontWeight={700} 
              fontFamily="Poppins, sans-serif" 
              sx={{ 
                mb: 3,
                textAlign: 'center',
                color: '#184b3e',
                fontSize: '18px',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '50px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #184b3e, #599645)',
                  borderRadius: '2px'
                }
              }}
            >
              User Engagement Metrics
            </Typography>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px',
              mb: 3
            }}>
              {userMetrics.map((m, idx) => (
                <Typography 
                  key={m.label} 
                  variant="body2" 
                  sx={{ 
                    mb: 0,
                    padding: '12px 18px',
                    background: 'rgba(24, 75, 62, 0.05)',
                    borderRadius: '8px',
                    borderLeft: '4px solid #599645',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(89, 150, 69, 0.08)',
                      transform: 'translateX(3px)'
                    }
                  }}
                >
                  <strong>{m.label}:</strong> {m.value}
                </Typography>
              ))}
            </Box>
            
            <Box sx={{ 
              mt: 2,
              height: '350px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bar data={engagementBarData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    position: 'bottom',
                    labels: {
                      font: { family: 'Poppins', size: 12 }
                    }
                  } 
                },
                scales: {
                  y: { 
                    beginAtZero: true,
                    grid: { color: 'rgba(24, 75, 62, 0.1)' }
                  },
                  x: {
                    grid: { color: 'rgba(24, 75, 62, 0.1)' }
                  }
                }
              }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Game Analytics - Half Width */}
      <Grid item xs={12} md={6}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #fafffe 100%)',
          boxShadow: '0 6px 20px rgba(24, 75, 62, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(200, 217, 130, 0.15)',
          transition: 'all 0.3s ease',
          height: '100%',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 30px rgba(24, 75, 62, 0.12), 0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(89, 150, 69, 0.3)'
          }
        }}>
          <CardContent sx={{ padding: '25px' }}>
            <Typography 
              variant="h6" 
              fontWeight={700} 
              fontFamily="Poppins, sans-serif" 
              sx={{ 
                mb: 3,
                textAlign: 'center',
                color: '#184b3e',
                fontSize: '18px',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '50px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #184b3e, #599645)',
                  borderRadius: '2px'
                }
              }}
            >
              Game Analytics
            </Typography>
            
            <Table size="small" sx={{ 
              mb: 2,
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid rgba(24, 75, 62, 0.1)',
              maxHeight: '150px',
              overflowY: 'auto',
              '& .MuiTableCell-root': {
                padding: '8px 12px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.8rem',
                borderBottom: '1px solid rgba(24, 75, 62, 0.08)'
              },
              '& .MuiTableCell-head': {
                backgroundColor: 'rgba(24, 75, 62, 0.08)',
                fontWeight: 600,
                color: '#3b4b18ff'
              },
              '& .MuiTableRow-root:hover': {
                backgroundColor: 'rgba(89, 150, 69, 0.05)'
              }
            }}>
              <TableHead>
                <TableRow>
                  <TableCell>Game Name</TableCell>
                  <TableCell>Plays</TableCell>
                  <TableCell>Avg Score</TableCell>
                  <TableCell>Completion Rate</TableCell>
                  <TableCell>Feedback Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {games.map((g, idx) => (
                  <TableRow key={g.name}>
                    <TableCell sx={{ fontWeight: 600, color: '#184b3e' }}>{g.name}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#599645' }}>{g.plays}</TableCell>
                    <TableCell>{g.avgScore}</TableCell>
                    <TableCell>{g.completion}</TableCell>
                    <TableCell sx={{ color: '#d4ff00ff', fontWeight: 500 }}>{g.feedback}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <Box sx={{
              height: '200px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2
            }}>
              <Pie data={gameCategoryPie} options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    position: 'bottom',
                    labels: {
                      font: { family: 'Poppins', size: 11 }
                    }
                  } 
                } 
              }} />
            </Box>
            
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mt: 2, 
                mb: 1,
                fontWeight: 600,
                color: '#184b3e',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}
            >
              Most Active Game Hours
            </Typography>
            
            <Table size="small" sx={{
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid rgba(24, 75, 62, 0.1)',
              '& .MuiTableCell-root': {
                padding: '6px 12px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.75rem',
                borderBottom: '1px solid rgba(24, 75, 62, 0.05)'
              },
              '& .MuiTableCell-head': {
                backgroundColor: 'rgba(24, 75, 62, 0.08)',
                fontWeight: 600,
                color: '#184b3e'
              }
            }}>
              <TableHead>
                <TableRow>
                  <TableCell>Hour</TableCell>
                  <TableCell>Plays</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {heatmapData.map((row, idx) => (
                  <TableRow 
                    key={idx} 
                    sx={{ 
                      backgroundColor: `rgba(0,87,255,${row.plays/50})`,
                      transition: 'all 0.2s ease',
                      '&:hover': { backgroundColor: `rgba(89, 150, 69, ${row.plays/40})` }
                    }}
                  >
                    <TableCell>{row.hour}</TableCell>
                    <TableCell><strong>{row.plays}</strong></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>

      {/* Eco Challenge Impact - Half Width */}
      <Grid item xs={12} md={6}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #fafffe 100%)',
          boxShadow: '0 6px 20px rgba(24, 75, 62, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(200, 217, 130, 0.15)',
          transition: 'all 0.3s ease',
          height: '100%',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 30px rgba(24, 75, 62, 0.12), 0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(89, 150, 69, 0.3)'
          }
        }}>
          <CardContent sx={{ padding: '25px' }}>
            <Typography 
              variant="h6" 
              fontWeight={700} 
              fontFamily="Poppins, sans-serif" 
              sx={{ 
                mb: 3,
                textAlign: 'center',
                color: '#184b3e',
                fontSize: '18px',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '50px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #184b3e, #599645)',
                  borderRadius: '2px'
                }
              }}
            >
              Eco Challenge Impact
            </Typography>
            
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              mt: 2
            }}>
              {ecoGoals.map((goal, idx) => (
                <Box key={goal.label} sx={{ 
                  background: 'rgba(248, 255, 254, 0.5)',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid rgba(200, 217, 130, 0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(248, 255, 254, 0.8)',
                    borderColor: 'rgba(89, 150, 69, 0.3)',
                    transform: 'translateY(-1px)'
                  }
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.9rem',
                      color: '#184b3e',
                      fontWeight: 500
                    }}
                  >
                    <strong>{goal.label}:</strong> {goal.value} / {goal.goal}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((goal.value / goal.goal) * 100, 100)}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#e0f2f1',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#84ce43ff' },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      mt: 1,
                      color: '#666',
                      fontWeight: 500,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {Math.round((goal.value / goal.goal) * 100)}% Complete
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </div>
)

export default ReportsInsights