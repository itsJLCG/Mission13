import React, { useState } from 'react'
import {
  Grid, Card, CardContent, Typography, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Box, Chip
} from '@mui/material'
import { MaterialReactTable } from 'material-react-table'
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import '../../styles/admin/chatbot.css'

// --- Sample Logs Data ---
const initialLogs = [
  { id: 1, user: 'Juan Dela Cruz', message: 'How to join challenge?', time: '2025-07-20 09:00' },
  { id: 2, user: 'Alice', message: 'How to recycle?', time: '2025-07-19 10:00' },
  { id: 3, user: 'Bob', message: 'Eco tips?', time: '2025-07-19 10:05' },
  { id: 4, user: 'Maria Santos', message: 'What are the available eco-challenges this month?', time: '2025-07-18 14:30' },
  { id: 5, user: 'John Smith', message: 'How can I track my carbon footprint using this app?', time: '2025-07-18 11:20' },
  { id: 6, user: 'Ana Garcia', message: 'Can you explain the point system for challenges?', time: '2025-07-17 16:45' },
]

const ChatbotManagement = () => {
  const [logs, setLogs] = useState(initialLogs)
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')
  const [openView, setOpenView] = useState(false)
  const [viewLog, setViewLog] = useState(null)

  // Filter logs by search and date
  const filteredLogs = logs.filter(
    log =>
      (log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.message.toLowerCase().includes(search.toLowerCase())) &&
      (date === '' || log.time.startsWith(date))
  )

  // Table columns
  const columns = [
    { accessorKey: 'user', header: 'User', size: 150 },
    { accessorKey: 'time', header: 'Date & Time', size: 140 },
    {
      accessorKey: 'message',
      header: 'Message Preview',
      size: 250,
      Cell: ({ row }) => (
        <span>
          {row.original.message.length > 50
            ? row.original.message.slice(0, 50) + '...'
            : row.original.message}
        </span>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      size: 120,
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => { setViewLog(row.original); setOpenView(true); }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="error" 
            onClick={() => setLogs(logs.filter(l => l.id !== row.original.id))}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <div className="chatbot-container">
      <h1 className="page-title">Chatbot Management</h1>
      
      {/* Action Buttons */}
      <div className="action-buttons-section">
        <Button 
          variant="contained" 
          startIcon={<UploadFileIcon />} 
          className="primary-button"
          size="small"
        >
          Upload Training Data
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<QuestionAnswerIcon />}
          className="secondary-button"
          size="small"
        >
          Manage FAQ
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="filter-section">
        <div className="filter-card">
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                variant="outlined"
                placeholder="Search user or message..."
                fullWidth
                size="small"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="custom-textfield"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: '#184b3e' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                variant="outlined"
                type="date"
                label="Filter by Date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="custom-textfield"
              />
            </Grid>
          </Grid>
        </div>
      </div>

      {/* Conversation Logs Table */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Conversation Logs</h3>
          <p className="table-description">Monitor and manage chatbot interactions with users</p>
        </div>
        <div className="table-container">
          <MaterialReactTable 
            columns={columns} 
            data={filteredLogs} 
            enablePagination 
            enableGlobalFilter={false}
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

      {/* Full View Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth className="custom-dialog">
        <DialogTitle className="dialog-title">Conversation Detail</DialogTitle>
        <DialogContent className="dialog-content">
          {viewLog && (
            <Box>
              <div className="detail-item">
                <Typography variant="subtitle2" className="detail-label">User:</Typography>
                <Typography variant="body2" className="detail-value">{viewLog.user}</Typography>
              </div>
              <div className="detail-item">
                <Typography variant="subtitle2" className="detail-label">Date & Time:</Typography>
                <Typography variant="body2" className="detail-value">{viewLog.time}</Typography>
              </div>
              <div className="detail-item">
                <Typography variant="subtitle2" className="detail-label">Full Message:</Typography>
                <Typography variant="body2" className="detail-message">{viewLog.message}</Typography>
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => setOpenView(false)} className="cancel-button" size="small">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ChatbotManagement