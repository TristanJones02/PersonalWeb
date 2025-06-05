import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Chip, useTheme, Card, CardMedia, CardContent, CardActionArea, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ProjectsSection = () => {
  const theme = useTheme();
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dummy project data - will be replaced with API later
  const projects = [
    {
      id: 1,
      name: 'E-Commerce Platform Redesign',
      shortDescription: 'Complete overhaul of Pet Fresh\'s e-commerce platform with modern UI/UX and improved performance.',
      date: 'March 2024',
      featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      keyWords: ['React', 'Node.js', 'Customer Experience', 'E-commerce', 'UI/UX Design'],
      github: 'https://github.com/facebook/react',
      links: [
        {
          title: 'Live Demo',
          url: 'https://petfresh-demo.com',
          description: 'Interactive demonstration of the new e-commerce platform with full functionality.',
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=100&fit=crop'
        },
        {
          title: 'Case Study',
          url: 'https://tristanj.dev/case-study/ecommerce',
          description: 'Detailed breakdown of the design process, challenges overcome, and results achieved.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=100&fit=crop'
        }
      ],
      details: `This project involved a complete redesign of Pet Fresh's e-commerce platform to improve user experience and increase conversion rates. The new design features modern UI components, streamlined checkout process, and enhanced product discovery.

Key improvements include:
• 40% faster page load times through optimization
• Mobile-first responsive design
• Integrated inventory management
• Advanced search and filtering capabilities
• Personalized product recommendations`,
      footnotes: `This project was completed in collaboration with the Pet Fresh team over a 6-month period. Special thanks to the customer service team for their valuable feedback during the testing phase.`,
      gallery: [
        {
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
          caption: 'Homepage redesign with modern layout'
        },
        {
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
          caption: 'Product detail page with enhanced features'
        },
        {
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
          caption: 'Streamlined checkout process'
        },
        {
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          caption: 'Mobile responsive design'
        },
        {
          image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=300&fit=crop',
          caption: 'Admin dashboard interface'
        }
      ]
    },
    {
      id: 2,
      name: 'Warehouse Management System',
      shortDescription: 'Custom-built inventory management solution with real-time tracking and predictive analytics.',
      date: 'January 2024',
      featuredImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
      keyWords: ['Python', 'Machine Learning', 'Data Analytics', 'Automation', 'Business Intelligence'],
      github: 'https://github.com/microsoft/vscode',
      links: [
        {
          title: 'System Documentation',
          url: 'https://docs.petfresh.com/wms',
          description: 'Comprehensive documentation covering system architecture, API endpoints, and user guides.',
          image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=100&fit=crop'
        }
      ],
      details: `A comprehensive warehouse management system designed to optimize inventory operations across multiple locations. The system provides real-time inventory tracking, automated reorder points, and predictive analytics for demand forecasting.

Core features:
• Real-time inventory synchronization across 3 locations
• Automated stock level alerts and reorder suggestions
• Barcode scanning integration for rapid processing
• Predictive analytics for demand forecasting
• Integration with existing POS and e-commerce systems
• Comprehensive reporting and analytics dashboard`,
      footnotes: `The system has been deployed across all Pet Fresh locations and has resulted in a 25% reduction in stockouts and 15% improvement in inventory turnover rates.`,
      gallery: [
        {
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
          caption: 'Main dashboard overview'
        },
        {
          image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
          caption: 'Inventory tracking interface'
        },
        {
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          caption: 'Analytics and reporting module'
        }
      ]
    },
    {
      id: 3,
      name: 'Personal Portfolio Website',
      shortDescription: 'Modern, responsive portfolio website built with React featuring dynamic theming and smooth animations.',
      date: 'December 2024',
      featuredImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
      keyWords: ['React', 'Material-UI', 'Responsive Design', 'Animation', 'Portfolio'],
      github: 'https://github.com/vercel/next.js',
      links: [
        {
          title: 'Live Website',
          url: 'https://tristanj.dev',
          description: 'The live portfolio website showcasing projects, experience, and technical skills.',
          image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=200&h=100&fit=crop'
        }
      ],
      details: `A modern portfolio website designed to showcase professional experience and technical projects. Built with React and Material-UI, featuring dynamic color theming, smooth scroll animations, and responsive design.

Technical highlights:
• Dynamic color theme system with random theme generation
• Smooth scroll navigation with keyboard shortcuts
• Responsive design optimized for all device sizes
• Component-based architecture for maintainability
• Performance optimized with lazy loading and caching
• Accessible design following WCAG guidelines`,
      footnotes: `This website serves as both a portfolio and a demonstration of modern web development practices. The design emphasizes clean aesthetics and user experience.`,
      gallery: [
        {
          image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
          caption: 'Homepage with dynamic theming'
        },
        {
          image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
          caption: 'Projects section layout'
        },
        {
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
          caption: 'Mobile responsive design'
        },
        {
          image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=300&fit=crop',
          caption: 'Skills and experience sections'
        }
      ]
    },
    {
      id: 4,
      name: 'AI-Powered Customer Analytics Dashboard',
      shortDescription: 'Machine learning dashboard providing real-time customer insights and predictive behavioral analytics.',
      date: 'November 2024',
      featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      keyWords: ['Machine Learning', 'Data Visualization', 'React', 'Python', 'AI Analytics'],
      github: 'https://github.com/nodejs/node',
      links: [
        {
          title: 'Demo Dashboard',
          url: 'https://analytics-demo.tristanj.dev',
          description: 'Interactive demo of the customer analytics dashboard with sample data.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=100&fit=crop'
        },
        {
          title: 'Technical Blog Post',
          url: 'https://blog.tristanj.dev/ai-analytics',
          description: 'Deep dive into the machine learning algorithms and data processing pipeline.',
          image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=200&h=100&fit=crop'
        }
      ],
      details: `An advanced analytics dashboard that leverages machine learning to provide actionable customer insights. The system processes real-time data streams to predict customer behavior, identify trends, and recommend business strategies.

Key capabilities:
• Real-time customer behavior tracking and analysis
• Predictive models for customer lifetime value and churn
• Automated segmentation using clustering algorithms
• Interactive data visualizations and reporting
• Integration with CRM and marketing automation platforms
• Custom alert system for significant trend changes`,
      footnotes: `This project resulted in a 30% improvement in customer retention rates and helped identify new market opportunities worth $2M in additional revenue.`,
      gallery: [
        {
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          caption: 'Main analytics dashboard'
        },
        {
          image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop',
          caption: 'Customer segmentation visualization'
        },
        {
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
          caption: 'Predictive analytics interface'
        },
        {
          image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=300&fit=crop',
          caption: 'Real-time monitoring dashboard'
        }
      ]
    }
  ];

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setCurrentSlide(0);
    setTimeout(() => setProjectModalOpen(true), 50);
  };

  const handleProjectModalClose = () => {
    setProjectModalOpen(false);
    setCurrentSlide(0);
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
    setCurrentSlide((prev) => (prev + 1) % galleryLength);
  };

  const prevSlide = (galleryLength) => {
    setCurrentSlide((prev) => (prev - 1 + galleryLength) % galleryLength);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section id="projects" className="content-section">
      <div className="container">
        <h2 className="section-title">Projects</h2>
        
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
          {projects.map((project) => (
            <Box
              key={project.id}
              sx={{ 
                flex: {
                  xs: '1 1 100%',      // Full width on mobile
                  sm: '1 1 calc(50% - 8px)',  // Half width on tablet
                  md: '1 1 calc(33.333% - 11px)'  // Third width on desktop
                },
                minWidth: 0,  // Allow shrinking
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
          ))}
        </Box>
      </div>

      {/* Project Details Modal */}
      <Dialog
        open={projectModalOpen}
        onClose={handleProjectModalClose}
        maxWidth={false}
        fullWidth={false}
        PaperProps={{
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
            
            {selectedProject?.github && (
              <Button
                startIcon={<GitHubIcon />}
                onClick={() => window.open(selectedProject.github, '_blank')}
                sx={{
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}15`
                  }
                }}
                variant="outlined"
                size="small"
              >
                GitHub
              </Button>
            )}
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
        
        <DialogContent style={{ padding: '2rem' }}>
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
                    <Typography variant="body1" sx={{ color: '#ddd', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      {selectedProject.details}
                    </Typography>
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
                      }}>
                        {/* Main Image Display */}
                        <Box sx={{ 
                          position: 'relative', 
                          height: '400px',
                          overflow: 'hidden'
                        }}>
                          <img
                            src={selectedProject.gallery[currentSlide]?.image}
                            alt={selectedProject.gallery[currentSlide]?.caption}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.5s ease-in-out',
                              cursor: 'pointer'
                            }}
                            onClick={() => window.open(selectedProject.gallery[currentSlide]?.image, '_blank')}
                          />
                          
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
                    {selectedProject.github && (
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