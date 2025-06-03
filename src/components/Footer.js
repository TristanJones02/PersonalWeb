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
      </div>
    </footer>
  );
};

export default Footer; 