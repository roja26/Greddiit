import React, {useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DrawerAppBarGreddiit from '../DrawerAppBarGreddiit';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { ButtonGroup } from '@mui/material';
import axios from 'axios';
export default function MySubJoin() {
  const [requests, newRequests] =useState([]);
  // const handleClick= (index) => (event) => {
  //   event.preventDefault();
  //   newRequests([
  //     ...requests.slice(0, index),
  //     ...requests.slice(index + 1,requests.length)
  //   ]);
  // }
  const subId = window.location.pathname.split("/")[4];
  useEffect(() => {
    const token = localStorage.getItem("token_login");
    axios.get("/api/subGreddiit/getRequests/"+subId, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*',
      }
    })
    .then((res) => {
      if(res.status == 200){
        console.log(res.data)
        newRequests(res.data);
      }
      else{
        alert(res.data);
      }
    })
  }, []);

  const onAccept = (item) => (event) => {
    event.preventDefault();
    axios
      .post("/api/subGreddiit/acceptRequest", {subId: subId, id: item._id}, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
      }).then((res) => {
        if(res.status == 201){
          alert(res.data);
        }else{
          alert("Accepted");
          window.location.reload();
        }
      })
  }
  const onReject = (item) => (event) => {
    event.preventDefault();
    axios
      .post("/api/subGreddiit/rejectRequest", {subId: subId, id: item._id}, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
      }).then((res) => {
        if(res.status == 201){
          alert(res.data);
        }else{
          alert("Rejected");
          window.location.reload();
        }
      })
  }

    return (
      <div>
        <DrawerAppBarGreddiit subId={subId}/>
        <Box bgcolor=" #a3dee3" component="main" sx={{ p: 3, height: '1000px'}}>
          <Toolbar />
          <Typography>
            <h1>Pending Joining Requests</h1>
          </Typography>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {requests.map((item, index) => (
              <ListItem
                key={item._id}
                secondaryAction={
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button><CheckCircleIcon onClick={onAccept(item)}/></Button>
                    <Button><CancelIcon onClick={onReject(item)}/></Button>
                  </ButtonGroup>
                }
              >
                <ListItemText primary={item.username} />
              </ListItem>
            ))}
          </List>
        </Box>
      </div>
      
    );
  }