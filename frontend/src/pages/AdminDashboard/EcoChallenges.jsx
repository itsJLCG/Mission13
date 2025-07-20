import React, { useState } from 'react'
import {
  Grid, Card, CardContent, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, Chip, Box
} from '@mui/material'
import { MaterialReactTable } from 'material-react-table'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Line, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import '../../styles/admin/ecochallenges.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler)

// --- Sample Data ---
const initialChallenges = [
  {
    id: 1,
    name: 'Plant a Tree',
    description: 'Plant a tree in your community and share a photo.',
    date: '2025-07-01',
    duration: '7 days',
    participants: 120,
    completionRate: 80,
    category: 'Environment',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Beach Cleanup',
    description: 'Join a local beach cleanup event.',
    date: '2025-07-10',
    duration: '3 days',
    participants: 90,
    completionRate: 65,
    category: 'Community',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Recycle Drive',
    description: 'Collect and recycle household plastics.',
    date: '2025-07-15',
    duration: '5 days',
    participants: 60,
    completionRate: 50,
    category: 'Waste',
    status: 'Inactive',
  },
]

// --- Challenge Analytics Data ---
const analyticsData = {
  participationTrend: {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Participants',
        data: [10, 30, 50, 70, 90, 110, 120],
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
  },
  completionStatus: {
    labels: ['Completed', 'Ongoing', 'Failed'],
    datasets: [
      {
        data: [80, 30, 10],
        backgroundColor: ['#184b3e', '#599645', '#d8e84e'],
        borderWidth: 3,
        borderColor: '#ffffff',
      },
    ],
  },
}

// --- Pending Submissions ---
const pendingSubmissions = [
  { id: 1, user: 'Alice', challenge: 'Plant a Tree', proof: 'tree.jpg', time: '2025-07-19 10:00' },
  { id: 2, user: 'Bob', challenge: 'Beach Cleanup', proof: 'beach.jpg', time: '2025-07-19 10:05' },
]

// --- Table Columns ---
const columns = [
  { accessorKey: 'name', header: 'Challenge Title', size: 150 },
  { accessorKey: 'description', header: 'Description', size: 200 },
  { accessorKey: 'date', header: 'Date', size: 100 },
  { accessorKey: 'duration', header: 'Duration', size: 80 },
  { accessorKey: 'participants', header: 'Participants', size: 80 },
  { accessorKey: 'completionRate', header: 'Rate (%)', size: 70 },
  { accessorKey: 'category', header: 'Category', size: 100 },
  { accessorKey: 'status', header: 'Status', size: 80 },
  {
    accessorKey: 'actions',
    header: 'Actions',
    size: 120,
    Cell: ({ row }) => (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <IconButton size="small" color="primary" onClick={() => row.original.onView(row.original)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="secondary" onClick={() => row.original.onEdit(row.original)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error" onClick={() => row.original.onDelete(row.original)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="warning" onClick={() => row.original.onDeactivate(row.original)}>
          <PauseCircleIcon fontSize="small" />
        </IconButton>
      </Box>
    ),
  },
]

// --- Main Component ---
const EcoChallenges = () => {
  const [challenges, setChallenges] = useState(initialChallenges)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editChallenge, setEditChallenge] = useState(null)
  const [openAnalytics, setOpenAnalytics] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [openSubmissions, setOpenSubmissions] = useState(false)

  // Action handlers
  const handleAdd = () => setOpenAdd(true)
  const handleEdit = (challenge) => { setEditChallenge(challenge); setOpenEdit(true) }
  const handleDelete = (challenge) => setChallenges(challenges.filter(c => c.id !== challenge.id))
  const handleDeactivate = (challenge) => setChallenges(challenges.map(c => c.id === challenge.id ? { ...c, status: 'Inactive' } : c))
  const handleView = (challenge) => { setSelectedChallenge(challenge); setOpenAnalytics(true) }
  const handleClose = () => { setOpenAdd(false); setOpenEdit(false); setOpenAnalytics(false); setOpenSubmissions(false) }

  // Add/Edit form state
  const [form, setForm] = useState({
    name: '', description: '', date: '', duration: '', category: '', status: 'Active'
  })
  const categories = ['Environment', 'Community', 'Waste', 'Awareness']

  // Table with action handlers
  const tableData = challenges.map(c => ({
    ...c,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onDeactivate: handleDeactivate,
    onView: handleView,
  }))

  return (
    <div className="ecochallenges-container">
      <h1 className="page-title">Eco-Challenges Management</h1>

      {/* Action Buttons */}
      <div className="action-buttons-section">
        <Button 
          variant="contained" 
          startIcon={<AddCircleIcon />} 
          onClick={handleAdd}
          className="primary-button"
          size="small"
        >
          Create New Challenge
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => setOpenSubmissions(true)}
          className="secondary-button"
          size="small"
        >
          Review Pending Submissions
        </Button>
      </div>

      {/* Challenges Table */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">All Challenges</h3>
          <p className="table-description">Manage and monitor all eco-challenges on the platform</p>
        </div>
        <div className="table-container">
          <MaterialReactTable
            columns={columns}
            data={tableData}
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

      {/* Add Challenge Modal */}
      <Dialog open={openAdd} onClose={handleClose} maxWidth="sm" fullWidth className="custom-dialog">
        <DialogTitle className="dialog-title">Add New Challenge</DialogTitle>
        <DialogContent className="dialog-content">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                label="Title" 
                fullWidth 
                size="small"
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                className="custom-textfield"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label="Description" 
                fullWidth 
                size="small"
                multiline 
                rows={2} 
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                className="custom-textfield"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                label="Start Date" 
                type="date" 
                fullWidth 
                size="small"
                InputLabelProps={{ shrink: true }} 
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} 
                className="custom-textfield"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                label="Duration" 
                fullWidth 
                size="small"
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} 
                className="custom-textfield"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                select 
                label="Category" 
                fullWidth 
                size="small"
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="custom-textfield"
              >
                {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField 
                select 
                label="Status" 
                fullWidth 
                size="small"
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="custom-textfield"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label="Rules / Instructions" 
                fullWidth 
                size="small"
                multiline 
                rows={2} 
                className="custom-textfield"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" className="upload-button" size="small">
                Upload Image
                <input type="file" hidden />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleClose} className="cancel-button" size="small">Cancel</Button>
          <Button 
            onClick={() => { 
              setChallenges([...challenges, { ...form, id: challenges.length + 1, participants: 0, completionRate: 0 }]); 
              handleClose(); 
            }} 
            variant="contained"
            className="save-button"
            size="small"
          >
            Add Challenge
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Challenge Modal */}
      <Dialog open={openEdit} onClose={handleClose} maxWidth="sm" fullWidth className="custom-dialog">
        <DialogTitle className="dialog-title">Edit Challenge</DialogTitle>
        <DialogContent className="dialog-content">
          {editChallenge && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  label="Title" 
                  fullWidth 
                  size="small"
                  defaultValue={editChallenge.name} 
                  className="custom-textfield"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Description" 
                  fullWidth 
                  size="small"
                  multiline 
                  rows={2} 
                  defaultValue={editChallenge.description} 
                  className="custom-textfield"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  label="Start Date" 
                  type="date" 
                  fullWidth 
                  size="small"
                  InputLabelProps={{ shrink: true }} 
                  defaultValue={editChallenge.date} 
                  className="custom-textfield"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  label="Duration" 
                  fullWidth 
                  size="small"
                  defaultValue={editChallenge.duration} 
                  className="custom-textfield"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  select 
                  label="Category" 
                  fullWidth 
                  size="small"
                  defaultValue={editChallenge.category}
                  className="custom-textfield"
                >
                  {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  select 
                  label="Status" 
                  fullWidth 
                  size="small"
                  defaultValue={editChallenge.status}
                  className="custom-textfield"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Rules / Instructions" 
                  fullWidth 
                  size="small"
                  multiline 
                  rows={2} 
                  className="custom-textfield"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" component="label" className="upload-button" size="small">
                  Upload Image
                  <input type="file" hidden />
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleClose} className="cancel-button" size="small">Cancel</Button>
          <Button onClick={handleClose} variant="contained" className="save-button" size="small">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Challenge Analytics Modal */}
      <Dialog open={openAnalytics} onClose={handleClose} maxWidth="md" fullWidth className="custom-dialog">
        <DialogTitle className="dialog-title">Challenge Analytics</DialogTitle>
        <DialogContent className="dialog-content">
          {selectedChallenge && (
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#184b3e' }}>
                {selectedChallenge.name}
              </Typography>
              <div className="analytics-charts">
                <div className="chart-card">
                  <h4 className="chart-title">Participation Trend</h4>
                  <div className="chart-container">
                    <Line 
                      data={analyticsData.participationTrend} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                      }} 
                    />
                  </div>
                </div>
                <div className="chart-card">
                  <h4 className="chart-title">Completion Status</h4>
                  <div className="chart-container">
                    <Pie 
                      data={analyticsData.completionStatus} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom' } } 
                      }} 
                    />
                  </div>
                </div>
              </div>
              <div className="leaderboard-section">
                <h4 className="section-title">Leaderboard</h4>
                <Table className="custom-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Completion Time</TableCell>
                      <TableCell>Proof</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Alice</TableCell>
                      <TableCell>2 days</TableCell>
                      <TableCell><Chip label="tree.jpg" color="success" size="small" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bob</TableCell>
                      <TableCell>3 days</TableCell>
                      <TableCell><Chip label="beach.jpg" color="info" size="small" /></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleClose} className="cancel-button" size="small">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Pending Submissions Modal */}
      <Dialog open={openSubmissions} onClose={handleClose} maxWidth="md" fullWidth className="custom-dialog">
        <DialogTitle className="dialog-title">Pending Submissions Review</DialogTitle>
        <DialogContent className="dialog-content">
          <Table className="custom-table">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Challenge</TableCell>
                <TableCell>Proof</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingSubmissions.map(sub => (
                <TableRow key={sub.id}>
                  <TableCell>{sub.user}</TableCell>
                  <TableCell>{sub.challenge}</TableCell>
                  <TableCell><Chip label={sub.proof} color="info" size="small" /></TableCell>
                  <TableCell>{sub.time}</TableCell>
                  <TableCell>
                    <IconButton color="success" size="small"><CheckCircleIcon fontSize="small" /></IconButton>
                    <IconButton color="error" size="small"><CancelIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleClose} className="cancel-button" size="small">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default EcoChallenges