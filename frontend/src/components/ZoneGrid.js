import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button } from '@mui/material';

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/100x100/000000/FFFFFF?text=Video+Off';

const ZoneGrid = ({ zone, privacyMode, onCheckboxChange }) => {
  const [streaming, setStreaming] = useState(false);
  const [editingPrivacyRegion, setEditingPrivacyRegion] = useState(false);
  const [savedPrivacyRegion, setSavedPrivacyRegion] = useState(null);

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [maskPosition, setMaskPosition] = useState({
    x: 50,
    y: 50,
    width: 100,
    height: 100,
  });
  const [draggingCorner, setDraggingCorner] = useState(null);
  const [startPos, setStartPos] = useState(null);

  // Start webcam stream
  useEffect(() => {
    if (zone !== 'DBC-front door') return;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStreaming(true);
      })
      .catch((err) => {
        console.error('Error accessing webcam: ', err);
        setStreaming(false);
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setStreaming(false);
    };
  }, [zone]);

  // Toggle privacy mode
  useEffect(() => {
    if (privacyMode) {
      setEditingPrivacyRegion(true);
      setSavedPrivacyRegion(null);
    } else {
      setEditingPrivacyRegion(false);
      setSavedPrivacyRegion(null);
    }
  }, [privacyMode]);

  // Drag logic
  const handleMouseDown = (corner, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCorner(corner);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!draggingCorner || !startPos) return;

    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    setMaskPosition((prev) => {
      const updated = { ...prev };

      switch (draggingCorner) {
        case 'tl':
          updated.x += dx;
          updated.y += dy;
          updated.width -= dx;
          updated.height -= dy;
          break;
        case 'tr':
          updated.y += dy;
          updated.width += dx;
          updated.height -= dy;
          break;
        case 'bl':
          updated.x += dx;
          updated.width -= dx;
          updated.height += dy;
          break;
        case 'br':
          updated.width += dx;
          updated.height += dy;
          break;
        default:
          break;
      }

      updated.width = Math.max(updated.width, 20);
      updated.height = Math.max(updated.height, 20);

      return updated;
    });

    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDraggingCorner(null);
    setStartPos(null);
  };

  const handleSave = () => {
    setSavedPrivacyRegion(maskPosition);
    setEditingPrivacyRegion(false);
  };

  // Attach global mouse handlers
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingCorner, startPos]);

  return (
    <Box sx={{ border: '1px solid #ccc', padding: 2, paddingBottom: 3, position: 'relative' }}>
      <Typography variant="h6">{zone}</Typography>

      {zone === 'DBC-front door' ? (
        <Box
          ref={containerRef}
          sx={{
            width: '100%',
            height: '200px',
            marginBottom: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Webcam feed */}
          <video
            ref={videoRef}
            autoPlay
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Saved privacy region → mask only when privacyMode ON */}
          {privacyMode && savedPrivacyRegion && (
            <Box
              sx={{
                position: 'absolute',
                top: savedPrivacyRegion.y,
                left: savedPrivacyRegion.x,
                width: savedPrivacyRegion.width,
                height: savedPrivacyRegion.height,
                backgroundColor: '#000',
                backgroundImage: `url(${PLACEHOLDER_IMAGE})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: '50%',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Privacy region editor */}
          {privacyMode && editingPrivacyRegion && (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  top: maskPosition.y,
                  left: maskPosition.x,
                  width: maskPosition.width,
                  height: maskPosition.height,
                  border: '2px dashed red',
                  boxSizing: 'border-box',
                  zIndex: 9,
                }}
              />

              {/* Drag handles */}
              {['tl', 'tr', 'bl', 'br'].map((corner) => {
                const size = 10;
                const styleMap = {
                  tl: { top: maskPosition.y - size / 2, left: maskPosition.x - size / 2 },
                  tr: {
                    top: maskPosition.y - size / 2,
                    left: maskPosition.x + maskPosition.width - size / 2,
                  },
                  bl: {
                    top: maskPosition.y + maskPosition.height - size / 2,
                    left: maskPosition.x - size / 2,
                  },
                  br: {
                    top: maskPosition.y + maskPosition.height - size / 2,
                    left: maskPosition.x + maskPosition.width - size / 2,
                  },
                };

                return (
                  <Box
                    key={corner}
                    onMouseDown={(e) => handleMouseDown(corner, e)}
                    sx={{
                      position: 'absolute',
                      width: size,
                      height: size,
                      backgroundColor: '#fff',
                      border: '2px solid #000',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      zIndex: 11,
                      ...styleMap[corner],
                    }}
                  />
                );
              })}

              <Button
                variant="contained"
                size="small"
                onClick={handleSave}
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  zIndex: 12,
                }}
              >
                Save
              </Button>
            </>
          )}
        </Box>
      ) : (
        <Typography variant="body2">No webcam stream available</Typography>
      )}

      <FormControlLabel
        control={<Checkbox checked={privacyMode} onChange={() => onCheckboxChange(zone)} />}
        label="Privacy Mode"
        sx={{ position: 'absolute', top: 10, right: 10 }}
      />
    </Box>
  );
};

export default ZoneGrid;
