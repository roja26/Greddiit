import React, {useState,useEffect} from 'react';
import Button from '@mui/material/Button';
import { Modal } from './Modal';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';


export default function Form({onSubmit, details, detset, subid}) {

  const handleChange = (event) => {
    detset({...details, [event.target.id]: event.target.value});
  };

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1},
      }}
      noValidate
      autoComplete="off"
    >
      <TextField fullWidth={true} id="text" label="Text" variant="outlined" value={details.text} onChange={handleChange} /> 
      <Button style={{
        borderRadius: 35,
        backgroundColor: "#49aec4", align: "center"}} variant="contained" onClick={onSubmit}>Submit</Button>
    </Box>
    
    
  );
}