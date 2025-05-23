import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => 
          theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="body1">
              &copy; {currentYear} AtmoSense. All rights reserved.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Designed & Developed by Sachintha Bhashitha
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton 
              component={Link} 
              href="https://github.com/LEXES7" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              color="inherit"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton 
              component={Link} 
              href="https://www.linkedin.com/in/sachintha-bhashitha-675286357/" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              color="inherit"
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton 
              component={Link} 
              href="mailto:sachinthabhashithawork@gmail.com" 
              aria-label="Email"
              color="inherit"
            >
              <EmailIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            This project is for educational purposes only.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;