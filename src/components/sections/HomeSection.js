import React from 'react';
import EmailIcon from '@mui/icons-material/Email';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';

const HomeSection = ({ handleResumeClick, handleEmailClick }) => {
  return (
    <section id="home" className="content-section hero-section">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gday-text">G'day</span>,<br className="mobile-break" /> I'm <span className="highlight">Tristan Jones</span>,
          </h1>
          <h2 className="hero-subtitle">
            An <span className="highlight">IT & Operations Manager</span>.
          </h2>
          <p className="hero-description">
            Passionate about delivering exceptional service and innovative technical solutions. With experience managing systems across multiple locations and world-class hospitality service at Fairmont Hotels, I bring a service-oriented approach to technology management.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleResumeClick}>
              <PlagiarismIcon sx={{ fontSize: 18, marginRight: 1 }} />
              Resume
            </button>
            <button className="btn btn-secondary" onClick={handleEmailClick}>
              <EmailIcon sx={{ fontSize: 18, marginRight: 1 }} />
              Get in touch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection; 