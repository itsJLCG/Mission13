import React from 'react'
import { AppBar, Toolbar, Typography, Box, InputBase, Avatar, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'

const SIDEBAR_WIDTH = 280 // Updated to match new sidebar width
const HEADER_HEIGHT = 70

const Header = () => (
  <AppBar
    position="fixed"
    sx={{
      backgroundColor: 'rgba(245, 248, 243, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 4px 20px rgba(24, 75, 62, 0.1)',
      height: HEADER_HEIGHT,
      left: SIDEBAR_WIDTH,
      width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
      zIndex: 1300,
      display: 'flex',
      justifyContent: 'center',
      borderBottom: '1px solid rgba(200, 217, 130, 0.2)',
      transition: 'all 0.3s ease',
    }}
  >
    <Toolbar sx={{ 
      minHeight: HEADER_HEIGHT, 
      display: 'flex', 
      justifyContent: 'space-between', 
      px: 3,
      width: '100%'
    }}>
      {/* Search Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(236, 244, 233, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(89, 150, 69, 0.2)',
          borderRadius: 3,
          px: 2.5,
          py: 1,
          width: 400,
          maxWidth: '50%',
          boxShadow: '0 2px 8px rgba(24, 75, 62, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(236, 244, 233, 1)',
            borderColor: 'rgba(89, 150, 69, 0.4)',
            boxShadow: '0 4px 15px rgba(24, 75, 62, 0.15)',
            transform: 'translateY(-1px)',
          },
          '&:focus-within': {
            borderColor: '#599645',
            boxShadow: '0 0 0 3px rgba(89, 150, 69, 0.1)',
          }
        }}
      >
        <SearchIcon sx={{ 
          color: '#90c25dff', 
          mr: 1.5,
          fontSize: 20,
          transition: 'all 0.3s ease',
        }} />
        <InputBase
          placeholder="Search dashboard, users, challenges..."
          sx={{
            width: '100%',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            fontSize: 14,
            color: '#184b3e',
            '& input::placeholder': {
              color: 'rgba(24, 75, 62, 0.6)',
              fontStyle: 'italic',
            }
          }}
        />
      </Box>

      {/* Right Side - Actions and User Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Action Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            sx={{
              color: '#90c25dff',
              backgroundColor: 'rgba(89, 150, 69, 0.1)',
              border: '1px solid rgba(89, 150, 69, 0.2)',
              width: 40,
              height: 40,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(89, 150, 69, 0.2)',
                borderColor: 'rgba(127, 150, 69, 0.4)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(89, 150, 69, 0.3)',
              }
            }}
          >
            <NotificationsIcon fontSize="small" />
          </IconButton>
          
          <IconButton
            sx={{
              color: '#90c25dff',
              backgroundColor: 'rgba(89, 150, 69, 0.1)',
              border: '1px solid rgba(89, 150, 69, 0.2)',
              width: 40,
              height: 40,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(89, 150, 69, 0.2)',
                borderColor: 'rgba(89, 150, 69, 0.4)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(89, 150, 69, 0.3)',
              }
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Divider */}
        <Box
          sx={{
            width: 1,
            height: 32,
            backgroundColor: 'rgba(200, 217, 130, 0.3)',
            mx: 1,
          }}
        />

        {/* User Info */}
       
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontFamily: 'Poppins, sans-serif',
                color: '#85bf4bff',
                fontSize: 14,
                lineHeight: 1.2,
              }}
            >
              
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontFamily: 'Poppins, sans-serif',
                color: 'rgba(24, 75, 62, 0.7)',
                fontSize: 12,
                lineHeight: 1,
              }}
            >
              Administrator
            </Typography>
          </Box>
          <Avatar
            alt="Robert William"
            src="../../assets/logo.png"
            sx={{ 
              width: 40, 
              height: 40,
              border: '2px solid rgba(89, 150, 69, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#599645',
                transform: 'scale(1.05)',
              }
            }}
          />
        </Box>
  
    </Toolbar>
  </AppBar>
)

export default Header
