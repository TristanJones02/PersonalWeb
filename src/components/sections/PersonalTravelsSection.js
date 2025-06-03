import React from 'react';
import { useTheme } from '@mui/material/styles';
import SnowboardingIcon from '@mui/icons-material/Snowboarding';

const PersonalTravelsSection = () => {
  const theme = useTheme();
  
  return (
    <section id="travels" className="content-section">
      <div className="container">
        <h2 className="section-title">Travel Section Coming Soon</h2>
        <div className="travels-content">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '3rem 1rem',
            minHeight: '200px'
          }}>
            <SnowboardingIcon 
              style={{
                fontSize: '4rem',
                color: theme.palette.primary.main,
                marginBottom: '1.5rem'
              }}
            />
            <p style={{
              fontSize: '1.1rem',
              color: '#e5e7eb',
              maxWidth: '500px',
              lineHeight: '1.6'
            }}>
              This section will be coming soon, in a future update of this website.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalTravelsSection; 