import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="copyright-text">
          © {currentYear} Tristan Jones. All rights reserved.
        </p>
        <p className="inspiration-text">
          Website inspired by <a href="https://www.cleverdeveloper.in/" target="_blank" rel="noopener noreferrer">https://www.cleverdeveloper.in/</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer; 