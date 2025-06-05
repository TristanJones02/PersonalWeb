import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const LanguageChart = ({ languages = [] }) => {
  const theme = useTheme();
  
  // Filter out languages with 0.0% to only show meaningful data
  const filteredLanguages = languages.filter(lang => parseFloat(lang.percentage) > 0);
  
  if (!filteredLanguages || filteredLanguages.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#888' }}>
          No language data available
        </Typography>
      </Box>
    );
  }

  // Color palette for different languages
  const getLanguageColor = (language, index) => {
    const colors = [
      '#f1c40f', // JavaScript - yellow
      '#e74c3c', // HTML - red
      '#3498db', // CSS - blue
      '#2ecc71', // Python - green
      '#9b59b6', // TypeScript - purple
      '#e67e22', // Java - orange
      '#34495e', // C++ - dark blue
      '#1abc9c', // Go - teal
      '#e91e63', // Swift - pink
      '#ff9800', // Rust - orange
      '#795548', // PHP - brown
      '#607d8b', // C# - blue grey
    ];
    
    // Map common languages to specific colors
    const languageColorMap = {
      'JavaScript': '#f1c40f',
      'TypeScript': '#3178c6',
      'HTML': '#e34f26',
      'CSS': '#1572b6',
      'Python': '#3776ab',
      'Java': '#007396',
      'C++': '#00599c',
      'Go': '#00add8',
      'Rust': '#000000',
      'Swift': '#fa7343',
      'PHP': '#777bb4',
      'C#': '#239120',
      'Ruby': '#cc342d',
      'C': '#a8b9cc',
      'Shell': '#89e051',
      'EJS': '#8bc34a',
      'Vue': '#4fc08d',
      'React': '#61dafb'
    };
    
    return languageColorMap[language] || colors[index % colors.length];
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ color: '#888', mb: 2, fontWeight: 600 }}>
        Languages
      </Typography>
      
      {/* Language bars */}
      <Box sx={{ mb: 2 }}>
        {filteredLanguages.map((lang, index) => (
          <Box key={lang.name} sx={{ mb: 1.5 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 0.5 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: getLanguageColor(lang.name, index),
                    flexShrink: 0
                  }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ color: '#fff', fontWeight: 500, fontSize: '0.875rem' }}
                >
                  {lang.name}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ color: '#ccc', fontWeight: 600, fontSize: '0.875rem' }}
              >
                {lang.percentage}%
              </Typography>
            </Box>
            
            {/* Progress bar */}
            <Box
              sx={{
                width: '100%',
                height: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  width: `${lang.percentage}%`,
                  height: '100%',
                  backgroundColor: getLanguageColor(lang.name, index),
                  borderRadius: 1,
                  transition: 'width 0.8s ease-out',
                  background: `linear-gradient(90deg, ${getLanguageColor(lang.name, index)}, ${getLanguageColor(lang.name, index)}dd)`
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LanguageChart; 