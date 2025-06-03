import React from 'react';
import './Sidebar.css';
// Material-UI Icons
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PersonIcon from '@mui/icons-material/Person';
import FlightIcon from '@mui/icons-material/Flight';
import BuildIcon from '@mui/icons-material/Build';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// Social Media Icons
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';

const Sidebar = ({ sections, activeSection, onSectionClick, collapsed, onToggle }) => {
  const userProfile = {
    name: 'Tristan Jones',
    title: 'IT & Operations Manager',
    avatar: '👨‍💻',
    profileImage: '/profile.png',
    social: {
      linkedin: 'https://www.linkedin.com/in/tristanj-au/',
      email: 'mailto:tristanjones247@gmail.com',
      github: 'https://github.com/TristanJones02/',
      instagram: 'https://www.instagram.com/tjo_aus/'
    }
  };

  const handleImageError = (event) => {
    // If image fails to load, show emoji fallback
    event.target.style.display = 'none';
    event.target.nextSibling.style.display = 'flex';
  };

  return (
    <>
      {/* Sidebar container */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* Always render content, let CSS handle the transitions */}
        <div className="sidebar-content">
          {/* Profile Section */}
          <div className="profile-section">
            <div className="avatar-container">
              <img
                src={userProfile.profileImage}
                alt={userProfile.name}
                className="avatar-image"
                onError={handleImageError}
              />
              <div className="avatar-emoji" style={{ display: 'none' }}>
                {userProfile.avatar}
              </div>
            </div>
            <h2 className="profile-name">{userProfile.name}</h2>
            <p className="profile-title">{userProfile.title}</p>
            
            {/* Social Media Icons */}
            <div className="social-links">
              <a
                href={userProfile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn Profile"
              >
                <LinkedInIcon sx={{ fontSize: 18, color: 'inherit' }} />
              </a>
              <a
                href={userProfile.social.email}
                className="social-link"
                aria-label="Email Contact"
              >
                <EmailIcon sx={{ fontSize: 18, color: 'inherit' }} />
              </a>
              <a
                href={userProfile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub Profile"
              >
                <GitHubIcon sx={{ fontSize: 18, color: 'inherit' }} />
              </a>
              <a
                href={userProfile.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram Profile"
              >
                <InstagramIcon sx={{ fontSize: 18, color: 'inherit' }} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <nav className="navigation">
            {sections.map(section => {
              const IconComponent = getIconComponent(section.id);
              return (
                <button
                  key={section.id}
                  className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => onSectionClick(section.id)}
                  aria-label={`Navigate to ${section.label}`}
                >
                  <span className="nav-icon">
                    <IconComponent sx={{ fontSize: 18, color: 'inherit' }} />
                  </span>
                  <span className="nav-label">{section.label}</span>
                  <span className="nav-key">{section.key}</span>
                </button>
              );
            })}
          </nav>

          {/* Keyboard shortcuts info */}
          <div className="shortcuts-info">
            <p className="shortcuts-title">Keyboard Shortcuts</p>
            <p className="shortcuts-desc">Press number keys to navigate</p>
            <p className="shortcuts-desc">Use ← → arrows to jump between sections</p>
          </div>
        </div>
      </aside>

      {/* Chevron Toggle Button - outside sidebar so it stays visible */}
      <button
        className={`sidebar-chevron-toggle ${collapsed ? 'collapsed' : ''}`}
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRightIcon sx={{ fontSize: 20, color: '#ffffff' }} />
        ) : (
          <ChevronLeftIcon sx={{ fontSize: 20, color: '#ffffff' }} />
        )}
      </button>
    </>
  );
};

const getIconComponent = (sectionId) => {
  const iconMap = {
    home: HomeIcon,
    about: PersonIcon,
    experience: WorkIcon,
    projects: RocketLaunchIcon,
    stack: BuildIcon,
    travels: FlightIcon
  };
  return iconMap[sectionId] || HomeIcon;
};

export default Sidebar; 