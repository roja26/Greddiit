import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';

export default function RegisterFields() {
  const [details, setName] = useState({firstname: "", lastname: "",username: "",password: "", email: "", age: "", contact: ""});
  const handleChange = (event) => {
    setName({...details, [event.target.id]: event.target.value});
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(details)
    for (var key in details) {
      if (details[key] === "") {
        alert("Please fill in all fields");
        return;
      }
    }
    axios.post("/api/user/createUser", details, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
    .then((res) => {
      if(res.status == 201){
        alert(res.data);
      }
      else if(res.status == 200){
        alert('Registered')
      }
    });
    setName({firstname: "", lastname: "",username: "",password: "", email: "", age: "", contact: ""});

  }

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      
    >
      <TextField id="firstname" label="First Name" variant="filled" value={details.firstname} onChange={handleChange} />
      <TextField id="lastname" label="Last Name" variant="filled" value={details.lastname} onChange={handleChange} /><br/>
      <TextField id="username" label="User Name" variant="filled" value={details.username} onChange={handleChange} /> 
      <TextField id="password" label="Password" variant="filled" type="password" value={details.password} onChange={handleChange} /><br/>
      <TextField id="email" label="Email" variant="filled" value={details.email} onChange={handleChange} />
      <TextField id="age" label="Age (Yrs)" variant="filled" value={details.age} onChange={handleChange} /><br/>
      <TextField id="contact" label="Contact" variant="filled" value={details.contact} onChange={handleChange} /><br/>
      <Button style={{
        borderRadius: 35,
        backgroundColor: "#49aec4", align: "center"}} variant="contained" onClick={handleSubmit} disabled={!(details.username && details.password)}>Submit</Button>

    </Box>
    
  );
}