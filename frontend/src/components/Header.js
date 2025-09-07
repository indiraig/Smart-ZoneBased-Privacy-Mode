import React from 'react';
import { Box, Typography } from '@mui/material';

const Header = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row', // Row layout to align items horizontally
      alignItems: 'center', // Vertically center items
      justifyContent: 'space-between', // Space between the logo and the text
      width: '100%', // Full width of the parent container
      padding: '4px 16px 16px ', // Add padding if needed for spacing
    }}
  >
    {/* Logo aligned to the left */}
    <img src="../Icon.jpeg" alt="Logo" width={50} height={50} />

    {/* Heading Text centered */}
    <Typography variant="h4" sx={{ textAlign: 'center', flex: 1 , padding : '0px 100px 0px 5px'}}>
      Smart Zone-based Privacy Features
    </Typography>
  </Box>
);

export default Header;
