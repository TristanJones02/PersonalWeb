import React, { useState } from 'react';
import { useTheme, Box, Card, CardMedia, CardContent, Typography, Chip, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlightIcon from '@mui/icons-material/Flight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const PersonalTravelsSection = () => {
  const theme = useTheme();
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [travelModalOpen, setTravelModalOpen] = useState(false);
  const tooltipRef = React.useRef(null);

  // Dummy travel data
  const travels = [
    {
      id: 1,
      destination: 'Tokyo, Japan',
      country: 'Japan',
      countryCode: 'JPN',
      coordinates: [139.6503, 35.6762], // [lng, lat] for react-simple-maps
      postcode: '100-0001',
      date: 'March 2024',
      duration: '10 days',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
      description: 'Explored the vibrant streets of Tokyo, from the bustling districts of Shibuya and Harajuku to the serene gardens of the Imperial Palace.',
      highlights: ['Cherry Blossom Season', 'Sushi at Tsukiji', 'Tech Districts', 'Traditional Temples'],
      tags: ['Culture', 'Food', 'Technology', 'Urban']
    },
    {
      id: 2,
      destination: 'Reykjavik, Iceland',
      country: 'Iceland',
      countryCode: 'ISL',
      coordinates: [-21.9426, 64.1466],
      postcode: '101',
      date: 'January 2024',
      duration: '7 days',
      image: 'https://images.unsplash.com/photo-1539066331-8a08b8db47d2?w=600&h=400&fit=crop',
      description: 'Witnessed the magical Northern Lights and explored the dramatic landscapes of Iceland, including geysers, waterfalls, and glaciers.',
      highlights: ['Northern Lights', 'Blue Lagoon', 'Golden Circle', 'Glacier Tours'],
      tags: ['Nature', 'Adventure', 'Photography', 'Winter']
    },
    {
      id: 3,
      destination: 'Cape Town, South Africa',
      country: 'South Africa',
      countryCode: 'ZAF',
      coordinates: [18.4241, -33.9249],
      postcode: '8001',
      date: 'November 2023',
      duration: '12 days',
      image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&h=400&fit=crop',
      description: 'Discovered the stunning landscapes of Cape Town, from Table Mountain to the Cape of Good Hope, and explored the wine regions.',
      highlights: ['Table Mountain', 'Wine Tasting', 'Penguin Colony', 'Cape Point'],
      tags: ['Nature', 'Wine', 'Wildlife', 'Adventure']
    },
    {
      id: 4,
      destination: 'Sydney, Australia',
      country: 'Australia',
      countryCode: 'AUS',
      coordinates: [151.2093, -33.8688],
      postcode: '2000',
      date: 'September 2023',
      duration: '14 days',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      description: 'Experienced the iconic Sydney Opera House, climbed the Harbour Bridge, and enjoyed the beautiful beaches of Bondi and Manly.',
      highlights: ['Opera House', 'Harbour Bridge', 'Bondi Beach', 'Blue Mountains'],
      tags: ['Urban', 'Beach', 'Architecture', 'Culture']
    },
    {
      id: 5,
      destination: 'Banff, Canada',
      country: 'Canada',
      countryCode: 'CAN',
      coordinates: [-115.5708, 51.1784],
      postcode: 'T1L',
      date: 'July 2023',
      duration: '8 days',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
      description: 'Explored the breathtaking Canadian Rockies, hiked pristine mountain trails, and witnessed stunning alpine lakes.',
      highlights: ['Lake Louise', 'Moraine Lake', 'Mountain Hiking', 'Wildlife Spotting'],
      tags: ['Nature', 'Hiking', 'Mountains', 'Photography']
    }
  ];

  // Countries visited (for map coloring)
  const visitedCountryCodes = [...new Set(travels.map(travel => travel.countryCode))];
  
  // Also create a list of country names for fallback matching
  const visitedCountryNames = [...new Set(travels.map(travel => travel.country.toLowerCase()))];

  const handleTravelClick = (travel) => {
    setSelectedTravel(travel);
    setTimeout(() => setTravelModalOpen(true), 50);
  };

  const handleTravelModalClose = () => {
    setTravelModalOpen(false);
    setTimeout(() => setSelectedTravel(null), 300);
  };

  // World Map Component using react-simple-maps
  const WorldMap = () => (
    <Box sx={{ 
      position: 'relative', 
      backgroundColor: '#1a1a1a',
      borderRadius: 2,
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      minHeight: '600px',
      width: '100%'
    }}>
      <ComposableMap
        projectionConfig={{
          scale: 147,
          center: [0, 20]
        }}
        style={{
          width: '100%',
          height: '600px'
        }}
      >
        <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
          {({ geographies }) => {
            console.log('Geographies loaded:', geographies.length, 'countries');
            return geographies.map((geo) => {
              // Get the country name (this dataset uses lowercase 'name')
              const props = geo.properties;
              const countryName = props.name; // Changed from NAME to name
              
              // Log all properties for first few countries to understand the structure
              if (geographies.indexOf(geo) < 3) {
                console.log('Country #' + geographies.indexOf(geo) + ' properties:', props);
              }
              
              // Log a few specific countries to see what properties we have
              if (countryName && (countryName.includes('Japan') || countryName.includes('Canada') || countryName.includes('Australia'))) {
                console.log('Target country properties:', {
                  name: countryName,
                  allProps: Object.keys(props)
                });
              }
              
              // Simplified direct matching for our specific countries using the correct property
              const isVisited = 
                // Direct name matching
                (countryName === 'Japan') ||
                (countryName === 'Iceland') ||
                (countryName === 'South Africa') ||
                (countryName === 'Australia') ||
                (countryName === 'Canada') ||
                // Contains matching (case insensitive) for variations
                (countryName && countryName.toLowerCase().includes('japan')) ||
                (countryName && countryName.toLowerCase().includes('iceland')) ||
                (countryName && countryName.toLowerCase().includes('south africa')) ||
                (countryName && countryName.toLowerCase().includes('australia')) ||
                (countryName && countryName.toLowerCase().includes('canada'));
              
              // Log any matches
              if (isVisited) {
                console.log('✅ MATCHED VISITED COUNTRY:', {
                  name: countryName
                });
              }
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isVisited ? theme.palette.primary.main : '#2a2a2a'}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      outline: 'none'
                    },
                    hover: {
                      fill: isVisited ? theme.palette.secondary.main : '#3a3a3a',
                      outline: 'none',
                      cursor: isVisited ? 'pointer' : 'default'
                    },
                    pressed: {
                      outline: 'none'
                    }
                  }}
                  onMouseEnter={() => {
                    if (tooltipRef.current) {
                      tooltipRef.current.textContent = countryName;
                      tooltipRef.current.style.display = 'block';
                    }
                  }}
                  onMouseLeave={() => {
                    if (tooltipRef.current) {
                      tooltipRef.current.style.display = 'none';
                    }
                  }}
                />
              );
            });
          }}
        </Geographies>
        
        {/* Travel location markers */}
        {travels.map((travel) => (
          <Marker
            key={travel.id}
            coordinates={travel.coordinates}
            onClick={() => handleTravelClick(travel)}
          >
            <g>
              <circle
                r={8}
                fill={theme.palette.primary.main}
                stroke="#fff"
                strokeWidth={3}
                style={{
                  cursor: 'pointer',
                  filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.7))'
                }}
              />
              <circle
                r={16}
                fill="transparent"
                style={{ cursor: 'pointer' }}
              />
            </g>
          </Marker>
        ))}
      </ComposableMap>
      
      {/* Country name tooltip - managed via ref to avoid re-renders */}
      <Box 
        ref={tooltipRef}
        sx={{
          position: 'absolute',
          left: 10,
          top: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          px: 1,
          py: 0.5,
          borderRadius: 0.5,
          fontSize: '0.75rem',
          fontWeight: 500,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          pointerEvents: 'none',
          zIndex: 1000,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          display: 'none'
        }}
      >
        {/* Content will be set via ref */}
      </Box>
      
      {/* Countries visited indicator */}
      <Box sx={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        px: 2,
        py: 1,
        borderRadius: 1,
        fontSize: '0.875rem',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        🌍 {visitedCountryCodes.length} Countries Visited
      </Box>
      
      {/* Legend */}
      <Box sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        px: 2,
        py: 1,
        borderRadius: 1,
        fontSize: '0.75rem',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: theme.palette.primary.main, borderRadius: 1 }} />
          <Typography variant="caption">Visited</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#2a2a2a', borderRadius: 1 }} />
          <Typography variant="caption">Not Visited</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 10, height: 10, backgroundColor: theme.palette.primary.main, borderRadius: '50%', border: '2px solid #fff' }} />
          <Typography variant="caption">Pin</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <section id="travels" className="content-section">
      <div className="container">
        <h2 className="section-title">Travel & Adventures</h2>
        
        {/* World Map */}
        <Box sx={{ mb: 4 }}>
          <WorldMap />
        </Box>
        
        {/* Travel Cards */}
        <Box 
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            '@media (max-width: 600px)': {
              flexDirection: 'column'
            }
          }}
        >
          {travels.map((travel) => (
            <Box
              key={travel.id}
              sx={{ 
                flex: {
                  xs: '1 1 100%',
                  sm: '1 1 calc(50% - 8px)',
                  md: '1 1 calc(33.333% - 11px)'
                },
                minWidth: 0,
                maxWidth: {
                  xs: '100%',
                  sm: 'calc(50% - 8px)',
                  md: 'calc(33.333% - 11px)'
                }
              }}
            >
              <Card 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3)`
                  }
                }}
                onClick={() => handleTravelClick(travel)}
              >
                <Box sx={{ width: '100%', height: 160, overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    image={travel.image}
                    alt={travel.destination}
                    sx={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, flexGrow: 1, lineHeight: 1.2, fontSize: '1rem' }}>
                      {travel.destination}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888', ml: 1, flexShrink: 0, fontSize: '0.65rem' }}>
                      {travel.date}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: '#ccc', mb: 1.5, lineHeight: 1.3, flexGrow: 1, fontSize: '0.8rem' }}>
                    {travel.description.substring(0, 120)}...
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, mt: 'auto' }}>
                    {travel.tags.slice(0, 3).map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          backgroundColor: `${theme.palette.secondary.main}15`,
                          color: theme.palette.secondary.main,
                          border: `1px solid ${theme.palette.secondary.main}30`,
                          fontSize: '0.6rem',
                          height: 18
                        }}
                      />
                    ))}
                    {travel.tags.length > 3 && (
                      <Chip
                        label={`+${travel.tags.length - 3}`}
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: '#888',
                          fontSize: '0.6rem',
                          height: 18
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </div>

      {/* Travel Details Modal */}
      <Dialog
        open={travelModalOpen}
        onClose={handleTravelModalClose}
        maxWidth={false}
        fullWidth={false}
        PaperProps={{
          style: {
            backgroundColor: '#1a1a1a',
            border: `1px solid ${theme.palette.primary.main}30`,
            borderRadius: '16px',
            maxHeight: '90vh',
            width: '90vw',
            maxWidth: '1200px'
          }
        }}
      >
        <DialogTitle 
          style={{ 
            color: '#fff',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '1rem',
            position: 'relative'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pr: 6 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5, color: '#fff' }}>
                {selectedTravel?.destination}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: '1rem', color: '#888' }} />
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    {selectedTravel?.date}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FlightIcon sx={{ fontSize: '1rem', color: '#888' }} />
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    {selectedTravel?.duration}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          
          <IconButton
            aria-label="close"
            onClick={handleTravelModalClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#888',
              '&:hover': { color: '#fff' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent style={{ padding: '2rem' }}>
          {selectedTravel && (
            <Box sx={{ 
              display: 'flex',
              gap: 4,
              '@media (max-width: 768px)': {
                flexDirection: 'column'
              }
            }}>
              {/* Left Column - Image and Description */}
              <Box sx={{ flex: 2 }}>
                <Box sx={{ mb: 3 }}>
                  <img
                    src={selectedTravel.image}
                    alt={selectedTravel.destination}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </Box>
                
                <Typography variant="h6" sx={{ color: '#22c55e', mb: 2, fontWeight: 600 }}>
                  Travel Experience
                </Typography>
                <Typography variant="body1" sx={{ color: '#ddd', lineHeight: 1.7, mb: 3 }}>
                  {selectedTravel.description}
                </Typography>
                
                <Typography variant="h6" sx={{ color: '#f59e0b', mb: 2, fontWeight: 600 }}>
                  Highlights
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedTravel.highlights?.map((highlight, index) => (
                    <Chip
                      key={index}
                      label={highlight}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        backgroundColor: `${theme.palette.primary.main}15`,
                        color: theme.palette.primary.main,
                        border: `1px solid ${theme.palette.primary.main}30`
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Right Column - Travel Details */}
              <Box sx={{ flex: 1, minWidth: '300px' }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#888', mb: 2, fontWeight: 600 }}>
                    Location Details
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#ccc' }}>Country:</Typography>
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>{selectedTravel.country}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#ccc' }}>Coordinates:</Typography>
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                        {selectedTravel.coordinates?.[0]?.toFixed(2)}, {selectedTravel.coordinates?.[1]?.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#ccc' }}>Postcode:</Typography>
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>{selectedTravel.postcode}</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: theme.palette.secondary.main, mb: 2, fontWeight: 600 }}>
                    Travel Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedTravel.tags?.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          backgroundColor: `${theme.palette.secondary.main}15`,
                          color: theme.palette.secondary.main,
                          border: `1px solid ${theme.palette.secondary.main}30`
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PersonalTravelsSection; 