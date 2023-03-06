import React, {useState,useEffect} from 'react';
import Button from '@mui/material/Button';
import { Modal } from './Modal';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


export default function Form({onSubmit, details, detset}) {
  // const [details, setName] = useState({name: "",description: "",tags:"",banned:""});
  // const [list, addList] = useState([])
  //const [greddiits, addNew] = useState({})
  const handleChange = (event) => {
    detset({...details, [event.target.id]: event.target.value});
  };
  // const handleSubmit = (event) =>{
  //   event.preventDefault();
  //   console.log(details);
  //   addList([details].concat(list));
  //   console.log(list);
  //   setName({name: "",description: "",tags:"",banned:""});
  // }
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1},
      }}
      noValidate
      autoComplete="off"
    >
      <TextField fullWidth={true} id="name" label="Name" variant="outlined" value={details.name} onChange={handleChange} /> 
      <TextField fullWidth={true} multiline={true} maxRows={4} id="description" label="Description" variant="outlined" value={details.description} onChange={handleChange} /><br/>
      <TextField fullWidth={true} id="tags" label="Tags (Comma Separated)" variant="outlined" value={details.tags} onChange={handleChange} /> 
      <TextField fullWidth={true} id="banned" label="Banned Keywords (Comma Separated)" variant="outlined" value={details.banned} onChange={handleChange}/><br/>
      <Button style={{
        borderRadius: 35,
        backgroundColor: "#49aec4", align: "center"}} variant="contained" onClick={onSubmit}>Submit</Button>
    </Box>
    
    
  );
}