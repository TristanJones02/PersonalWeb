import React, { useState, useEffect } from 'react';
import { useTheme, Box, Card, CardMedia, CardContent, Typography, Chip, Dialog, DialogTitle, DialogContent, IconButton, CircularProgress } from '@mui/material';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlightIcon from '@mui/icons-material/Flight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScrollReveal from '../animations/ScrollReveal';

const PersonalTravelsSection = () => {
  const theme = useTheme();
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [travelModalOpen, setTravelModalOpen] = useState(false);
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tooltipRef = React.useRef(null);

  // Fetch travels from API
  useEffect(() => {
    const fetchTravels = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api_cache/travel.json');
        if (!response.ok) {
          throw new Error('Failed to fetch travels');
        }
        const data = await response.json();
        
        // Transform API data to match component format
        const transformedTravels = data.result.map(travel => ({
          id: travel._id,
          destination: travel.destination,
          place: travel.place,
          country: travel.country,
          countryCode: travel.countryCode,
          coordinates: travel.coordinates,
          postcode: travel.postcode,
          date: travel.date,
          duration: travel.duration,
          image: travel.image?.asset?.url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
          description: travel.description || [], // Keep raw blocks for rich text rendering
          descriptionPreview: extractDescriptionPreview(travel.description), // Plain text for cards
          highlights: travel.highlights || [],
          tags: travel.tags || [],
          gallery: transformGallery(travel.gallery)
        }));
        
        setTravels(transformedTravels);
      } catch (err) {
        console.error('Error fetching travels:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTravels();
  }, []);

  // Helper function to extract description from rich text blocks
  const extractDescription = (description) => {
    if (!description || !Array.isArray(description)) return 'No description available.';
    
    return description
      .filter(block => block._type === 'block' && block.children)
      .map(block => {
        const text = block.children
          .map(child => {
            let text = child.text || '';
            if (child.marks && child.marks.includes('strong')) {
              text = `**${text}**`;
            }
            return text;
          })
          .join('');
        
        if (block.listItem === 'bullet') {
          return `• ${text}`;
        }
        if (block.style === 'h2') {
          return `\n## ${text}\n`;
        }
        return text;
      })
      .join('\n')
      .trim();
  };

  // Helper function to extract plain text preview for cards
  const extractDescriptionPreview = (description) => {
    if (!description || !Array.isArray(description)) return 'No description available.';
    
    // Get only normal text blocks (not headings or bullets) for preview
    const textBlocks = description
      .filter(block => 
        block._type === 'block' && 
        block.children && 
        block.style === 'normal' && 
        !block.listItem
      )
      .map(block => 
        block.children
          .map(child => child.text || '')
          .join(' ')
      )
      .join(' ')
      .trim();
    
    // Return truncated preview
    return textBlocks.length > 120 ? textBlocks.substring(0, 120) + '...' : textBlocks;
  };

  // Rich Text Renderer Component for proper formatting
  const RichTextRenderer = ({ blocks }) => {
    if (!blocks || !Array.isArray(blocks)) {
      return <Typography variant="body1" sx={{ color: '#ddd', lineHeight: 1.7 }}>No description available.</Typography>;
    }

    return (
      <Box>
        {blocks
          .filter(block => block._type === 'block' && block.children)
          .map((block, blockIndex) => {
            const blockContent = block.children.map((child, childIndex) => {
              const text = child.text || '';
              const marks = child.marks || [];
              
              let element = text;
              
              if (marks.includes('strong')) {
                element = <strong key={childIndex}>{text}</strong>;
              } else if (marks.includes('code')) {
                element = <code key={childIndex} style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  padding: '2px 4px', 
                  borderRadius: '3px',
                  fontFamily: 'monospace',
                  fontSize: '0.9em'
                }}>{text}</code>;
              } else {
                element = <span key={childIndex}>{text}</span>;
              }
              
              return element;
            });

            // Handle different block styles
            if (block.listItem === 'bullet') {
              return (
                <Typography 
                  key={blockIndex} 
                  component="li" 
                  variant="body1" 
                  sx={{ 
                    color: '#ddd', 
                    lineHeight: 1.7, 
                    mb: 0.5,
                    listStyleType: 'disc',
                    ml: 2
                  }}
                >
                  {blockContent}
                </Typography>
              );
            } else if (block.style === 'h2') {
              return (
                <Typography 
                  key={blockIndex} 
                  variant="h6" 
                  sx={{ 
                    color: '#fff', 
                    fontWeight: 600, 
                    mt: 2, 
                    mb: 1,
                    fontSize: '1.1rem'
                  }}
                >
                  {blockContent}
                </Typography>
              );
            } else if (block.style === 'h3') {
              return (
                <Typography 
                  key={blockIndex} 
                  variant="subtitle1" 
                  sx={{ 
                    color: '#fff', 
                    fontWeight: 600, 
                    mt: 1.5, 
                    mb: 0.5,
                    fontSize: '1rem'
                  }}
                >
                  {blockContent}
                </Typography>
              );
            } else {
              return (
                <Typography 
                  key={blockIndex} 
                  variant="body1" 
                  sx={{ 
                    color: '#ddd', 
                    lineHeight: 1.7, 
                    mb: 1
                  }}
                >
                  {blockContent}
                </Typography>
              );
            }
          })}
      </Box>
    );
  };

  // Helper function to transform gallery images
  const transformGallery = (gallery) => {
    if (!gallery || !Array.isArray(gallery)) return [];
    
    return gallery
      .filter(item => item.image?.asset?.url)
      .map((item, index) => ({
        image: item.image.asset.url,
        caption: item.caption || `Gallery image ${index + 1}`
      }));
  };

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
              if (countryName && visitedCountryNames.some(visited => countryName.toLowerCase().includes(visited))) {
                console.log('Target country properties:', {
                  name: countryName,
                  allProps: Object.keys(props)
                });
              }
              
              // Check if this country is visited using multiple matching strategies
              const isVisited = 
                // Direct country code matching
                visitedCountryCodes.some(code => 
                  props.ISO_A3 === code || 
                  props.ISO_A2 === code || 
                  props.ADM0_A3 === code
                ) ||
                // Direct name matching
                visitedCountryNames.some(visited => 
                  countryName && countryName.toLowerCase().includes(visited)
                ) ||
                // Specific country name variations
                travels.some(travel => {
                  const travelCountry = travel.country.toLowerCase();
                  const mapCountry = countryName ? countryName.toLowerCase() : '';
                  return mapCountry.includes(travelCountry) || travelCountry.includes(mapCountry);
                });
              
              // Log any matches
              if (isVisited) {
                console.log('✅ MATCHED VISITED COUNTRY:', {
                  name: countryName,
                  visitedCountries: travels.map(t => t.country)
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
        <ScrollReveal direction="up" delay={100}>
          <h2 className="section-title">Travel & Adventures</h2>
        </ScrollReveal>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: '#ff6b6b', mb: 2 }}>
              Error loading travels
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc' }}>
              {error}
            </Typography>
          </Box>
        ) : travels.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: '#ccc' }}>
              No travels to display yet. Stay tuned for upcoming adventures!
            </Typography>
          </Box>
        ) : (
          <>
            {/* World Map - Only show if there are travels */}
            <ScrollReveal direction="up" delay={200}>
              <Box sx={{ mb: 4 }}>
                <WorldMap />
              </Box>
            </ScrollReveal>
            
            {/* Travel Cards */}
            <ScrollReveal direction="up" delay={300}>
              <Box 
                sx={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  justifyContent: 'center',
                  '@media (max-width: 900px)': {
                    flexDirection: 'column'
                  },
                }}
              >
                {travels.map((travel, index) => (
                  <ScrollReveal 
                    key={travel.id} 
                    direction="up" 
                    delay={400 + (index * 100)}
                    threshold={0.1}
                    className="project-grid-item"
                  >
                    <Box
                      sx={{ 
                        width: '100%',
                        height: '100%'
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
                              height: '250px',
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
                            {travel.descriptionPreview}
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
                  </ScrollReveal>
                ))}
              </Box>
            </ScrollReveal>
          </>
        )}
      </div>

      {/* Travel Details Modal */}
      <Dialog
        open={travelModalOpen}
        onClose={handleTravelModalClose}
        maxWidth={false}
        fullWidth={false}
        PaperProps={{
          className: 'large-dialog-paper',
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
          className="dialog-content-stagger"
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
        
        <DialogContent className="dialog-content-stagger" style={{ 
          padding: '2rem',
          overflowY: 'auto',
          maxHeight: 'calc(90vh - 120px)'
        }}>
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
                <Typography variant="h6" sx={{ color: '#22c55e', mb: 2, fontWeight: 600 }}>
                  Travel Experience
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <RichTextRenderer blocks={selectedTravel.description} />
                </Box>
                
                {/* Image Gallery - Masonry Style */}
                {selectedTravel.gallery && selectedTravel.gallery.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Box
                      sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 2,
                        '& > *': {
                          breakInside: 'avoid'
                        }
                      }}
                    >
                      {selectedTravel.gallery.map((photo, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: 'relative',
                            borderRadius: 2,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
                              borderColor: theme.palette.primary.main
                            },
                            '&:hover .caption': {
                              opacity: 1
                            }
                          }}
                          onClick={() => window.open(photo.image, '_blank')}
                        >
                          <img
                            src={photo.image}
                            alt={photo.caption}
                            style={{
                              width: '100%',
                              height: '250px',
                              objectFit: 'cover',
                              display: 'block',
                              transition: 'transform 0.3s ease'
                            }}
                          />
                          {/* Caption overlay */}
                          <Box
                            className="caption"
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                              color: '#fff',
                              p: 2,
                              opacity: 0,
                              transition: 'opacity 0.3s ease'
                            }}
                          >
                            <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
                              {photo.caption}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Right Column - Travel Details */}
              <Box sx={{ flex: 1, minWidth: '300px' }}>
                <Box sx={{ mb: 3 }}>
                  <img
                    src={selectedTravel.image}
                    alt={selectedTravel.destination}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}
                  />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#888', mb: 2, fontWeight: 600 }}>
                    Location Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                    {/* First Row */}
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                      {/* Location Card */}
                      <Box sx={{ 
                        flex: 1,
                        p: 2, 
                        backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                        borderRadius: 1,
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocationOnIcon sx={{ fontSize: 16, color: '#fff' }} />
                          <Typography variant="caption" sx={{ color: '#ccc' }}>Location</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                          {selectedTravel.place}
                        </Typography>
                      </Box>

                      {/* Country Card */}
                      <Box sx={{ 
                        flex: 1,
                        p: 2, 
                        backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                        borderRadius: 1,
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PublicIcon sx={{ fontSize: 16, color: '#fff' }} />
                          <Typography variant="caption" sx={{ color: '#ccc' }}>Country</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                          {selectedTravel.country}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Second Row */}
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                      {/* Duration Card */}
                      <Box sx={{ 
                        flex: 1,
                        p: 2, 
                        backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                        borderRadius: 1,
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: '#fff' }} />
                          <Typography variant="caption" sx={{ color: '#ccc' }}>Duration</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                          {selectedTravel.duration}
                        </Typography>
                      </Box>

                      {/* Date Card */}
                      <Box sx={{ 
                        flex: 1,
                        p: 2, 
                        backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                        borderRadius: 1,
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarTodayIcon sx={{ fontSize: 16, color: '#fff' }} />
                          <Typography variant="caption" sx={{ color: '#ccc' }}>Date</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                          {selectedTravel.date}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#f59e0b', mb: 2, fontWeight: 600 }}>
                    Highlights
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedTravel.highlights?.map((highlight, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 1.5,
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: 1,
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          flex: '1 1 auto',
                          minWidth: '120px',
                          textAlign: 'center',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderColor: theme.palette.primary.main
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, fontSize: '0.8rem' }}>
                          {highlight}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: theme.palette.secondary.main, mb: 2, fontWeight: 600 }}>
                    Travel Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedTravel.tags?.map((tag, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 1.5,
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: 1,
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          flex: '1 1 auto',
                          minWidth: '120px',
                          textAlign: 'center',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderColor: theme.palette.secondary.main
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, fontSize: '0.8rem' }}>
                          {tag}
                        </Typography>
                      </Box>
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