import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/city.png'; // Make sure this path is correct for your logo

const Header = () => {
  return (
    <header className="flex items-center justify-between px-20 py-8 bg-white">
      {/* Google Fonts for Lexend Deca */}
      <link
        href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@700&display=swap"
        rel="stylesheet"
      />
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="h-8 mr-2" />
        <div
          className="text-xl font-bold"
          style={{ fontFamily: 'Lexend Deca, sans-serif' }}
        >
          <Link to="/">Mission13</Link>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          to="/login"
          className="px-4 py-2 text-gray-900 font-semibold transition"
          style={{ fontFamily: 'Lexend Deca, sans-serif' }}
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-3 py-2 bg-black text-white border border-black rounded-lg text-gray-900 font-semibold transition hover:bg-[#b8f772]"
          style={{ fontFamily: 'Lexend Deca, sans-serif' }}
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Header;