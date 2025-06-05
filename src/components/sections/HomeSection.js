import React from 'react';
import EmailIcon from '@mui/icons-material/Email';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import ScrollReveal from '../animations/ScrollReveal';

const HomeSection = ({ handleResumeClick, handleEmailClick }) => {
  return (
    <section id="home" className="content-section hero-section">
      <div className="container">
        <div className="hero-content">
          <ScrollReveal direction="up" delay={200}>
            <h1 className="hero-title">
              <ScrollReveal direction="left" delay={300} className="inline-reveal">
                <span className="gday-text">G'day</span>,
              </ScrollReveal>
              <br className="mobile-break" /> 
              <ScrollReveal direction="right" delay={500} className="inline-reveal">
                <span className="name-text">I'm <span className="highlight">Tristan Jones</span>,</span>
              </ScrollReveal>
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={400}>
            <h2 className="hero-subtitle">
              An <span className="highlight">IT & Operations Manager</span>.
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={600}>
            <p className="hero-description">
              Passionate about delivering exceptional service and innovative technical solutions. With experience managing systems across multiple locations and world-class hospitality service at Fairmont Hotels, I bring a service-oriented approach to technology management.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={800}>
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
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default HomeSection; 