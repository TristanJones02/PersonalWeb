import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, IconButton } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import './EmailDialogue.css';

const EmailDialogue = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });

  const [emailError, setEmailError] = useState(false);

  const validateEmail = (email) => {
    if (!email) return true; // Empty is valid (not showing error for empty)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailValidation = () => {
    const isValid = validateEmail(formData.email);
    setEmailError(!isValid);
  };

  const handleEmailKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleEmailValidation();
    }
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    
    // Clear email error when user starts typing again
    if (field === 'email' && emailError) {
      setEmailError(false);
    }
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Create mailto link with form data
    const subject = encodeURIComponent(`Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Company: ${formData.company}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n\n` +
      `Message:\n${formData.message}`
    );
    
    const mailtoLink = `mailto:tristanjones247@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    
    // Reset form and close dialogue
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      message: ''
    });
    onClose();
  };

  const isFormValid = formData.name && formData.email && formData.message;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth={true}
      PaperProps={{
        className: 'email-dialogue-paper'
      }}
    >
      <DialogTitle className="email-dialogue-title">
        Get In Touch
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="email-dialogue-close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent className="email-dialogue-content">
          <div className="email-dialogue-grid">
            {/* First row: Name and Company */}
            <div className="email-dialogue-row">
              <div className="email-dialogue-col">
                <TextField
                  fullWidth={true}
                  label="Your Name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange('name')}
                  required={true}
                  className="email-dialogue-field"
                />
              </div>
              <div className="email-dialogue-col">
                <TextField
                  fullWidth={true}
                  label="Your Company"
                  variant="outlined"
                  value={formData.company}
                  onChange={handleChange('company')}
                  className="email-dialogue-field"
                />
              </div>
            </div>
            
            {/* Second row: Email and Phone */}
            <div className="email-dialogue-row">
              <div className="email-dialogue-col">
                <TextField
                  fullWidth={true}
                  label="Your Email"
                  variant="outlined"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  onBlur={handleEmailValidation}
                  onKeyDown={handleEmailKeyDown}
                  required={true}
                  error={emailError}
                  helperText={emailError ? 'Please enter a valid email address' : ''}
                  className="email-dialogue-field"
                />
              </div>
              <div className="email-dialogue-col">
                <MuiTelInput
                  fullWidth={true}
                  label="Your Phone"
                  variant="outlined"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  defaultCountry="AU"
                  forceCallingCode={false}
                  className="email-dialogue-field"
                />
              </div>
            </div>
            
            {/* Third row: Message (full width) */}
            <div className="email-dialogue-row">
              <TextField
                fullWidth={true}
                label="Message"
                variant="outlined"
                multiline={true}
                rows={4}
                value={formData.message}
                onChange={handleChange('message')}
                required={true}
                className="email-dialogue-field"
              />
            </div>
          </div>
        </DialogContent>
        
        <DialogActions className="email-dialogue-actions">
          <Button
            onClick={onClose}
            variant="outlined"
            className="email-dialogue-cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isFormValid}
            startIcon={<SendIcon />}
            className="email-dialogue-send"
          >
            Send
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EmailDialogue; 