import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './ScrollIndicator.css';

const ScrollIndicator = ({ sections, activeSection }) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Hide indicator when user reaches the last section
    const isLastSection = activeSection === sections[sections.length - 1]?.id;
    setIsVisible(!isLastSection);
  }, [activeSection, sections]);

  useEffect(() => {
    // Detect scroll position and user interaction
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // If user is at the very top (within 10px), show indicator again
      if (scrollPosition <= 10) {
        setHasScrolled(false);
      } else if (scrollPosition > 50) {
        // Only hide after scrolling more than 50px to avoid flickering
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToNext = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    const nextIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
    const nextSection = sections[nextIndex];
    
    if (nextSection) {
      const element = document.getElementById(nextSection.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <div 
      className={`scroll-indicator ${!isVisible || hasScrolled ? 'fade-out' : ''}`} 
      onClick={scrollToNext}
    >
      <div className="scroll-arrow">
        <KeyboardArrowDownIcon 
          sx={{ 
            fontSize: 28, 
            color: theme.palette.primary.main 
          }} 
        />
      </div>
    </div>
  );
};

export default ScrollIndicator; 