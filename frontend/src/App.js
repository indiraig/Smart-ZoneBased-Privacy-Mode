import React, { useState } from 'react';
import { Box, Grid, IconButton } from '@mui/material';
import Header from './components/Header';
import ZoneGrid from './components/ZoneGrid';
import VoiceAssistantLogo from './assets/voice-assistant-logo.jpg'; // Path to logo image

function App() {
  const [privacyModes, setPrivacyModes] = useState({
    'DBC-front door': false,
    'Xcam3 - Living room': false,
    'Xcam2 - Bedroom': false,
  });

  // Handle checkbox state change
  const handleCheckboxChange = (zone) => {
    setPrivacyModes((prevModes) => ({
      ...prevModes,
      [zone]: !prevModes[zone],
    }));
  };

  // Function to trigger backend API to start recognition and process command
  const startVoiceRecognition = () => {
    fetch("http://localhost:5000/start-recognition", { method: 'POST' })
      .then((response) => response.json())
      .then((data) => {
        console.log('Command processed:', data);
        // If the backend returns a zone, toggle the privacy mode checkbox for that zone
        if (data && data.zone) {
          handleCheckboxChange(data.zone);
        }
      })
      .catch((error) => console.error('Error processing command:', error));
  };

  return (
    <div>
      <Box sx={{ position: 'relative', textAlign: 'center', marginTop: 2 }}>
        <Header />

        {/* Voice Assistant Logo */}
        <IconButton
          sx={{
            position: 'absolute',
            top: '16px',
            right: '120px',
            padding: 0,
          }}
          onClick={() => {
            const audio = new Audio('/path-to-sound.mp3');  // Add your sound file
            audio.play();
            startVoiceRecognition(); // Trigger backend API to start recognition
          }}
        >
          <img
            src={VoiceAssistantLogo}
            alt="Voice Assistant Logo"
            style={{
              width: '40px',
              height: 'auto',
            }}
          />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'transparent' }}>
        <Box sx={{ flex: 1, backgroundColor: '#4A148C' }} />
        <Box sx={{ width: '600px', backgroundColor: 'white', padding: 4, borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', margin: '0 auto' }}>
          <Grid container direction="column" spacing={3}>
            {['DBC-front door', 'Xcam3 - Living room', 'Xcam2 - Bedroom'].map((zone) => (
              <Grid item xs={12} key={zone}>
                <ZoneGrid
                  zone={zone}
                  privacyMode={privacyModes[zone]}
                  onCheckboxChange={handleCheckboxChange}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ flex: 1, backgroundColor: '#4A148C' }} />
      </Box>
    </div>
  );
}

export default App;
