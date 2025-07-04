import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import UserDashboard from './pages/UserDashboard'

// Layout for conditional header/footer if needed in the future
function Layout({ children }) {
  const location = useLocation()
  const hideHeader = location.pathname === '/login' || location.pathname === '/signup'
  // You can add a shared header/footer here if needed
  return <>{children}</>
}

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Layout>
  </Router>
)

export default App