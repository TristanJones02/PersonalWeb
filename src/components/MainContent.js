import React, { useState } from 'react';
import EmailDialogue from './EmailDialogue';
import ResumeDialog from './ResumeDialog';
import Footer from './Footer';
import HomeSection from './sections/HomeSection';
import AboutSection from './sections/AboutSection';
import ExperienceSection from './sections/ExperienceSection';
import ProjectsSection from './sections/ProjectsSection';
import StackSection from './sections/StackSection';
import PersonalTravelsSection from './sections/PersonalTravelsSection';
import './MainContent.css';

const MainContent = ({ sections, onDialogStateChange }) => {
  const [emailDialogueOpen, setEmailDialogueOpen] = useState(false);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);

  const handleEmailClick = () => {
    setEmailDialogueOpen(true);
    if (onDialogStateChange) {
      onDialogStateChange(true);
    }
  };

  const handleEmailDialogueClose = () => {
    setEmailDialogueOpen(false);
    if (onDialogStateChange) {
      onDialogStateChange(false);
    }
  };

  const handleResumeClick = () => {
    setResumeDialogOpen(true);
    if (onDialogStateChange) {
      onDialogStateChange(true);
    }
  };

  const handleResumeDialogClose = () => {
    setResumeDialogOpen(false);
    if (onDialogStateChange) {
      onDialogStateChange(false);
    }
  };

  return (
    <main className="main-content">
      {/* Render section components */}
      <HomeSection
        handleResumeClick={handleResumeClick}
        handleEmailClick={handleEmailClick}
      />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <StackSection />
      <PersonalTravelsSection />

      {/* Footer */}
      <Footer />

      {/* Dialogs */}
      <EmailDialogue
        open={emailDialogueOpen}
        onClose={handleEmailDialogueClose}
      />

      <ResumeDialog
        open={resumeDialogOpen}
        onClose={handleResumeDialogClose}
      />
    </main>
  );
};

export default MainContent; 