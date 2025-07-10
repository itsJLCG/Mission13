import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import UserDashboard from './pages/UserDashboard'
// import Challenge from './pages/Challenge'
import Game from './pages/Game'
import Chatbot from './pages/Chatbot'
import UserProfile from './pages/UserProfile'


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
        {/* <Route path="/challenge" element={<Challenge />} /> */}
        <Route path="/game" element={<Game />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Layout>
  </Router>
)

export default App