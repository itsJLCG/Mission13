import React, { useState } from 'react'
import { Grid, Card, CardContent, Typography, Button, IconButton, Box, Chip } from '@mui/material'
import { MaterialReactTable } from 'material-react-table'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import GroupIcon from '@mui/icons-material/Group'
import '../../styles/admin/usermanagement.css'

const initialUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@email.com', role: 'User', challenges: 12, points: 1250, lastLogin: '2025-07-19', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@email.com', role: 'Admin', challenges: 20, points: 2100, lastLogin: '2025-07-18', status: 'Active' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@email.com', role: 'Moderator', challenges: 5, points: 480, lastLogin: '2025-07-17', status: 'Suspended' },
  { id: 4, name: 'Diana Prince', email: 'diana@email.com', role: 'User', challenges: 8, points: 840, lastLogin: '2025-07-20', status: 'Active' },
  { id: 5, name: 'Edward Wilson', email: 'edward@email.com', role: 'User', challenges: 15, points: 1680, lastLogin: '2025-07-16', status: 'Inactive' },
]

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers)

  // Action handlers (mock)
  const handleView = (user) => alert(`Viewing ${user.name}`)
  const handleEdit = (user) => alert(`Editing ${user.name}`)
  const handleSuspend = (user) => setUsers(users.map(u => u.id === user.id ? { ...u, status: u.status === 'Suspended' ? 'Active' : 'Suspended' } : u))
  const handleDelete = (user) => setUsers(users.filter(u => u.id !== user.id))

  const columns = [
    { 
      accessorKey: 'name', 
      header: 'Name',
      size: 150,
      Cell: ({ row }) => (
        <Typography variant="body2" fontWeight={600} sx={{ color: '#184b3e' }}>
          {row.original.name}
        </Typography>
      )
    },
    { 
      accessorKey: 'email', 
      header: 'Email',
      size: 200,
      Cell: ({ row }) => (
        <Typography variant="body2" sx={{ color: '#666' }}>
          {row.original.email}
        </Typography>
      )
    },
    { 
      accessorKey: 'role', 
      header: 'Role',
      size: 100,
      Cell: ({ row }) => (
        <Chip 
          label={row.original.role}
          size="small"
          sx={{
            backgroundColor: row.original.role === 'Admin' ? '#184b3e' : 
                           row.original.role === 'Moderator' ? '#599645' : '#c8d982',
            color: row.original.role === 'User' ? '#184b3e' : 'white',
            fontWeight: 600,
            fontSize: '0.75rem'
          }}
        />
      )
    },
    { 
      accessorKey: 'challenges', 
      header: 'Challenges',
      size: 100,
      Cell: ({ row }) => (
        <Typography variant="body2" fontWeight={600} sx={{ color: '#184b3e' }}>
          {row.original.challenges}
        </Typography>
      )
    },
    { 
      accessorKey: 'points', 
      header: 'Total Points',
      size: 110,
      Cell: ({ row }) => (
        <Typography variant="body2" fontWeight={700} sx={{ color: '#599645' }}>
          {row.original.points.toLocaleString()}
        </Typography>
      )
    },
    { 
      accessorKey: 'lastLogin', 
      header: 'Last Login',
      size: 110,
      Cell: ({ row }) => (
        <Typography variant="body2" sx={{ color: '#666' }}>
          {row.original.lastLogin}
        </Typography>
      )
    },
    { 
      accessorKey: 'status', 
      header: 'Status',
      size: 100,
      Cell: ({ row }) => (
        <Chip 
          label={row.original.status}
          size="small"
          sx={{
            backgroundColor: row.original.status === 'Active' ? '#e8f5e8' : 
                           row.original.status === 'Suspended' ? '#ffebee' : '#f5f5f5',
            color: row.original.status === 'Active' ? '#2e7d32' : 
                   row.original.status === 'Suspended' ? '#c62828' : '#757575',
            fontWeight: 600,
            fontSize: '0.75rem'
          }}
        />
      )
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      size: 160,
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton 
            size="small" 
            sx={{ color: '#184b3e' }}
            onClick={() => handleView(row.original)}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ color: '#599645' }}
            onClick={() => handleEdit(row.original)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ color: '#ff9800' }}
            onClick={() => handleSuspend(row.original)}
          >
            <PauseCircleIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ color: '#f44336' }}
            onClick={() => handleDelete(row.original)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <div className="user-container">
      <h1 className="page-title">User Management</h1>
      
    

      {/* Users Table */}
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">All Users</h3>
          <p className="table-description">Manage and monitor all users on the platform</p>
        </div>
        <div className="table-container">
          <MaterialReactTable 
            columns={columns} 
            data={users} 
            enablePagination 
            enableGlobalFilter
            enableDensityToggle
            enableColumnResizing
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
                padding: '8px 12px',
                backgroundColor: 'rgba(24, 75, 62, 0.08)',
                color: '#184b3e'
              }
            }}
            muiTableBodyCellProps={{
              sx: {
                fontSize: '0.8rem',
                padding: '6px 12px'
              }
            }}
            muiSearchTextFieldProps={{
              placeholder: 'Search users...',
              sx: { 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif'
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default UserManagement