import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png'; // Make sure this path is correct for your logo

const Header = () => {
  return (
    <header className="flex items-center justify-between px-20 py-8 bg-black">
      {/* Google Fonts for Lexend Deca */}
      <link
        href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@700&display=swap"
        rel="stylesheet"
      />
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="h-12 mr-2" />
        <div
          className="text-xl text-[#599645]"
          style={{ fontFamily: 'Lexend Deca, sans-serif' }}
        >
          <Link to="/">Mission 13</Link>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          to="/login"
          className="px-4 py-2 text-[#599645] transition hover:text-gray-300"
          style={{ fontFamily: 'Lexend Deca, sans-serif' }}
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-3 py-2 bg-[#345a3c] text-[#599645] border border-[#599645] rounded-lg  transition hover:bg-[#eef7b4] hover:text-[#345a3c]"
          style={{ fontFamily: 'Lexend Deca, sans-serif' }}
        >
          Signup
        </Link>
      </div>
    </header>
  );
};

export default Header;