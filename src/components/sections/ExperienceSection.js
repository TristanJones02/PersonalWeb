import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ExperienceItem = ({ job, onClick }) => {
  const theme = useTheme();
  
  // Define fallback data for jobs since the JSON data is incomplete
  const jobFallbacks = {
    0: { // First job (Perth • Hybrid Role)
      jobTitle: 'IT & Operations Manager',
      companyName: 'Pet Fresh',
      date: 'November 2023 — Present',
      shortDescription: 'Maintained and developed systems & integrations between IT systems across 3 locations, supporting all business systems from eCommerce to POS. Implemented various off-the-shelf and custom developed systems, including a Warehouse Management System that assists in warehouse operations and stock forecasting.',
      companyLogo: '/company_icons/Pet_Fresh.png'
    },
    1: { // Second job (Whistler, BC, Canada)
      jobTitle: 'In Room Dining (Room Service) Server',
      companyName: 'Fairmont Whistler Hotel',
      date: 'November 2023 — December 2024',
      shortDescription: 'Delivered exceptional 5-star hotel experience directly to guest rooms, upholding the world-renowned standards of the Fairmont brand while maintaining the highest level of customer service excellence.',
      companyLogo: '/company_icons/Accor.png',
      companyLogo2: '/company_icons/Fairmont_Whis.png'
    },
    2: { // Third job (Perth)
      jobTitle: 'Customer Service Representative & Retail Attendant',
      companyName: 'Pet Fresh',
      date: 'August 2017 — November 2023',
      shortDescription: 'Assisted customers by providing expert product recommendations for dogs with allergies, varying body conditions, and breed-specific nutritional needs. Delivered exceptional customer service while educating pet owners on locally-sourced, vet-formulated pet food solutions.',
      companyLogo: '/company_icons/Pet_Fresh.png'
    }
  };
  
  const fallback = jobFallbacks[job.index] || {};
  
  return (
    <div className="experience-item" style={{ cursor: 'pointer' }} onClick={onClick}>
      <div className="experience-header">
        <h3 className="experience-title">{job.jobTitle || fallback.jobTitle}</h3>
        <span className="experience-period">{job.date || fallback.date}</span>
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <div>
          <p className="experience-company">{job.companyName || fallback.companyName}</p>
          {job.location && <p className="experience-location">{job.location}</p>}
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          {(job.companyLogo || fallback.companyLogo) && (
            <img
              src={job.companyLogo || fallback.companyLogo}
              alt={job.companyName || fallback.companyName}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '12px',
                objectFit: 'contain'
              }}
            />
          )}
          {fallback.companyLogo2 && (
            <img
              src={fallback.companyLogo2}
              alt={job.companyName || fallback.companyName}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '12px',
                objectFit: 'contain'
              }}
            />
          )}
        </div>
      </div>
      <p className="experience-description">
        {job.shortDescription || fallback.shortDescription}
        <span style={{ color: theme.palette.primary.main, fontWeight: '500' }}> Click for detailed experience.</span>
      </p>
    </div>
  );
};

const ExperienceSection = () => {
  const theme = useTheme();
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
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
        const cachedJobs = getCachedData('experienceSection_jobs');
        
        if (cachedJobs) {
          console.log('Using cached data for ExperienceSection');
          setJobs(cachedJobs);
          setLoading(false);
          return;
        }
        
        console.log('Fetching fresh data for ExperienceSection');
        const response = await fetch(getDataUrl('jobs.json'));
        const data = await response.json();
        // Add index to each job for fallback mapping
        const jobsWithIndex = (data.result || []).map((job, index) => ({
          ...job,
          index
        }));
        
        // Cache the result
        setCachedData('experienceSection_jobs', jobsWithIndex);
        
        setJobs(jobsWithIndex);
      } catch (error) {
        console.error('Error loading jobs data:', error);
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

  // Detailed experience data (kept as fallback since the JSON data doesn't include this level of detail)
  const experienceDetails = {
    0: { // IT & Operations Manager
      title: 'IT & Operations Manager',
      company: 'Pet Fresh',
      location: 'Perth • Hybrid Role',
      period: 'November 2023 — Present',
      description: 'Maintained, and developed systems & integrations between IT systems in the company over 3 locations, through support all business systems from eCommerce to POS. During this I implemented various both Off the Shelf Systems, and custom developed systems, such as a Warehouse Management System which assists in warehouse operations, including stock forecasting, while also publishing employee schedules and managing the customer service team.',
      keyResponsibilities: [
        'Maintained and developed systems & integrations between IT systems across 3 locations',
        'Supported all business systems from eCommerce to POS with 99.9% uptime',
        'Implemented Warehouse Management System improving stock forecasting by 30%',
        'Led digital transformation initiatives and custom system development',
        'Managed vendor relationships and technology procurement processes',
        'Provided technical training and support to staff across all locations'
      ],
      skillsUsed: [
        'System Integration & API Development',
        'Project Management & Implementation',
        'Vendor Management & Procurement', 
        'Database Administration & Optimization',
        'Network Infrastructure Management',
        'Staff Training & Technical Support',
        'Business Process Analysis',
        'Warehouse Management Systems',
        'eCommerce Platform Management',
        'POS System Administration'
      ],
      keyLearnings: [
        'Advanced understanding of retail technology ecosystems and integration challenges',
        'Project management skills for complex multi-location system implementations',
        'Leadership experience managing technology initiatives across diverse teams',
        'Business analysis capabilities to identify and solve operational inefficiencies'
      ],
      achievements: [
        'Successfully integrated 3 separate location systems into unified platform',
        'Achieved 99.9% system uptime across all critical business applications'
      ]
    },
    1: { // Room Service Server
      title: 'In Room Dining (Room Service) Server',
      company: 'Fairmont Whistler Hotel',
      location: 'Whistler, BC, Canada',
      period: 'November 2023 — December 2024',
      description: 'Delivered world-class 5-star hospitality service in an international luxury resort environment, maintaining Fairmont\'s prestigious brand standards while serving guests from around the globe. Operated in a fast-paced, high-pressure environment during peak ski season.',
      keyResponsibilities: [
        'Delivered exceptional in-room dining experiences to hotel guests',
        'Maintained 5-star service standards throughout all guest interactions',
        'Coordinated with kitchen staff to ensure timely and accurate order delivery',
        'Handled special dietary requirements and allergen considerations',
        'Processed payments and managed room service logistics efficiently',
        'Responded to guest requests and resolved service issues professionally'
      ],
      skillsUsed: [
        'Customer Service Excellence',
        'Cross-Cultural Communication',
        'Time Management & Multitasking',
        'Problem-Solving Under Pressure',
        'Attention to Detail & Quality Control',
        'Team Collaboration & Coordination',
        'Cash Handling & Payment Processing',
        'Food Safety & Hygiene Standards',
        'Guest Relations & Hospitality',
        'Conflict Resolution'
      ],
      keyLearnings: [
        'International hospitality standards and cultural sensitivity in service delivery',
        'Advanced customer service techniques for luxury hospitality environments',
        'Stress management and performance consistency during high-pressure periods',
        'Professional communication skills with diverse international clientele'
      ],
      achievements: [
        'Consistently received positive guest feedback and high service ratings',
        'Demonstrated exceptional ability to mitigate negative customer experiences and recover guest satisfaction to increase future loyalty',
        'Successfully managed and maintained coordination of multiple employees across various food-related services throughout the hotel',
        'Successfully served VIP guests and handled special event requirements'
      ]
    },
    2: { // Customer Service Rep
      title: 'Customer Service Representative & Retail Attendant',
      company: 'Pet Fresh',
      location: 'Perth',
      period: 'August 2017 — November 2023',
      description: 'Provided specialized customer service and product expertise in premium pet nutrition, developing deep product knowledge to assist customers with complex dietary requirements for their pets. Built lasting customer relationships through expert consultations and personalized service.',
      keyResponsibilities: [
        'Provided expert product recommendations for dogs with allergies and specific nutritional needs',
        'Educated customers on locally-sourced, vet-formulated pet food solutions',
        'Assisted customers with breed-specific nutritional requirements and varying body conditions',
        'Managed inventory, stock rotation, and product merchandising',
        'Processed sales transactions and handled customer inquiries',
        'Maintained store presentation and ensured product quality standards'
      ],
      skillsUsed: [
        'Product Knowledge & Expertise Development',
        'Customer Consultation & Education',
        'Sales & Relationship Building',
        'Inventory Management & Stock Control',
        'Cash Handling & Transaction Processing',
        'Problem-Solving & Complaint Resolution',
        'Communication & Active Listening',
        'Animal Nutrition Understanding',
        'Retail Operations & Merchandising',
        'Time Management & Multitasking'
      ],
      keyLearnings: [
        'Deep expertise in pet nutrition science and dietary requirements for different breeds',
        'Consultative selling techniques and building customer trust through knowledge',
        'Retail operations management and inventory control best practices',
        'Customer relationship management and retention strategies in specialized retail'
      ],
      achievements: [
        'Built loyal customer base through expert consultation and personalized service',
        'Achieved consistent sales targets and contributed to store growth over 6+ years',
        'Developed expertise in pet nutrition becoming go-to resource for complex cases',
        'Maintained high customer satisfaction scores and positive feedback ratings'
      ]
    }
  };

  const handleExperienceClick = (job) => {
    setSelectedExperience(job);
    setTimeout(() => {
      setExperienceModalOpen(true);
    }, 50);
  };

  const handleExperienceModalClose = () => {
    setExperienceModalOpen(false);
    setTimeout(() => {
      setSelectedExperience(null);
    }, 300);
  };

  if (loading) {
    return (
      <section id="experience" className="content-section">
        <div className="container">
          <Typography variant="h4" style={{ color: '#e5e7eb', textAlign: 'center' }}>
            Loading...
          </Typography>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="content-section">
      <div className="container">
        <h2 className="section-title">Professional Experience</h2>
        <div className="experience-list">
          {jobs.map((job, index) => (
            <ExperienceItem
              key={index}
              job={job}
              onClick={() => handleExperienceClick(job)}
            />
          ))}
        </div>
      </div>

      {/* Experience Details Modal */}
      <Dialog
        open={experienceModalOpen}
        onClose={handleExperienceModalClose}
        maxWidth="lg"
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
          {selectedExperience && (
            <img
              src={selectedExperience.index === 1 ? "/company_icons/Fairmont_Whis.png" : "/company_icons/Pet_Fresh.png"}
              alt={selectedExperience.index === 1 ? "Fairmont Whistler Hotel" : "Pet Fresh"}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />
          )}
          {selectedExperience && experienceDetails[selectedExperience.index]?.title}
          <IconButton
            aria-label="close"
            onClick={handleExperienceModalClose}
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
          {selectedExperience && experienceDetails[selectedExperience.index] && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <Typography 
                  variant="h6" 
                  style={{ 
                    color: theme.palette.secondary.main, 
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}
                >
                  {experienceDetails[selectedExperience.index].company} • {experienceDetails[selectedExperience.index].location}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  style={{ 
                    color: '#9ca3af', 
                    marginBottom: '1.5rem'
                  }}
                >
                  {experienceDetails[selectedExperience.index].period}
                </Typography>

                <Typography 
                  variant="body1" 
                  style={{ 
                    color: '#e5e7eb', 
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                  }}
                >
                  {experienceDetails[selectedExperience.index].description}
                </Typography>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <Typography 
                  variant="h6" 
                  style={{ 
                    color: '#22c55e', 
                    marginBottom: '1rem',
                    fontWeight: '600'
                  }}
                >
                  Key Responsibilities
                </Typography>
                
                <ul style={{ 
                  color: '#e5e7eb', 
                  paddingLeft: '1.5rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {experienceDetails[selectedExperience.index].keyResponsibilities.map((responsibility, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <Typography 
                  variant="h6" 
                  style={{ 
                    color: theme.palette.primary.main, 
                    marginBottom: '1rem',
                    fontWeight: '600'
                  }}
                >
                  Skills Used
                </Typography>
                
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem'
                }}>
                  {experienceDetails[selectedExperience.index].skillsUsed.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: hexToRgba(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        border: `1px solid ${theme.palette.primary.main}33`,
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <Typography 
                  variant="h6" 
                  style={{ 
                    color: '#f59e0b', 
                    marginBottom: '1rem',
                    fontWeight: '600'
                  }}
                >
                  Key Learnings
                </Typography>
                
                <ul style={{ 
                  color: '#e5e7eb', 
                  paddingLeft: '1.5rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {experienceDetails[selectedExperience.index].keyLearnings.map((learning, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>
                      {learning}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Typography 
                  variant="h6" 
                  style={{ 
                    color: theme.palette.secondary.main, 
                    marginBottom: '1rem',
                    fontWeight: '600'
                  }}
                >
                  Key Achievements
                </Typography>
                
                <ul style={{ 
                  color: '#e5e7eb', 
                  paddingLeft: '1.5rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {(selectedExperience.keyAchievements || experienceDetails[selectedExperience.index].achievements).map((achievement, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
        
        <DialogActions style={{ padding: '1rem 1.5rem' }}>
          <Button 
            onClick={handleExperienceModalClose}
            style={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main
            }}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default ExperienceSection; 