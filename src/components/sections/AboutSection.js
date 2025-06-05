import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Tooltip, Chip, Drawer, Box, useTheme, Card, CardContent, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ScrollReveal from '../animations/ScrollReveal';

const AboutSection = () => {
  const theme = useTheme();
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [educationModalOpen, setEducationModalOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [certificationModalOpen, setCertificationModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitDrawerOpen, setUnitDrawerOpen] = useState(false);

  // State for dynamic data
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [courses, setCourses] = useState([]);
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

  // Load data from JSON files with caching
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check for cached data first
        const cachedSkills = getCachedData('aboutSection_skills');
        const cachedEducation = getCachedData('aboutSection_education');
        const cachedCourses = getCachedData('aboutSection_courses');
        
        if (cachedSkills && cachedEducation && cachedCourses) {
          console.log('Using cached data for AboutSection');
          
          // Apply the same sorting logic to cached courses
          const sortedCachedCourses = cachedCourses.sort((a, b) => {
            // Special handling for Business certificates to ensure proper progression
            const aIsBusiness = a.certificationName?.includes('Business');
            const bIsBusiness = b.certificationName?.includes('Business');
            
            if (aIsBusiness && bIsBusiness) {
              // Extract certificate levels for business certificates
              const aIsIII = a.certificationName?.includes('Certificate III');
              const bIsIII = b.certificationName?.includes('Certificate III');
              const aIsII = a.certificationName?.includes('Certificate II') && !a.certificationName?.includes('Certificate III');
              const bIsII = b.certificationName?.includes('Certificate II') && !b.certificationName?.includes('Certificate III');
              const aIsI = a.certificationName?.includes('Certificate I') && !a.certificationName?.includes('Certificate II') && !a.certificationName?.includes('Certificate III');
              const bIsI = b.certificationName?.includes('Certificate I') && !b.certificationName?.includes('Certificate II') && !b.certificationName?.includes('Certificate III');
              
              // Sort in descending order: III -> II -> I (highest level first)
              if (aIsIII && bIsII) return -1;
              if (aIsII && bIsIII) return 1;
              if (aIsIII && bIsI) return -1;
              if (aIsI && bIsIII) return 1;
              if (aIsII && bIsI) return -1;
              if (aIsI && bIsII) return 1;
            }
            
            // Special handling for Hospitality certificates to maintain logical progression
            const aIsHospitality = a.certificationName?.includes('Hospitality');
            const bIsHospitality = b.certificationName?.includes('Hospitality');
            
            if (aIsHospitality && bIsHospitality) {
              // Extract certificate levels for hospitality certificates
              const aIsII = a.certificationName?.includes('Certificate II');
              const bIsII = b.certificationName?.includes('Certificate II');
              const aIsI = a.certificationName?.includes('Certificate I') && !a.certificationName?.includes('Certificate II');
              const bIsI = b.certificationName?.includes('Certificate I') && !b.certificationName?.includes('Certificate II');
              
              // Sort in descending order: II -> I (highest level first)
              if (aIsII && bIsI) return -1;
              if (aIsI && bIsII) return 1;
            }
            
            // For all other certificates, sort by date (newest first)
            const getDateForSorting = (dateStr) => {
              if (!dateStr) return new Date(0);
              // Handle date ranges by taking the end date
              const endDate = dateStr.includes(' — ') ? dateStr.split(' — ')[1] : dateStr;
              return new Date(endDate);
            };
            
            return getDateForSorting(b.date) - getDateForSorting(a.date);
          });
          
          setSkills(cachedSkills);
          setEducation(cachedEducation);
          setCourses(sortedCachedCourses);
          setLoading(false);
          return;
        }
        
        console.log('Fetching fresh data for AboutSection');
        const [skillsResponse, educationResponse, coursesResponse] = await Promise.all([
          fetch(getDataUrl('skills.json')),
          fetch(getDataUrl('education.json')),
          fetch(getDataUrl('courses.json'))
        ]);

        const skillsData = await skillsResponse.json();
        const educationData = await educationResponse.json();
        const coursesData = await coursesResponse.json();

        const skillsResult = skillsData.result || [];
        const educationResult = educationData.result || [];
        let coursesResult = coursesData.result || [];

        // Sort courses to ensure proper order for animations
        // Priority order: Certificate III before Certificate II, then by date (newest first)
        coursesResult = coursesResult.sort((a, b) => {
          // Special handling for Business certificates to ensure proper progression
          const aIsBusiness = a.certificationName?.includes('Business');
          const bIsBusiness = b.certificationName?.includes('Business');
          
          if (aIsBusiness && bIsBusiness) {
            // Extract certificate levels for business certificates
            const aIsIII = a.certificationName?.includes('Certificate III');
            const bIsIII = b.certificationName?.includes('Certificate III');
            const aIsII = a.certificationName?.includes('Certificate II') && !a.certificationName?.includes('Certificate III');
            const bIsII = b.certificationName?.includes('Certificate II') && !b.certificationName?.includes('Certificate III');
            const aIsI = a.certificationName?.includes('Certificate I') && !a.certificationName?.includes('Certificate II') && !a.certificationName?.includes('Certificate III');
            const bIsI = b.certificationName?.includes('Certificate I') && !b.certificationName?.includes('Certificate II') && !b.certificationName?.includes('Certificate III');
            
            // Sort in descending order: III -> II -> I (highest level first)
            if (aIsIII && bIsII) return -1;
            if (aIsII && bIsIII) return 1;
            if (aIsIII && bIsI) return -1;
            if (aIsI && bIsIII) return 1;
            if (aIsII && bIsI) return -1;
            if (aIsI && bIsII) return 1;
          }
          
          // Special handling for Hospitality certificates to maintain logical progression
          const aIsHospitality = a.certificationName?.includes('Hospitality');
          const bIsHospitality = b.certificationName?.includes('Hospitality');
          
          if (aIsHospitality && bIsHospitality) {
            // Extract certificate levels for hospitality certificates
            const aIsII = a.certificationName?.includes('Certificate II');
            const bIsII = b.certificationName?.includes('Certificate II');
            const aIsI = a.certificationName?.includes('Certificate I') && !a.certificationName?.includes('Certificate II');
            const bIsI = b.certificationName?.includes('Certificate I') && !b.certificationName?.includes('Certificate II');
            
            // Sort in descending order: II -> I (highest level first)
            if (aIsII && bIsI) return -1;
            if (aIsI && bIsII) return 1;
          }
          
          // For all other certificates, sort by date (newest first)
          const getDateForSorting = (dateStr) => {
            if (!dateStr) return new Date(0);
            // Handle date ranges by taking the end date
            const endDate = dateStr.includes(' — ') ? dateStr.split(' — ')[1] : dateStr;
            return new Date(endDate);
          };
          
          return getDateForSorting(b.date) - getDateForSorting(a.date);
        });

        // Cache the results
        setCachedData('aboutSection_skills', skillsResult);
        setCachedData('aboutSection_education', educationResult);
        setCachedData('aboutSection_courses', coursesResult);

        // Log the course order for debugging
        console.log('Certificate order:', coursesResult.map((course, index) => 
          `${index}: ${course.certificationName} (delay: ${200 + (index * 100)}ms)`
        ));

        setSkills(skillsResult);
        setEducation(educationResult);
        setCourses(coursesResult);
      } catch (error) {
        console.error('Error loading data:', error);
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

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    setTimeout(() => {
      setSkillModalOpen(true);
    }, 50);
  };

  const handleSkillModalClose = () => {
    setSkillModalOpen(false);
    setTimeout(() => {
      setSelectedSkill(null);
    }, 300);
  };

  const handleEducationClick = (educationItem) => {
    setSelectedEducation(educationItem);
    setTimeout(() => {
      setEducationModalOpen(true);
    }, 50);
  };

  const handleEducationModalClose = () => {
    setEducationModalOpen(false);
    setTimeout(() => {
      setSelectedEducation(null);
    }, 300);
  };

  const handleCertificationClick = (cert) => {
    setSelectedCertification(cert);
    setTimeout(() => {
      setCertificationModalOpen(true);
    }, 50);
  };

  const handleCertificationModalClose = () => {
    setCertificationModalOpen(false);
    setTimeout(() => {
      setSelectedCertification(null);
    }, 300);
  };

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
    setUnitDrawerOpen(true);
  };

  const handleUnitDrawerClose = () => {
    setUnitDrawerOpen(false);
    setTimeout(() => {
      setSelectedUnit(null);
    }, 300);
  };

  if (loading) {
    return (
      <section id="about" className="content-section">
        <div className="container">
          <Typography variant="h4" style={{ color: '#e5e7eb', textAlign: 'center' }}>
            Loading...
          </Typography>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="content-section">
      <div className="container">
        <ScrollReveal direction="up" delay={100}>
          <h2 className="section-title">Education</h2>
        </ScrollReveal>
        <div className="experience-list">
          {education.map((edu, index) => (
            <ScrollReveal key={index} direction="left" delay={200 + (index * 100)}>
              <div className="experience-item" style={{ cursor: 'pointer' }} onClick={() => handleEducationClick(edu)}>
                <div className="experience-header">
                  <h3 className="experience-title">{edu.courseName}</h3>
                  <span className="experience-period">{edu.date}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between' 
                }}>
                  <div>
                    <p className="experience-company">{edu.institutionName}{edu.institutionLocation ? `, ${edu.institutionLocation}` : ''}</p>
                  </div>
                  {edu.institutionLogo && (
                    <img
                      src={edu.institutionLogo}
                      alt={edu.institutionName}
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '12px',
                        objectFit: 'contain'
                      }}
                    />
                  )}
                </div>
                <p className="experience-description">
                  {edu.shortDescription}
                  {(edu.completedUnits && edu.completedUnits.length > 0) || (edu.inProgressUnits && edu.inProgressUnits.length > 0) ? (
                    <span style={{ color: theme.palette.primary.main, fontWeight: '500' }}> Click to view detailed coursework.</span>
                  ) : null}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        
        <ScrollReveal direction="up" delay={100}>
          <h2 className="section-title" style={{ marginTop: '3rem' }}>Skills</h2>
        </ScrollReveal>
        <div className="about-skills">
          <ScrollReveal direction="up" delay={200}>
            <div 
              className="skills-grid"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '1.5rem'
              }}
            >
              {skills.map((skill, index) =>
                <ScrollReveal key={index} direction="scale" delay={300 + (index * 50)}>
                  <div
                    className="skill-item"
                    style={{
                      padding: '0.75rem 1rem',
                      border: `1px solid ${hexToRgba(theme.palette.primary.main, 0.3)}`,
                      borderRadius: '8px',
                      backgroundColor: hexToRgba(theme.palette.primary.main, 0.05),
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: '#e5e7eb',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      minWidth: '180px',
                      flex: '0 0 auto'
                    }}
                    onClick={() => handleSkillClick(skill)}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = hexToRgba(theme.palette.primary.main, 0.6);
                      e.target.style.backgroundColor = hexToRgba(theme.palette.primary.main, 0.1);
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = hexToRgba(theme.palette.primary.main, 0.3);
                      e.target.style.backgroundColor = hexToRgba(theme.palette.primary.main, 0.05);
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    {skill.skillName}
                  </div>
                </ScrollReveal>
              )}
            </div>
          </ScrollReveal>
        </div>
        
        <ScrollReveal direction="up" delay={100}>
          <h2 className="section-title" style={{ marginTop: '3rem' }}>Professional Certifications</h2>
        </ScrollReveal>
        <div className="experience-list">
          {courses.map((course, index) => (
            <ScrollReveal key={index} direction="right" delay={200 + (index * 100)}>
              <div className="experience-item" style={{ cursor: 'pointer' }} onClick={() => handleCertificationClick(course)}>
                <div className="experience-header">
                  <h3 className="experience-title">{course.certificationName}</h3>
                  <span className="experience-period">{course.date}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between' 
                }}>
                  <div>
                    <p className="experience-company">{course.institutionName}</p>
                  </div>
                  {course.institutionLogo && (
                    <img
                      src={course.institutionLogo}
                      alt={course.institutionName}
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '12px',
                        objectFit: 'contain'
                      }}
                    />
                  )}
                </div>
                <p className="experience-description">
                  {course.description}
                  {((course.completedUnits && course.completedUnits.length > 0) || (course.inProgressUnits && course.inProgressUnits.length > 0)) && (
                    <span style={{ color: theme.palette.primary.main, fontWeight: '500' }}> Click for details.</span>
                  )}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Education Details Modal */}
      <Dialog
        open={educationModalOpen}
        onClose={handleEducationModalClose}
        maxWidth="lg"
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
          {selectedEducation && selectedEducation.institutionLogo && (
            <img
              src={selectedEducation.institutionLogo}
              alt={selectedEducation.institutionName}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />
          )}
          {selectedEducation && selectedEducation.courseName}
          <IconButton
            aria-label="close"
            onClick={handleEducationModalClose}
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
          {selectedEducation && (
            <div>
              <Typography 
                variant="h6" 
                style={{ 
                  color: theme.palette.secondary.main, 
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}
              >
                {selectedEducation.institutionName}
                {selectedEducation.institutionLocation && `, ${selectedEducation.institutionLocation}`}
              </Typography>
              
              <Typography 
                variant="body2" 
                style={{ 
                  color: '#9ca3af', 
                  marginBottom: '2rem'
                }}
              >
                {selectedEducation.date}
              </Typography>

              {selectedEducation.longDescription && (
                <Typography 
                  variant="body1" 
                  style={{ 
                    color: '#e5e7eb', 
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                  }}
                >
                  {selectedEducation.longDescription}
                </Typography>
              )}

              {selectedEducation.completedUnits && selectedEducation.completedUnits.length > 0 && (
                <>
                  <Typography 
                    variant="h6" 
                    style={{ 
                      color: '#22c55e', 
                      marginBottom: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    Completed Units
                  </Typography>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.75rem', 
                    marginBottom: '2rem' 
                  }}>
                    {selectedEducation.completedUnits.map((unit, index) => (
                      <Tooltip
                        key={index}
                        title={unit.tooltip || unit.unitName}
                        arrow
                        placement="top"
                      >
                        <Chip
                          label={`${unit.unitCode} ${unit.unitName}`}
                          onClick={() => handleUnitClick(unit)}
                          style={{
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            color: '#22c55e',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            fontSize: '0.75rem',
                            height: '28px',
                            cursor: 'pointer'
                          }}
                        />
                      </Tooltip>
                    ))}
                  </div>
                </>
              )}

              {selectedEducation.inProgressUnits && selectedEducation.inProgressUnits.length > 0 && (
                <>
                  <Typography 
                    variant="h6" 
                    style={{ 
                      color: '#f59e0b', 
                      marginBottom: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    Currently Enrolled
                  </Typography>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.75rem' 
                  }}>
                    {selectedEducation.inProgressUnits.map((unit, index) => (
                      <Tooltip
                        key={index}
                        title={unit.tooltip || unit.unitName}
                        arrow
                        placement="top"
                      >
                        <Chip
                          label={`${unit.unitCode} ${unit.unitName}`}
                          onClick={() => handleUnitClick(unit)}
                          style={{
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            color: '#f59e0b',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            fontSize: '0.75rem',
                            height: '28px',
                            cursor: 'pointer'
                          }}
                        />
                      </Tooltip>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Certification Details Modal */}
      <Dialog
        open={certificationModalOpen}
        onClose={handleCertificationModalClose}
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
          {selectedCertification && selectedCertification.institutionLogo && (
            <img
              src={selectedCertification.institutionLogo}
              alt={selectedCertification.institutionName}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />
          )}
          {selectedCertification && selectedCertification.certificationName}
          <IconButton
            aria-label="close"
            onClick={handleCertificationModalClose}
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
          {selectedCertification && (
            <div>
              <Typography 
                variant="h6" 
                style={{ 
                  color: theme.palette.primary.main, 
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}
              >
                {selectedCertification.institutionName}
              </Typography>
              
              <Typography 
                variant="body2" 
                style={{ 
                  color: '#9ca3af', 
                  marginBottom: '1.5rem'
                }}
              >
                {selectedCertification.date}
              </Typography>

              <Typography 
                variant="body1" 
                style={{ 
                  color: '#e5e7eb', 
                  lineHeight: '1.6',
                  marginBottom: (selectedCertification.completedUnits && selectedCertification.completedUnits.length > 0) ? '2rem' : '0'
                }}
              >
                {selectedCertification.description}
              </Typography>

              {selectedCertification.completedUnits && selectedCertification.completedUnits.length > 0 && (
                <>
                  <Typography 
                    variant="h6" 
                    style={{ 
                      color: '#22c55e', 
                      marginBottom: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    Completed Units
                  </Typography>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.75rem'
                  }}>
                    {selectedCertification.completedUnits.map((unit, index) => (
                      <Tooltip
                        key={index}
                        title={unit.tooltip || unit.unitName}
                        arrow
                        placement="top"
                      >
                        <Chip
                          label={`${unit.unitCode} ${unit.unitName}`}
                          onClick={() => handleUnitClick(unit)}
                          style={{
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            color: '#22c55e',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            fontSize: '0.75rem',
                            height: '28px',
                            cursor: 'pointer'
                          }}
                        />
                      </Tooltip>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Unit Details Drawer */}
      <Drawer
        anchor="right"
        open={unitDrawerOpen}
        onClose={handleUnitDrawerClose}
        style={{ zIndex: 9999 }}
        PaperProps={{
          className: 'animated-drawer-paper',
          style: {
            width: '400px',
            backgroundColor: '#1a1a1a',
            border: `1px solid ${hexToRgba(theme.palette.primary.main, 0.3)}`,
            borderRadius: '12px 0 0 12px',
            zIndex: 9999
          }
        }}
      >
        <Box 
          role="presentation" 
          className="dialog-content-stagger"
          style={{ 
            padding: '1.5rem',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {selectedUnit && (
            <>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem',
                borderBottom: `1px solid ${hexToRgba(theme.palette.primary.main, 0.2)}`,
                paddingBottom: '1rem'
              }}>
                <div>
                  <Typography 
                    variant="h5" 
                    style={{ 
                      color: theme.palette.secondary.main,
                      fontWeight: '700',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {selectedUnit.unitCode}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    style={{ 
                      color: '#e5e7eb',
                      fontWeight: '600',
                      lineHeight: '1.3'
                    }}
                  >
                    {selectedUnit.unitName}
                  </Typography>
                </div>
                <IconButton
                  onClick={handleUnitDrawerClose}
                  style={{
                    color: '#9ca3af',
                    padding: '8px'
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </div>

              <div style={{ flex: 1 }}>
                <Typography 
                  variant="body1" 
                  style={{ 
                    color: '#e5e7eb',
                    lineHeight: '1.6',
                    fontSize: '1rem'
                  }}
                >
                  {selectedUnit.tooltip || selectedUnit.unitName}
                </Typography>
              </div>

              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: hexToRgba(theme.palette.primary.main, 0.05),
                border: `1px solid ${hexToRgba(theme.palette.primary.main, 0.2)}`,
                borderRadius: '8px'
              }}>
                <Typography 
                  variant="body2" 
                  style={{ 
                    color: '#9ca3af',
                    fontSize: '0.875rem',
                    fontStyle: 'italic'
                  }}
                >
                  Click outside or press the × to close this panel
                </Typography>
              </div>
            </>
          )}
        </Box>
      </Drawer>

      {/* Skill Details Modal */}
      <Dialog
        open={skillModalOpen}
        onClose={handleSkillModalClose}
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
            paddingBottom: '1rem'
          }}
        >
          {selectedSkill && selectedSkill.skillName}
          <IconButton
            aria-label="close"
            onClick={handleSkillModalClose}
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
          {selectedSkill && (
            <div>
              <Typography 
                variant="body1" 
                style={{ 
                  color: '#e5e7eb', 
                  marginBottom: '1.5rem',
                  lineHeight: '1.6'
                }}
              >
                {selectedSkill.shortDescription}
              </Typography>
              
              {selectedSkill.keyExamples && selectedSkill.keyExamples.length > 0 && (
                <>
                  <Typography 
                    variant="h6" 
                    style={{ 
                      color: theme.palette.secondary.main, 
                      marginBottom: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    Key Examples:
                  </Typography>
                  
                  <ul style={{ 
                    color: '#e5e7eb', 
                    paddingLeft: '1.5rem',
                    lineHeight: '1.6'
                  }}>
                    {selectedSkill.keyExamples.map((example, index) => (
                      <li key={index} style={{ marginBottom: '0.5rem' }}>
                        {example}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AboutSection; 