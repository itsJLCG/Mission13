import React from 'react'

const Footer = () => {
  return (
    <footer className="py-6 mt-16" style={{ background: '#020202' }}>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@700&family=Nunito+Sans:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div
          className="text-lg font-bold"
          style={{ fontFamily: 'Lexend Deca, sans-serif', color: '#b8f772' }}
        >
          Mission13
        </div>
        <div
          className="text-sm"
          style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#f1f3f0' }}
        >
          &copy; {new Date().getFullYear()} Mission13. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a
            href="#"
            className="transition"
            style={{
              fontFamily: 'Lexend Deca, sans-serif',
              color: '#b8f772',
            }}
            onMouseOver={e => (e.currentTarget.style.color = '#f1f3f0')}
            onMouseOut={e => (e.currentTarget.style.color = '#b8f772')}
          >
            Home
          </a>
          <a
            href="#"
            className="transition"
            style={{
              fontFamily: 'Lexend Deca, sans-serif',
              color: '#b8f772',
            }}
            onMouseOver={e => (e.currentTarget.style.color = '#f1f3f0')}
            onMouseOut={e => (e.currentTarget.style.color = '#b8f772')}
          >
            Features
          </a>
          <a
            href="#"
            className="transition"
            style={{
              fontFamily: 'Lexend Deca, sans-serif',
              color: '#b8f772',
            }}
            onMouseOver={e => (e.currentTarget.style.color = '#f1f3f0')}
            onMouseOut={e => (e.currentTarget.style.color = '#b8f772')}
          >
            Team
          </a>
          <a
            href="#"
            className="transition"
            style={{
              fontFamily: 'Lexend Deca, sans-serif',
              color: '#b8f772',
            }}
            onMouseOver={e => (e.currentTarget.style.color = '#f1f3f0')}
            onMouseOut={e => (e.currentTarget.style.color = '#b8f772')}
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer