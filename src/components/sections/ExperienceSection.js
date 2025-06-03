import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ExperienceItem = ({ title, company, period, description, location, companyIcon, companyIcon2, onClick }) => {
  const theme = useTheme();
  
  return (
    <div className="experience-item" style={{ cursor: 'pointer' }} onClick={onClick}>
      <div className="experience-header">
        <h3 className="experience-title">{title}</h3>
        <span className="experience-period">{period}</span>
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <div>
          <p className="experience-company">{company}</p>
          {location && <p className="experience-location">{location}</p>}
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          {companyIcon && (
            <img
              src={companyIcon}
              alt={company}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '12px',
                objectFit: 'contain'
              }}
            />
          )}
          {companyIcon2 && (
            <img
              src={companyIcon2}
              alt={company}
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
      <p className="experience-description">{description} <span style={{ color: theme.palette.primary.main, fontWeight: '500' }}>Click for detailed experience.</span></p>
    </div>
  );
};

const ExperienceSection = () => {
  const theme = useTheme();
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);

  // Utility function to convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const experienceDetails = {
    'it-operations-manager': {
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
    'room-service-server': {
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
    'customer-service-rep': {
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

  const handleExperienceClick = (experienceKey) => {
    setSelectedExperience(experienceKey);
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

  return (
    <section id="experience" className="content-section">
      <div className="container">
        <h2 className="section-title">Professional Experience</h2>
        <div className="experience-list">
          <ExperienceItem
            title="IT & Operations Manager"
            company="Pet Fresh"
            location="Perth • Hybrid Role"
            period="November 2023 — Present"
            description="Maintained and developed systems & integrations between IT systems across 3 locations, supporting all business systems from eCommerce to POS. Implemented various off-the-shelf and custom developed systems, including a Warehouse Management System that assists in warehouse operations and stock forecasting."
            companyIcon="/company_icons/Pet_Fresh.png"
            onClick={() => handleExperienceClick('it-operations-manager')}
          />
          <ExperienceItem
            title="In Room Dining (Room Service) Server"
            company="Fairmont Whistler Hotel"
            location="Whistler, BC, Canada"
            period="November 2023 — December 2024"
            description="Delivered exceptional 5-star hotel experience directly to guest rooms, upholding the world-renowned standards of the Fairmont brand while maintaining the highest level of customer service excellence."
            companyIcon="/company_icons/Accor.png"
            companyIcon2="/company_icons/Fairmont_Whis.png"
            onClick={() => handleExperienceClick('room-service-server')}
          />
          <ExperienceItem
            title="Customer Service Representative & Retail Attendant"
            company="Pet Fresh"
            location="Perth"
            period="August 2017 — November 2023"
            description="Assisted customers by providing expert product recommendations for dogs with allergies, varying body conditions, and breed-specific nutritional needs. Delivered exceptional customer service while educating pet owners on locally-sourced, vet-formulated pet food solutions."
            companyIcon="/company_icons/Pet_Fresh.png"
            onClick={() => handleExperienceClick('customer-service-rep')}
          />
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
              src={selectedExperience === 'room-service-server' ? "/company_icons/Fairmont_Whis.png" : "/company_icons/Pet_Fresh.png"}
              alt={selectedExperience === 'room-service-server' ? "Fairmont Whistler Hotel" : "Pet Fresh"}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />
          )}
          {selectedExperience && experienceDetails[selectedExperience]?.title}
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
          {selectedExperience && (
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
                  {experienceDetails[selectedExperience]?.company} • {experienceDetails[selectedExperience]?.location}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  style={{ 
                    color: '#9ca3af', 
                    marginBottom: '1.5rem'
                  }}
                >
                  {experienceDetails[selectedExperience]?.period}
                </Typography>

                <Typography 
                  variant="body1" 
                  style={{ 
                    color: '#e5e7eb', 
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                  }}
                >
                  {experienceDetails[selectedExperience]?.description}
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
                  {experienceDetails[selectedExperience]?.keyResponsibilities.map((responsibility, index) => (
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
                  {experienceDetails[selectedExperience]?.skillsUsed.map((skill, index) => (
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
                  {experienceDetails[selectedExperience]?.keyLearnings.map((learning, index) => (
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
                  {experienceDetails[selectedExperience]?.achievements.map((achievement, index) => (
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
            variant="contained"
            style={{
              backgroundColor: theme.palette.primary.main,
              color: 'white'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default ExperienceSection; 