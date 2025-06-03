import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ScrollIndicator from './components/ScrollIndicator';
import './App.css';

// Create a dark theme for Material-UI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#8b5cf6',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
});

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dialogsOpen, setDialogsOpen] = useState(false);
  const contentRef = useRef(null);
  const isScrollingRef = useRef(false);

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