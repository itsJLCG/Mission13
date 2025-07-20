import React from 'react'
import { Box, Typography } from '@mui/material'

const SIDEBAR_WIDTH = 240

const Footer = () => (
  <Box
    sx={{
      background: 'linear-gradient(90deg, #e0f2f1 0%, #b2dfdb 100%)',
      py: 2,
      textAlign: 'center',
      borderTop: '2px solid #43cea2',
      boxShadow: 2,
      marginLeft: SIDEBAR_WIDTH,
    }}
  >
    <Typography
      variant="body2"
      sx={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 500,
        letterSpacing: 1,
        color: '#181818',
      }}
    >
      &copy; {new Date().getFullYear()} Mission13 Admin Dashboard
    </Typography>
  </Box>
)

export default Footer