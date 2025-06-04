import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StackSection = () => {
  const theme = useTheme();
  const [selectedTech, setSelectedTech] = useState(null);
  const [techModalOpen, setTechModalOpen] = useState(false);

  const technologies = [
    { name: 'Cloudflare', icon: '/stack_icons/cloudflare.png' },
    { name: 'Digital Ocean', icon: '/stack_icons/digitalocean.png' },
    { name: 'Electron', icon: '/stack_icons/electron.png' },
    { name: 'Idealpos', icon: '/stack_icons/idealpos.png' },
    { name: 'Jira', icon: '/stack_icons/jira.png' },
    { name: 'Material UI', icon: '/stack_icons/material.png' },
    { name: 'Postgresql', icon: '/stack_icons/postgres.png' },
    { name: 'qPilot', icon: '/stack_icons/qpilot.png' },
    { name: 'React', icon: '/stack_icons/react.png' },
    { name: 'Track-POD', icon: '/stack_icons/trackpod.png' },
    { name: 'WooCommerce', icon: '/stack_icons/woocommerce.png' },
    { name: 'Wordpress', icon: '/stack_icons/wordpress.png' }
  ];

  const techDetails = {
    'Cloudflare': {
      name: 'Cloudflare',
      description: 'Global CDN and web security platform providing DNS, DDoS protection, and performance optimization. Used to secure and accelerate website delivery with advanced caching and security features.'
    },
    'Digital Ocean': {
      name: 'Digital Ocean',
      description: 'Cloud infrastructure provider offering scalable virtual private servers and managed databases. Utilized for hosting applications and services with reliable performance and easy deployment options.'
    },
    'Electron': {
      name: 'Electron',
      description: 'Framework for building cross-platform desktop applications using web technologies. Enables development of native desktop apps with HTML, CSS, and JavaScript for Windows, macOS, and Linux.'
    },
    'Idealpos': {
      name: 'Idealpos',
      description: 'Point-of-sale system designed for retail businesses with inventory management and sales tracking. Implemented and maintained across multiple Pet Fresh locations for streamlined operations.'
    },
    'Jira': {
      name: 'Jira',
      description: 'Project management and issue tracking software for agile development teams. Used for organizing tasks, tracking progress, and managing software development workflows efficiently.'
    },
    'Material UI': {
      name: 'Material UI',
      description: 'React component library implementing Google\'s Material Design principles. Provides pre-built, customizable components for creating modern and consistent user interfaces quickly.'
    },
    'Postgresql': {
      name: 'PostgreSQL',
      description: 'Advanced open-source relational database system with strong ACID compliance and extensive features. Used for storing and managing complex business data with reliability and performance.'
    },
    'qPilot': {
      name: 'qPilot',
      description: 'Warehouse management system for inventory control and order fulfillment optimization. Implemented to streamline warehouse operations and improve stock forecasting accuracy at Pet Fresh.'
    },
    'React': {
      name: 'React',
      description: 'JavaScript library for building interactive user interfaces with component-based architecture. Used for creating modern, responsive web applications with efficient state management and reusable components.'
    },
    'Track-POD': {
      name: 'Track-POD',
      description: 'Delivery tracking and proof-of-delivery management system for logistics operations. Integrated to provide real-time shipment tracking and delivery confirmation for customer orders.'
    },
    'WooCommerce': {
      name: 'WooCommerce',
      description: 'E-commerce plugin for WordPress enabling online store functionality with payment processing and inventory management. Utilized for building and maintaining online retail platforms with extensive customization options.'
    },
    'Wordpress': {
      name: 'WordPress',
      description: 'Content management system powering websites and blogs with extensive plugin ecosystem. Used for creating and managing business websites with custom themes and functionality for various client needs.'
    }
  };

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

  return (
    <section id="stack" className="content-section">
      <div className="container">
        <h2 className="section-title">Tech Stack</h2>
        <div 
          className="stack-grid"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.25rem',
            justifyContent: 'center',
            marginTop: '1.5rem',
            maxWidth: '900px',
            margin: '1.5rem auto 0'
          }}
        >
          {technologies.map(tech =>
            <div
              key={tech.name}
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
                // Show text on hover
                const textElement = e.currentTarget.querySelector('.stack-text');
                if (textElement) {
                  textElement.style.opacity = '1';
                  textElement.style.transform = 'translateX(-50%) translateY(0)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = hexToRgba(theme.palette.primary.main, 0.3);
                e.currentTarget.style.backgroundColor = hexToRgba(theme.palette.primary.main, 0.05);
                e.currentTarget.style.transform = 'translateY(0)';
                // Hide text when not hovering
                const textElement = e.currentTarget.querySelector('.stack-text');
                if (textElement) {
                  textElement.style.opacity = '0';
                  textElement.style.transform = 'translateX(-50%) translateY(8px)';
                }
              }}
            >
              <img
                src={tech.icon}
                alt={tech.name}
                style={{
                  width: '100px',
                  height: '58px',
                  objectFit: 'contain'
                }}
              />
              <span
                className="stack-text"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  color: '#e5e7eb',
                  opacity: '0',
                  transition: 'all 0.3s ease',
                  position: 'absolute',
                  bottom: '1rem',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(8px)',
                  whiteSpace: 'nowrap'
                }}
              >
                {tech.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tech Details Modal */}
      <Dialog
        open={techModalOpen}
        onClose={handleTechModalClose}
        maxWidth="md"
        fullWidth={true}
        PaperProps={{
          style: {
            backgroundColor: '#1a1a1a',
            border: `1px solid ${hexToRgba(theme.palette.primary.main, 0.3)}`,
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle 
          style={{ 
            color: '#e5e7eb',
            borderBottom: `1px solid ${hexToRgba(theme.palette.primary.main, 0.2)}`,
            paddingBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          {selectedTech && (
            <img
              src={selectedTech.icon}
              alt={selectedTech.name}
              style={{
                width: '40px',
                height: '24px',
                objectFit: 'contain'
              }}
            />
          )}
          {selectedTech && techDetails[selectedTech.name]?.name}
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
        
        <DialogContent style={{ padding: '1.5rem' }}>
          {selectedTech && (
            <Typography 
              variant="body1" 
              style={{ 
                color: '#e5e7eb', 
                lineHeight: '1.6',
                fontSize: '1rem'
              }}
            >
              {techDetails[selectedTech.name]?.description}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default StackSection; 