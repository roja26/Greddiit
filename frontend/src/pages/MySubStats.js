import React, {useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DrawerAppBarGreddiit from '../DrawerAppBarGreddiit';
import Toolbar from '@mui/material/Toolbar';

export default function MySubStats() {
  const subId = window.location.pathname.split("/")[4];
    return (
      <div>
        <DrawerAppBarGreddiit subId={subId}/>
        <Box bgcolor=" #a3dee3" component="main" sx={{ p: 3, height: '1000px'}}>
          <Toolbar />
          <Typography>
            <h1>My Sub Stats</h1>
          </Typography>
        </Box>
      </div>
      
    );
  }