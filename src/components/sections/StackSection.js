import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ScrollReveal from '../animations/ScrollReveal';

const StackSection = () => {
  const theme = useTheme();
  const [selectedTech, setSelectedTech] = useState(null);
  const [techModalOpen, setTechModalOpen] = useState(false);
  const [techCategories, setTechCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Environment-based data URLs
  const getDataUrl = (filename) => {
    const isProduction = process.env.NODE_ENV === 'production' || window.location.hostname === 'tristanj.dev';
    const baseUrl = isProduction 
      ? 'https://tristanj.dev/api_cache'
      : 'api_cache';
    return `${baseUrl}/${filename}`;
  };

  // Cache utility functions
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
  
  const getCachedData = (key) => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;
      
      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn(`Error reading cache for ${key}:`, error);
      return null;
    }
  };
  
  const setCachedData = (key, data) => {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn(`Error setting cache for ${key}:`, error);
    }
  };

  // Load data from JSON file with caching
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check for cached data first
        const cachedTechnologies = getCachedData('stackSection_technologies');
        
        if (cachedTechnologies) {
          console.log('Using cached data for StackSection');
          setTechCategories(cachedTechnologies);
          setLoading(false);
          return;
        }
        
        console.log('Fetching fresh data for StackSection');
        const response = await fetch(getDataUrl('technologies.json'));
        const data = await response.json();
        const result = data.result || [];
        
        // Cache the result
        setCachedData('stackSection_technologies', result);
        
        setTechCategories(result);
      } catch (error) {
        console.error('Error loading technologies data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Utility function to convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleTechClick = (tech) => {
    // Set content first, then open dialog after a brief delay
    setSelectedTech(tech);
    setTimeout(() => {
      setTechModalOpen(true);
    }, 50);
  };

  const handleTechModalClose = () => {
    setTechModalOpen(false);
    // Clear selected tech after dialog closes
    setTimeout(() => {
      setSelectedTech(null);
    }, 300);
  };

  if (loading) {
    return (
      <section id="stack" className="content-section">
        <div className="container">
          <Typography variant="h4" style={{ color: '#e5e7eb', textAlign: 'center' }}>
            Loading...
          </Typography>
        </div>
      </section>
    );
  }

  return (
    <section id="stack" className="content-section">
      <div className="container">
        <ScrollReveal direction="up" delay={100}>
          <h2 className="section-title">Tech Stack</h2>
        </ScrollReveal>
        
        {techCategories.map((category, categoryIndex) => (
          <div key={category.categoryName} style={{ marginBottom: '3rem' }}>
            <ScrollReveal direction="up" delay={200 + (categoryIndex * 100)}>
              <h3 
                style={{
                  color: theme.palette.secondary.main,
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}
              >
                {category.categoryName}
              </h3>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={300 + (categoryIndex * 100)}>
              <div 
                className="stack-grid"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  justifyContent: 'center',
                  maxWidth: '900px',
                  margin: '0 auto'
                }}
              >
                {category.technologies && category.technologies.map((tech, techIndex) =>
                  <ScrollReveal 
                    key={tech.name}
                    direction="scale" 
                    delay={400 + (categoryIndex * 100) + (techIndex * 50)}
                  >
                    <div
                      className="stack-item"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem 1rem',
                        border: `1px solid ${hexToRgba(theme.palette.primary.main, 0.3)}`,
                        borderRadius: '12px',
                        backgroundColor: hexToRgba(theme.palette.primary.main, 0.05),
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        minHeight: '140px',
                        position: 'relative',
                        flex: '0 0 200px',
                        minWidth: '140px',
                        maxWidth: '220px'
                      }}
                      onClick={() => handleTechClick(tech)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = hexToRgba(theme.palette.primary.main, 0.6);
                        e.currentTarget.style.backgroundColor = hexToRgba(theme.palette.primary.main, 0.1);
                        e.currentTarget.style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = hexToRgba(theme.palette.primary.main, 0.3);
                        e.currentTarget.style.backgroundColor = hexToRgba(theme.palette.primary.main, 0.05);
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {tech.logoUrl && (
                        <img
                          src={tech.logoUrl}
                          alt={tech.name}
                          style={{
                            width: '64px',
                            height: '64px',
                            objectFit: 'contain',
                            marginBottom: '0.75rem'
                          }}
                        />
                      )}
                      
                      <h3 style={{
                        margin: '0',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#e5e7eb'
                      }}>
                        {tech.name}
                      </h3>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            </ScrollReveal>
          </div>
        ))}
      </div>

      {/* Technology Details Modal */}
      <Dialog
        open={techModalOpen}
        onClose={handleTechModalClose}
        maxWidth="md"
        fullWidth={true}
        PaperProps={{
          className: 'animated-dialog-paper',
          style: {
            backgroundColor: '#1a1a1a',
            border: `1px solid ${hexToRgba(theme.palette.primary.main, 0.3)}`,
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle 
          className="dialog-content-stagger"
          style={{ 
            color: '#e5e7eb',
            borderBottom: `1px solid ${hexToRgba(theme.palette.primary.main, 0.2)}`,
            paddingBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          {selectedTech && selectedTech.logoUrl && (
            <img
              src={selectedTech.logoUrl}
              alt={selectedTech.name}
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain'
              }}
            />
          )}
          {selectedTech && selectedTech.name}
          <IconButton
            aria-label="close"
            onClick={handleTechModalClose}
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#9ca3af'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent className="dialog-content-stagger" style={{ padding: '1.5rem' }}>
          {selectedTech && (
            <Typography 
              variant="body1" 
              style={{ 
                color: '#e5e7eb', 
                lineHeight: '1.6'
              }}
            >
              {selectedTech.description}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default StackSection; 