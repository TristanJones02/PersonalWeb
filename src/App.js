import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Fab } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ScrollIndicator from './components/ScrollIndicator';
import colorThemes from './colorThemes.json';
import './App.css';
import './components/animations/DialogAnimations.css';

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dialogsOpen, setDialogsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState({ primary: '#3b82f6', secondary: '#8b5cf6' });
  const contentRef = useRef(null);
  const isScrollingRef = useRef(false);

  // Create a dynamic theme based on current colors
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: currentTheme.primary,
      },
      secondary: {
        main: currentTheme.secondary,
      },
      background: {
        default: '#0a0a0a',
        paper: '#1a1a1a',
      },
    },
  });

  // Set CSS custom properties for theme colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', currentTheme.primary);
    root.style.setProperty('--secondary-color', currentTheme.secondary);
    
    // Convert hex to RGB for alpha variants
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    
    const primaryRgb = hexToRgb(currentTheme.primary);
    const secondaryRgb = hexToRgb(currentTheme.secondary);
    
    if (primaryRgb) {
      root.style.setProperty('--primary-color-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    }
    if (secondaryRgb) {
      root.style.setProperty('--secondary-color-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
    }
    
    root.style.setProperty('--background-default', darkTheme.palette.background.default);
    root.style.setProperty('--background-paper', darkTheme.palette.background.paper);
  }, [currentTheme, darkTheme.palette.background.default, darkTheme.palette.background.paper]);

  // Function to randomly change theme colors
  const changeThemeColors = () => {
    const randomIndex = Math.floor(Math.random() * colorThemes.length);
    setCurrentTheme(colorThemes[randomIndex]);
  };

  const sections = [
    { id: 'home', label: 'Explore', key: '1' },
    { id: 'about', label: 'About', key: '2' },
    { id: 'experience', label: 'Experience', key: '3' },
    { id: 'projects', label: 'Projects', key: '4' },
    { id: 'stack', label: 'Stack', key: '5' },
    { id: 'travels', label: 'Personal Travels', key: '6' }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const scrollToSection = (sectionId) => {
    isScrollingRef.current = true;
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Reset the scrolling flag after animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Don't process navigation keys if any dialogs are open
      if (dialogsOpen) {
        return;
      }
      
      const key = event.key.toUpperCase();
      const section = sections.find(s => s.key === key);
      if (section) {
        scrollToSection(section.id);
        return;
      }

      // Handle arrow key navigation
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const currentIndex = sections.findIndex(s => s.id === activeSection);
        let newIndex;
        
        if (event.key === 'ArrowLeft') {
          // Go to previous section (with wrapping)
          newIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
        } else {
          // Go to next section (with wrapping)
          newIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
        }
        
        scrollToSection(sections[newIndex].id);
      }
    };

    const handleScroll = () => {
      // Don't update active section while programmatically scrolling
      if (isScrollingRef.current) return;

      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      // Find the section that's currently in view
      let currentSection = 'home';
      
      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i].id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = window.scrollY + rect.top;
          
          if (scrollPosition >= elementTop) {
            currentSection = sections[i].id;
          }
        }
      }
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    const handleMouseMove = (event) => {
      // Only trigger hover expansion when sidebar is collapsed
      if (!sidebarCollapsed) return;
      
      // Calculate 1em in pixels (assuming 16px base font size)
      const oneEm = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const hoverZone = oneEm;
      
      // Check if mouse is within hover zone of left edge
      if (event.clientX <= hoverZone) {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Set initial active section
    handleScroll();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sections, activeSection, sidebarCollapsed, dialogsOpen]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="app">
        {/* Floating Color Picker Button */}
        <Fab
          size="small"
          aria-label="change theme colors"
          onClick={changeThemeColors}
          sx={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          <ColorLensIcon sx={{ color: '#ffffff' }} />
        </Fab>

        <Sidebar
          sections={sections}
          activeSection={activeSection}
          onSectionClick={scrollToSection}
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
        <div className={`main-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} ref={contentRef}>
          <MainContent 
            sections={sections}
            onDialogStateChange={setDialogsOpen}
          />
        </div>
        <ScrollIndicator 
          sections={sections}
          activeSection={activeSection}
        />
      </div>
    </ThemeProvider>
  );
};

export default App; 