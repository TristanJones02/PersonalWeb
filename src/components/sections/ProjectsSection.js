import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Chip, useTheme, Card, CardMedia, CardContent, CardActionArea, Box, Grid, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StarIcon from '@mui/icons-material/Star';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import CommitIcon from '@mui/icons-material/Commit';
import BugReportIcon from '@mui/icons-material/BugReport';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScrollReveal from '../animations/ScrollReveal';
import { fetchGitHubStats, formatDate, daysBetween } from '../../utils/githubApi';
import LanguageChart from '../LanguageChart';
import GitHubDataSkeleton from '../GitHubDataSkeleton';

const ProjectsSection = () => {
  const theme = useTheme();
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [githubData, setGithubData] = useState({});
  const [loadingGithub, setLoadingGithub] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoPlayPaused, setAutoPlayPaused] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-play effect
  useEffect(() => {
    if (projectModalOpen && selectedProject?.gallery?.length > 1 && !autoPlayPaused && !isTransitioning) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % selectedProject.gallery.length);
      }, 4000); // Change slide every 4 seconds

      setAutoPlayInterval(interval);
      return () => clearInterval(interval);
    } else {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        setAutoPlayInterval(null);
      }
    }
  }, [projectModalOpen, selectedProject?.gallery?.length, autoPlayPaused, isTransitioning, currentSlide]);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api_cache/projects.json');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        
        // Transform API data to match component format
        const transformedProjects = data.result.map(project => ({
          id: project._id,
          name: project.title,
          shortDescription: extractShortDescription(project.description),
          date: formatProjectDate(project.startDate, project.endDate),
          featuredImage: project.featuredImage?.asset?.url || 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
          keyWords: project.technologies || [],
          github: project.githubUrl,
          links: transformLinks(project.links),
          details: project.description || [], // Keep raw blocks for rich text rendering
          footnotes: `Project created on ${new Date(project._createdAt).toLocaleDateString()}.`,
          gallery: transformGallery(project.images, project.featuredImage),
          features: project.features || []
        }));
        
        setProjects(transformedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Helper function to extract short description from rich text blocks
  const extractShortDescription = (description) => {
    if (!description || !Array.isArray(description)) return '';
    
    // Find the first normal text block
    const textBlock = description.find(block => 
      block._type === 'block' && 
      block.style === 'normal' && 
      block.children && 
      block.children.length > 0
    );
    
    if (textBlock) {
      return textBlock.children
        .map(child => child.text || '')
        .join(' ')
        .substring(0, 150) + '...';
    }
    
    return 'No description available.';
  };

  // Helper function to extract full details from rich text blocks
  const extractDetails = (description) => {
    if (!description || !Array.isArray(description)) return 'No details available.';
    
    return description
      .filter(block => block._type === 'block' && block.children)
      .map(block => {
        const text = block.children
          .map(child => {
            let text = child.text || '';
            if (child.marks && child.marks.includes('strong')) {
              text = `**${text}**`;
            }
            if (child.marks && child.marks.includes('code')) {
              text = `\`${text}\``;
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

  // Rich Text Renderer Component for proper formatting
  const RichTextRenderer = ({ blocks }) => {
    if (!blocks || !Array.isArray(blocks)) {
      return <Typography variant="body1" sx={{ color: '#ddd', lineHeight: 1.7 }}>No details available.</Typography>;
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

  // Helper function to format project dates
  const formatProjectDate = (startDate, endDate) => {
    if (!startDate) return 'Date not specified';
    
    const start = new Date(startDate);
    const startFormatted = start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (endDate) {
      const end = new Date(endDate);
      const endFormatted = end.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      return startFormatted === endFormatted ? startFormatted : `${startFormatted} - ${endFormatted}`;
    }
    
    return startFormatted;
  };

  // Helper function to transform links
  const transformLinks = (links) => {
    if (!links || !Array.isArray(links)) return [];
    
    return links.map(link => ({
      title: link.name || 'Link',
      url: link.link,
      description: `Visit ${link.name || 'this link'} for more information.`,
      image: link.linkImage?.asset?.url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=100&fit=crop'
    }));
  };

  // Helper function to transform gallery images
  const transformGallery = (images, featuredImage) => {
    const gallery = [];
    
    // Add featured image first if it exists
    if (featuredImage?.asset?.url) {
      gallery.push({
        image: featuredImage.asset.url,
        caption: 'Featured project image'
      });
    }
    
    // Add additional images
    if (images && Array.isArray(images)) {
      images.forEach((img, index) => {
        if (img.asset?.url) {
          gallery.push({
            image: img.asset.url,
            caption: `Project image ${index + 1}`
          });
        }
      });
    }
    
    // If no images, add a placeholder
    if (gallery.length === 0) {
      gallery.push({
        image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
        caption: 'Project placeholder image'
      });
    }
    
    return gallery;
  };

  // Helper function to calculate row-based animation delay
  const getRowBasedDelay = (index, projectsPerRow) => {
    const rowIndex = Math.floor(index / projectsPerRow);
    const positionInRow = index % projectsPerRow;
    // Base delay + row delay + small stagger within row
    return 200 + (rowIndex * 150) + (positionInRow * 50);
  };

  // Function to fetch GitHub data
  const fetchProjectGithubData = async (project) => {
    if (!project.github || githubData[project.id] || loadingGithub[project.id]) {
      return; // Skip if no GitHub URL, already loaded, or currently loading
    }

    setLoadingGithub(prev => ({ ...prev, [project.id]: true }));
    
    try {
      console.log(`Fetching GitHub data for ${project.name}`);
      const stats = await fetchGitHubStats(project.github);
      setGithubData(prev => ({ ...prev, [project.id]: stats }));
    } catch (error) {
      console.error(`Failed to fetch GitHub data for ${project.name}:`, error);
      // Set empty data to prevent retry
      setGithubData(prev => ({ ...prev, [project.id]: null }));
    } finally {
      setLoadingGithub(prev => ({ ...prev, [project.id]: false }));
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setCurrentSlide(0);
    setTimeout(() => setProjectModalOpen(true), 50);
    fetchProjectGithubData(project);
  };

  const handleProjectModalClose = () => {
    setProjectModalOpen(false);
    setCurrentSlide(0);
    setIsTransitioning(false);
    setAutoPlayPaused(false);
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
    setTimeout(() => setSelectedProject(null), 300);
  };

  const LinkPreviewCard = ({ link }) => (
    <Card 
      sx={{ 
        mb: 2, 
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          transform: 'translateY(-2px)',
          borderColor: theme.palette.primary.main
        }
      }}
    >
      <CardActionArea 
        onClick={() => window.open(link.url, '_blank')}
        sx={{ display: 'flex', alignItems: 'flex-start', p: 2 }}
      >
        <CardMedia
          component="img"
          sx={{ width: 100, height: 70, borderRadius: 1, mr: 2, flexShrink: 0 }}
          image={link.image}
          alt={link.title}
        />
        <CardContent sx={{ flex: 1, p: 0, '&:last-child': { pb: 0 } }}>
          <Typography variant="subtitle1" sx={{ color: theme.palette.primary.main, mb: 0.5, fontWeight: 600 }}>
            {link.title} <LaunchIcon sx={{ fontSize: 16, ml: 0.5 }} />
          </Typography>
          <Typography variant="body2" sx={{ color: '#bbb', lineHeight: 1.4 }}>
            {link.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  // Slider navigation functions
  const nextSlide = (galleryLength) => {
    if (isTransitioning) return; // Prevent rapid clicking
    setIsTransitioning(true);
    setAutoPlayPaused(true); // Pause auto-play on manual interaction
    setCurrentSlide((prev) => (prev + 1) % galleryLength);
    setTimeout(() => {
      setIsTransitioning(false);
      // Resume auto-play after 8 seconds of manual interaction
      setTimeout(() => setAutoPlayPaused(false), 8000);
    }, 500); // Match CSS transition duration
  };

  const prevSlide = (galleryLength) => {
    if (isTransitioning) return; // Prevent rapid clicking
    setIsTransitioning(true);
    setAutoPlayPaused(true); // Pause auto-play on manual interaction
    setCurrentSlide((prev) => (prev - 1 + galleryLength) % galleryLength);
    setTimeout(() => {
      setIsTransitioning(false);
      // Resume auto-play after 8 seconds of manual interaction
      setTimeout(() => setAutoPlayPaused(false), 8000);
    }, 500); // Match CSS transition duration
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return; // Prevent rapid clicking
    setIsTransitioning(true);
    setAutoPlayPaused(true); // Pause auto-play on manual interaction
    setCurrentSlide(index);
    setTimeout(() => {
      setIsTransitioning(false);
      // Resume auto-play after 8 seconds of manual interaction
      setTimeout(() => setAutoPlayPaused(false), 8000);
    }, 500); // Match CSS transition duration
  };

  return (
    <section id="projects" className="content-section">
      <div className="container">
        <ScrollReveal direction="up" delay={100}>
          <h2 className="section-title">Projects</h2>
        </ScrollReveal>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: '#ff6b6b', mb: 2 }}>
              Error loading projects
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc' }}>
              {error}
            </Typography>
          </Box>
        ) : projects.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: '#ccc' }}>
              There are currently no projects available to show
            </Typography>
          </Box>
        ) : (
          <Box 
            sx={{ 
              mt: 2, 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'center',
              '@media (max-width: 600px)': {
                flexDirection: 'column'
              }
            }}
          >
            {projects.map((project, index) => {
              // Calculate delay based on different responsive breakpoints
              // We'll use desktop (3 per row) as the primary timing since it's most complex
              // Desktop: 3 per row - Row 0: 200,250,300ms, Row 1: 350,400,450ms
              // Tablet: 2 per row would be - Row 0: 200,250ms, Row 1: 350,400ms  
              // Mobile: 1 per row would be - 200,350,500,650ms (one per row)
              
              const animationDelay = getRowBasedDelay(index, 3);
              
              return (
                <ScrollReveal 
                  key={project.id} 
                  direction="up" 
                  delay={animationDelay}
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
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderColor: theme.palette.primary.main,
                          transform: 'translateY(-8px)',
                          boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3)`
                        }
                      }}
                      onClick={() => handleProjectClick(project)}
                    >
                      <Box sx={{ width: '100%', height: 160, overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          image={project.featuredImage}
                          alt={project.name}
                          sx={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center'
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, flexGrow: 1, lineHeight: 1.2, fontSize: '1rem' }}>
                            {project.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#888', ml: 1, flexShrink: 0, fontSize: '0.65rem' }}>
                            {project.date}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ color: '#ccc', mb: 1.5, lineHeight: 1.3, flexGrow: 1, fontSize: '0.8rem' }}>
                          {project.shortDescription}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, mt: 'auto' }}>
                          {project.keyWords.slice(0, 3).map((keyword, index) => (
                            <Chip
                              key={index}
                              label={keyword}
                              size="small"
                              sx={{
                                backgroundColor: `${theme.palette.secondary.main}15`,
                                color: theme.palette.secondary.main,
                                border: `1px solid ${theme.palette.secondary.main}30`,
                                fontSize: '0.6rem',
                                height: 18
                              }}
                            />
                          ))}
                          {project.keyWords.length > 3 && (
                            <Chip
                              label={`+${project.keyWords.length - 3}`}
                              size="small"
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
              );
            })}
          </Box>
        )}
      </div>

      {/* Project Details Modal */}
      <Dialog
        open={projectModalOpen}
        onClose={handleProjectModalClose}
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
            maxWidth: '1400px'
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
                {selectedProject?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                {selectedProject?.date}
              </Typography>
            </Box>
          </Box>
          
          <IconButton
            aria-label="close"
            onClick={handleProjectModalClose}
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
          {selectedProject && (
            <div>
              {/* Two Column Layout */}
              <Box 
                sx={{ 
                  display: 'flex',
                  gap: 4,
                  '@media (max-width: 768px)': {
                    flexDirection: 'column'
                  }
                }}
              >
                {/* Left Column - Main Content (70%) */}
                <Box sx={{ flex: 2 }}>
                  {/* Project Details */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: '#22c55e', mb: 2, fontWeight: 600 }}>
                      Project Details
                    </Typography>
                    <RichTextRenderer blocks={selectedProject.details} />
                  </Box>

                  {/* Links */}
                  {selectedProject.links?.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ color: theme.palette.primary.main, mb: 2, fontWeight: 600 }}>
                        Related Links
                      </Typography>
                      {selectedProject.links.map((link, index) => (
                        <LinkPreviewCard key={index} link={link} />
                      ))}
                    </Box>
                  )}

                  {/* Image Gallery Slider */}
                  {selectedProject.gallery?.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ color: '#f59e0b', mb: 2, fontWeight: 600 }}>
                        Project Gallery
                      </Typography>
                      
                      {/* Slider Container */}
                      <Box sx={{ 
                        position: 'relative', 
                        borderRadius: 2, 
                        overflow: 'hidden',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                      }}
                      onMouseEnter={() => setAutoPlayPaused(true)}
                      onMouseLeave={() => setAutoPlayPaused(false)}
                      >
                        {/* Main Image Display */}
                        <Box sx={{ 
                          position: 'relative', 
                          height: '400px',
                          overflow: 'hidden'
                        }}>
                          {/* Image Container with sliding animation */}
                          <Box
                            sx={{
                              display: 'flex',
                              width: `${selectedProject.gallery.length * 100}%`,
                              height: '100%',
                              transform: `translateX(-${currentSlide * (100 / selectedProject.gallery.length)}%)`,
                              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                          >
                            {selectedProject.gallery.map((item, index) => (
                              <Box
                                key={index}
                                sx={{
                                  width: `${100 / selectedProject.gallery.length}%`,
                                  height: '100%',
                                  flexShrink: 0,
                                }}
                              >
                                <img
                                  src={item.image}
                                  alt={item.caption}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease',
                                  }}
                                  onClick={() => window.open(item.image, '_blank')}
                                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                />
                              </Box>
                            ))}
                          </Box>
                          
                          {/* Navigation Arrows */}
                          {selectedProject.gallery.length > 1 && (
                            <>
                              <IconButton
                                onClick={() => prevSlide(selectedProject.gallery.length)}
                                sx={{
                                  position: 'absolute',
                                  left: 16,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                  color: '#fff',
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                    transform: 'translateY(-50%) scale(1.1)'
                                  },
                                  transition: 'all 0.3s ease',
                                  zIndex: 2
                                }}
                              >
                                <ArrowBackIosIcon />
                              </IconButton>
                              
                              <IconButton
                                onClick={() => nextSlide(selectedProject.gallery.length)}
                                sx={{
                                  position: 'absolute',
                                  right: 16,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                  color: '#fff',
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                    transform: 'translateY(-50%) scale(1.1)'
                                  },
                                  transition: 'all 0.3s ease',
                                  zIndex: 2
                                }}
                              >
                                <ArrowForwardIosIcon />
                              </IconButton>
                            </>
                          )}
                          
                          {/* Image Counter */}
                          <Box sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: '#fff',
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}>
                            {currentSlide + 1} / {selectedProject.gallery.length}
                          </Box>
                        </Box>
                        
                        {/* Image Caption */}
                        <Box sx={{ 
                          p: 2, 
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#fff',
                              fontSize: '0.9rem',
                              lineHeight: 1.4,
                              textAlign: 'center'
                            }}
                          >
                            {selectedProject.gallery[currentSlide]?.caption}
                          </Typography>
                        </Box>
                        
                        {/* Dot Indicators */}
                        {selectedProject.gallery.length > 1 && (
                          <Box sx={{
                            position: 'absolute',
                            bottom: 60,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            padding: '8px 12px',
                            borderRadius: 3
                          }}>
                            {selectedProject.gallery.map((_, index) => (
                              <Box
                                key={index}
                                onClick={() => goToSlide(index)}
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  backgroundColor: currentSlide === index 
                                    ? '#f59e0b' 
                                    : 'rgba(255, 255, 255, 0.4)',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    backgroundColor: currentSlide === index 
                                      ? '#f59e0b' 
                                      : 'rgba(255, 255, 255, 0.7)',
                                    transform: 'scale(1.2)'
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Right Column - Project Metadata (30%) */}
                <Box sx={{ flex: 1, minWidth: '300px' }}>
                  {/* Featured Image */}
                  <Box sx={{ mb: 3 }}>
                    <img
                      src={selectedProject.featuredImage}
                      alt={selectedProject.name}
                      style={{
                        width: '100%',
                        height: '160px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </Box>

                  {/* Repository Info */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#888', mb: 2, fontWeight: 600 }}>
                      Repository Info
                    </Typography>
                    {loadingGithub[selectedProject?.id] ? (
                      <GitHubDataSkeleton />
                    ) : githubData[selectedProject?.id] ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                        {/* First Row */}
                        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                          {/* Stars Card */}
                          <Box sx={{ 
                            flex: 1,
                            p: 2, 
                            backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                            borderRadius: 1,
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <StarIcon sx={{ fontSize: 16, color: '#fff' }} />
                              <Typography variant="caption" sx={{ color: '#ccc' }}>Stars</Typography>
                            </Box>
                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                              {githubData[selectedProject.id].stars?.toLocaleString() || 0}
                            </Typography>
                          </Box>

                          {/* Forks Card */}
                          <Box sx={{ 
                            flex: 1,
                            p: 2, 
                            backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                            borderRadius: 1,
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <CallSplitIcon sx={{ fontSize: 16, color: '#fff' }} />
                              <Typography variant="caption" sx={{ color: '#ccc' }}>Forks</Typography>
                            </Box>
                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                              {githubData[selectedProject.id].forks?.toLocaleString() || 0}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Second Row */}
                        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                          {/* Commits Card */}
                          <Box sx={{ 
                            flex: 1,
                            p: 2, 
                            backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                            borderRadius: 1,
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <CommitIcon sx={{ fontSize: 16, color: '#fff' }} />
                              <Typography variant="caption" sx={{ color: '#ccc' }}>Commits</Typography>
                            </Box>
                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                              {githubData[selectedProject.id].totalCommits?.toLocaleString() || 0}
                            </Typography>
                          </Box>

                          {/* Issues Card */}
                          <Box sx={{ 
                            flex: 1,
                            p: 2, 
                            backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                            borderRadius: 1,
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <BugReportIcon sx={{ fontSize: 16, color: '#fff' }} />
                              <Typography variant="caption" sx={{ color: '#ccc' }}>Issues</Typography>
                            </Box>
                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                              {githubData[selectedProject.id].openIssues?.toLocaleString() || 0}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Third Row */}
                        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                          {/* First Commit Card */}
                          <Box sx={{ 
                            flex: 1,
                            p: 2, 
                            backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                            borderRadius: 1,
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <RocketLaunchIcon sx={{ fontSize: 16, color: '#fff' }} />
                              <Typography variant="caption" sx={{ color: '#ccc' }}>First</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                              {formatDate(githubData[selectedProject.id].firstCommitDate)}
                            </Typography>
                          </Box>

                          {/* Last Commit Card */}
                          <Box sx={{ 
                            flex: 1,
                            p: 2, 
                            backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                            borderRadius: 1,
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <AccessTimeIcon sx={{ fontSize: 16, color: '#fff' }} />
                              <Typography variant="caption" sx={{ color: '#ccc' }}>Latest</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                              {formatDate(githubData[selectedProject.id].lastCommitDate)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#ccc' }}>Total Commits:</Typography>
                          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>1,247</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: '#ccc' }}>Last Commit:</Typography>
                          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>2 days ago</Typography>
                        </Box>
                      </Box>
                    )}
                    {selectedProject?.github && (
                      <Button
                        fullWidth
                        startIcon={<GitHubIcon />}
                        onClick={() => window.open(selectedProject.github, '_blank')}
                        sx={{
                          backgroundColor: '#000',
                          color: '#fff',
                          border: '1px solid #333',
                          '&:hover': {
                            backgroundColor: '#222',
                            borderColor: '#555'
                          },
                          justifyContent: 'center',
                          textTransform: 'none',
                          mt: 2
                        }}
                        variant="contained"
                      >
                        View on GitHub
                      </Button>
                    )}
                  </Box>

                  {/* Languages Section */}
                  {githubData[selectedProject?.id]?.languages && githubData[selectedProject.id].languages.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <LanguageChart languages={githubData[selectedProject.id].languages} />
                    </Box>
                  )}

                  {/* Technologies */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: theme.palette.secondary.main, mb: 2, fontWeight: 600 }}>
                      Technologies
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedProject.keyWords?.map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          size="small"
                          sx={{
                            backgroundColor: `${theme.palette.secondary.main}15`,
                            color: theme.palette.secondary.main,
                            border: `1px solid ${theme.palette.secondary.main}30`,
                            fontSize: '0.75rem'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Project Date */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#888', mb: 1, fontWeight: 600 }}>
                      Project Date
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>
                      {selectedProject.date}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Footnotes - Full Width */}
              {selectedProject.footnotes && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ color: '#888', mb: 2, fontWeight: 600 }}>
                    Additional Notes
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#aaa', 
                      lineHeight: 1.6, 
                      fontStyle: 'italic',
                      p: 2.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      borderRadius: '8px'
                    }}
                  >
                    {selectedProject.footnotes}
                  </Typography>
                </Box>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProjectsSection; 