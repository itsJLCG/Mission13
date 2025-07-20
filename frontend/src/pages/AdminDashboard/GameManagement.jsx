import React, { useState } from 'react'
import { Grid, Card, CardContent, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material'
import { MaterialReactTable } from 'material-react-table'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import VisibilityIcon from '@mui/icons-material/Visibility'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import '../../styles/admin/gamemanagement.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, Filler)

// Sample Games Data
const gamesData = [
  { id: 1, name: 'EcoQuiz Adventure', type: 'Trivia', level: 'Easy', plays: 120, rating: 4.5, status: 'Active' },
  { id: 2, name: 'Green City Builder', type: 'Puzzle', level: 'Medium', plays: 90, rating: 4.2, status: 'Active' },
  { id: 3, name: 'Carbon Footprint Race', type: 'Adventure', level: 'Hard', plays: 60, rating: 4.8, status: 'Active' },
  { id: 4, name: 'Recycling Sorter', type: 'Arcade', level: 'Easy', plays: 150, rating: 4.3, status: 'Inactive' },
]

// Chart Data
const barData = {
  labels: ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
  datasets: [
    {
      label: 'Plays',
      data: [120, 90, 60, 30],
      backgroundColor: '#184b3e',
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
}

const pieData = {
  labels: ['Puzzle', 'Trivia', 'Adventure', 'Arcade'],
  datasets: [
    {
      label: 'Game Types',
      data: [40, 30, 20, 10],
      backgroundColor: ['#184b3e', '#599645', '#c8d982', '#d8e84e'],
      borderWidth: 2,
      borderColor: '#ffffff',
    },
  ],
}

const lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Total Plays',
      data: [50, 80, 120, 200, 250, 300, 400],
      fill: true,
      backgroundColor: 'rgba(24,75,62,0.2)',
      borderColor: '#184b3e',
      tension: 0.4,
      pointBackgroundColor: '#184b3e',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 5
    },
  ],
}

const heatmapData = [
  { hour: '08:00', plays: 10 },
  { hour: '09:00', plays: 25 },
  { hour: '10:00', plays: 40 },
  { hour: '11:00', plays: 35 },
  { hour: '12:00', plays: 20 },
  { hour: '13:00', plays: 15 },
  { hour: '14:00', plays: 30 },
]

const GameManagement = () => {
  const [openAnalytics, setOpenAnalytics] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)

  // Table columns
  const columns = [
    { accessorKey: 'name', header: 'Game Name', size: 180 },
    { accessorKey: 'type', header: 'Type', size: 100 },
    { accessorKey: 'level', header: 'Difficulty', size: 100 },
    { accessorKey: 'plays', header: 'Total Plays', size: 100 },
    { accessorKey: 'rating', header: 'Rating', size: 80 },
    { accessorKey: 'status', header: 'Status', size: 100 },
    {
      accessorKey: 'actions',
      header: 'Actions',
      size: 100,
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => { setSelectedGame(row.original); setOpenAnalytics(true); }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <div className="game-container">
      <h1 className="page-title">Game Analytics</h1>


      {/* Analytics Charts - 2 per row, centered and equal sizes */}
      <div className="analytics-section">
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <div className="chart-card">
              <h4 className="chart-title">Plays per Game Level</h4>
              <div className="chart-container">
                <Bar 
                  data={barData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true }
                    }
                  }} 
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <div className="chart-card">
              <h4 className="chart-title">Game Type Distribution</h4>
              <div className="chart-container">
                <Pie 
                  data={pieData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } } 
                  }} 
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <div className="chart-card">
              <h4 className="chart-title">Plays Over Time</h4>
              <div className="chart-container">
                <Line 
                  data={lineData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true }
                    }
                  }} 
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <div className="chart-card">
              <h4 className="chart-title">Most Active Game Hours</h4>
              <div className="heatmap-container">
                <Table className="heatmap-table">
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
                          backgroundColor: `rgba(24, 75, 62, ${row.plays/50})`,
                          '&:hover': { backgroundColor: `rgba(89, 150, 69, ${row.plays/40})` }
                        }}
                      >
                        <TableCell>{row.hour}</TableCell>
                        <TableCell><strong>{row.plays}</strong></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>

      {/* Games Table */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">All Games</h3>
          <p className="table-description">Manage and monitor all games on the platform</p>
        </div>
        <div className="table-container">
          <MaterialReactTable 
            columns={columns} 
            data={gamesData} 
            enablePagination 
            enableGlobalFilter
            enableDensityToggle
            initialState={{
              density: 'compact',
              pagination: { pageSize: 10 }
            }}
            muiTableBodyRowProps={{ hover: true }}
            muiTableProps={{
              sx: {
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.85rem'
              }
            }}
            muiTableHeadCellProps={{
              sx: {
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '8px 12px'
              }
            }}
            muiTableBodyCellProps={{
              sx: {
                fontSize: '0.8rem',
                padding: '6px 12px'
              }
            }}
          />
        </div>
      </div>

      {/* Game Analytics Dialog */}
      <Dialog open={openAnalytics} onClose={() => setOpenAnalytics(false)} maxWidth="md" fullWidth className="custom-dialog">
        <DialogTitle className="dialog-title">Game Analytics</DialogTitle>
        <DialogContent className="dialog-content">
          {selectedGame && (
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#184b3e' }}>
                {selectedGame.name}
              </Typography>
              <div className="analytics-details">
                <div className="detail-item">
                  <Typography variant="subtitle2" className="detail-label">Game Type:</Typography>
                  <Typography variant="body2" className="detail-value">{selectedGame.type}</Typography>
                </div>
                <div className="detail-item">
                  <Typography variant="subtitle2" className="detail-label">Difficulty Level:</Typography>
                  <Typography variant="body2" className="detail-value">{selectedGame.level}</Typography>
                </div>
                <div className="detail-item">
                  <Typography variant="subtitle2" className="detail-label">Total Plays:</Typography>
                  <Typography variant="body2" className="detail-value">{selectedGame.plays}</Typography>
                </div>
                <div className="detail-item">
                  <Typography variant="subtitle2" className="detail-label">Average Rating:</Typography>
                  <Typography variant="body2" className="detail-value">{selectedGame.rating}/5.0</Typography>
                </div>
                <div className="detail-item">
                  <Typography variant="subtitle2" className="detail-label">Status:</Typography>
                  <Typography variant="body2" className="detail-value">{selectedGame.status}</Typography>
                </div>
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => setOpenAnalytics(false)} className="cancel-button" size="small">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default GameManagement
