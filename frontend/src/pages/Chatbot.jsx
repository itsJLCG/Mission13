import React, { useState, useEffect, useRef } from 'react'
import UserHeader from '../Components/UserDashboard/UserHeader'
import Sidebar from '../Components/UserDashboard/Sidebar'

const Chatbot = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: "Hello! I'm your Eco AI Assistant. Ready to help you with sustainable challenges for climate action! Ask me for a daily eco challenge or any sustainability tips.",
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  // Test backend connection on component mount
  useEffect(() => {
    testConnection()
  }, [])

  // Auto-scroll to bottom when new messages are added or typing status changes
  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const testConnection = async () => {
    try {
      console.log('Testing backend connection...')
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: "test connection" })
      })
      
      if (response.ok) {
        console.log('Backend connected successfully!')
        setIsConnected(true)
      } else {
        console.log('Backend connection failed:', response.status)
        setIsConnected(false)
      }
    } catch (error) {
      console.log('Backend not available:', error.message)
      setIsConnected(false)
    }
  }

  const scrollToBottom = () => {
    // Use setTimeout to ensure DOM is updated before scrolling
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      }
    }, 100)
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage('')
    setIsTyping(true)

    try {
      console.log('Sending message to AI backend:', currentMessage)
      
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: `You are EcoBot, an environmental AI assistant for Mission13. Focus on sustainability, climate action, renewable energy, and eco-friendly living. Keep responses helpful and actionable. User question: ${currentMessage}` 
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('AI Response received:', data)

      // Add AI response
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          message: data.response || "I'm here to help with environmental questions! Please try asking again.",
          timestamp: new Date().toLocaleTimeString()
        }
        setMessages(prev => [...prev, botMessage])
        setIsTyping(false)
      }, 1000)

    } catch (error) {
      console.error('Error communicating with AI:', error)
      
      setTimeout(() => {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'bot',
          message: "🤖 I'm having trouble connecting to my AI brain right now. Please make sure the backend server is running and try again.",
          timestamp: new Date().toLocaleTimeString()
        }
        setMessages(prev => [...prev, errorMessage])
        setIsTyping(false)
      }, 1000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex min-h-screen bg-[#eaf6ec]">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <UserHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6 flex-1 flex flex-col">
          <section className="mx-auto max-w-4xl w-full flex-1 flex flex-col">
            {/* Header */}
            <div
              className="mb-6 flex items-center justify-between"
              style={{ fontFamily: 'Lexend Deca, Poppins, Nunito Sans, sans-serif' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#191b40]">EcoBot AI Assistant</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isConnected ? 'AI Connected' : 'AI Offline'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-[#191b40]">Status:</span>
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}></span>
                  <span className={`text-sm font-semibold ${
                    isConnected ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isConnected ? 'OpenRouter AI Active' : 'Backend Offline'}
                  </span>
                </span>
              </div>
            </div>
            
            {/* Chat Container - Fixed Height */}
            <div className="bg-white rounded-xl shadow border border-[#b8f772] overflow-hidden flex flex-col" style={{ height: '600px' }}>
              {/* Chat Header */}
              <div className="bg-[#b8f772] px-4 py-3 flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#191b40] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">🤖</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#191b40]">EcoBot AI</h2>
                  <p className="text-xs text-[#191b40] opacity-70">
                    {isConnected ? 'Powered by OpenRouter & GPT-4' : 'Backend Offline'}
                  </p>
                </div>
              </div>
              
              {/* Chat Messages - Fixed Height with Auto Scroll */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-[#f8fafc] to-white"
                style={{ 
                  height: '450px', 
                  maxHeight: '450px',
                  scrollBehavior: 'smooth'
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-[#b8f772] text-[#191b40] rounded-br-none'
                          : 'bg-white border border-gray-200 text-[#191b40] rounded-bl-none shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line text-sm leading-relaxed">{msg.message}</div>
                      <div className="text-xs opacity-70 mt-2">{msg.timestamp}</div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg rounded-bl-none shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#191b40]">
                          {isConnected ? 'AI is thinking...' : 'Processing...'}
                        </span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-[#b8f772] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#b8f772] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-[#b8f772] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Invisible div for auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input - Fixed at Bottom */}
              <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-end gap-2">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isConnected ? "Ask me anything about sustainability and climate action..." : "Backend offline - start with: python app.py"}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8f772] focus:border-transparent resize-none"
                    rows="1"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                    disabled={!isConnected}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || !isConnected}
                    className="px-6 py-3 bg-[#b8f772] text-[#191b40] rounded-lg hover:bg-[#a8e762] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {isConnected ? (
                    <>Press Enter to send • Shift+Enter for new line • Powered by AI</>
                  ) : (
                    <>AI Backend Offline - Please start the backend server</>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Chatbot