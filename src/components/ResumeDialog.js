import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Document, Page, pdfjs } from 'react-pdf';
import './ResumeDialog.css';

// Set up PDF.js worker with a more reliable CDN
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const ResumeDialog = ({ open, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [showContent, setShowContent] = useState(false);

  // Memoize PDF options to prevent unnecessary reloads
  const pdfOptions = React.useMemo(() => ({
    cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
    disableStream: true,
    disableAutoFetch: true,
    disableRange: true,
  }), []);

  // Wait for dialog to open and PDF to load, then show content
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500); // Wait 500ms as requested
      
      return () => {
        clearTimeout(timer);
      };
    } else {
      setShowContent(false);
    }
  }, [open]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(false);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setLoading(false);
    setError(true);
  };

  const onPageLoadError = (error) => {
    console.error('Error loading page:', error);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setRetryKey(prev => prev + 1);
  };

  const handlePrevPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.25, 2.0));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.25, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Tristan_Jones_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setPageNumber(1);
    setScale(1.0);
    setLoading(true);
    setError(false);
    setRetryKey(0);
    setShowContent(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth={true}
      PaperProps={{
        className: 'resume-dialog-paper'
      }}
    >
      <DialogTitle className="resume-dialog-title">
        Resume - Tristan Jones
        <IconButton
          aria-label="download"
          onClick={handleDownload}
          className="resume-dialog-download"
        >
          <DownloadIcon />
        </IconButton>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          className="resume-dialog-close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent className="resume-dialog-content">
        {/* PDF Viewer Controls */}
        <Box className="pdf-controls">
          <Box className="pdf-navigation">
            <IconButton
              onClick={handlePrevPage}
              disabled={pageNumber <= 1}
              className="control-button"
            >
              <NavigateBeforeIcon />
            </IconButton>
            <Typography className="page-info">
              Page {pageNumber} of {numPages || '?'}
            </Typography>
            <IconButton
              onClick={handleNextPage}
              disabled={pageNumber >= numPages}
              className="control-button"
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>
          <Box className="pdf-zoom">
            <IconButton
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="control-button"
            >
              <ZoomOutIcon />
            </IconButton>
            <Typography className="zoom-info">
              {Math.round(scale * 100)}%
            </Typography>
            <IconButton
              onClick={handleZoomIn}
              disabled={scale >= 2.0}
              className="control-button"
            >
              <ZoomInIcon />
            </IconButton>
          </Box>
        </Box>
        
        {/* PDF Document Container */}
        <Box className="pdf-container">
          {/* Loading skeleton - shown until content is ready */}
          {!showContent && (
            <Box className="pdf-skeleton">
              <Typography className="pdf-loading">
                {loading ? 'Loading resume...' : 'Preparing viewer...'}
              </Typography>
            </Box>
          )}

          {/* Error state - shown when there's an error */}
          {error && (
            <Box className="pdf-error">
              <Typography className="pdf-loading">
                Failed to load resume.
              </Typography>
              <Button
                onClick={handleRetry}
                variant="outlined"
                className="retry-button"
              >
                Retry
              </Button>
            </Box>
          )}

          {/* PDF content - always rendered but visibility controlled by CSS */}
          <Box className={`pdf-content-wrapper ${showContent ? 'visible' : 'hidden'}`}>
            <Document
              key={retryKey}
              file="/resume.pdf"
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="pdf-document"
              loading={null} // Remove loading prop since we handle it externally
              options={pdfOptions}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                className="pdf-page"
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onLoadError={onPageLoadError}
                loading={null} // Remove loading prop since we handle it externally
                error={null} // Remove error prop since we handle it externally
              />
            </Document>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeDialog; 