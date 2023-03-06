import React, {useState,useEffect} from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
  useNavigate
} from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Homepage from "./Homepage";
import axios from 'axios';
export default function RegisterFields() {
  const [details, setName] = useState({username: "",password: ""});
  const handleChange = (event) => {
    setName({...details, [event.target.id]: event.target.value});
  };
  const navigate= useNavigate();
  const handleSubmit = (event) =>{
    event.preventDefault();
    axios.post("/api/user/login", details, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
    .then((res) => {
      if(res.status == 201){
        alert(res.data);
      }
      else if(res.status == 200){
        alert('Logged In');
        localStorage.setItem("token_login",res.data.token);
        localStorage.setItem("user_id",res.data.id);
        navigate("/homepage");
      }
    });
    //console.log(details)
    setName({username: "",password: ""});
  }

  const theme = useTheme();
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="username" label="User Name" variant="filled" value={details.username} onChange={handleChange} /> 
      <TextField id="password" label="Password" variant="filled" type="password" value={details.password} onChange={handleChange} /><br/>
      <Button style={{
        borderRadius: 35,
        backgroundColor: "#49aec4", align: "center"}} variant="contained" onClick={handleSubmit} disabled={!(details.username && details.password)}>Submit</Button>
    </Box>
    
    
  );
}