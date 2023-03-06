import React from 'react';
import DrawerAppBar from './DrawerAppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
export default function Homepage() {
  return (
    <div>
    <DrawerAppBar />
    <Box bgcolor=" #a3dee3" component="main" sx={{ p: 3, height: '1000px'}}>
        <Toolbar />
        <Typography >
          <h1>Dashboard</h1>
        </Typography>
      </Box>
    </div>
  );
};
