import React, {useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { ListItemSecondaryAction } from '@mui/material';
import { IconButton } from '@mui/material';
import { Delete, Directions } from '@mui/icons-material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GCard({list, index, edit}){
  const navigate= useNavigate();
  if(index == -1) {
    return (
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
          No. of people :  0
          </Typography>
          <Typography variant="h5" component="div">
          No. of posts : 0
          </Typography>
          <Typography variant="h5" component="div">
            Name: 
          </Typography>
          <Typography variant="h6" component="div">
            Description:
          </Typography>
          <Typography variant="h6" component="div">
            Banned Keywords:
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">DELETE</Button>
          <Button size="small">OPEN</Button>
        </CardActions>
      </Card>
    );
  }
  const item = list[index];
  const handleDelete= (index) => (event) => {
    event.preventDefault();
    const id = localStorage.getItem('user_id');
    axios
      .post("/api/subGreddiit/deletesubGreddiit", {id, subId: item._id}, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
      }).then((res) => {
        if(res.status == 201){
          alert(res.data);
        }else{
          alert('Deleted');
          window.location.reload();
        }
      })
  }
  const handleOpen = (event) => {
    event.preventDefault();
    navigate("/homepage/mysub/users/"+item._id);
  }
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
        No. of people :  {item.people.length}
        </Typography>
        <Typography variant="h5" component="div">
        No. of posts : {item.posts.length}
        </Typography>
        <Typography variant="h5" component="div">
          Name: {item.name}
        </Typography>
        <Typography variant="h6" component="div">
          Description: {item.description}
        </Typography>
        <Typography variant="h6" component="div">
          Banned Keywords: {item.banned.split(',')}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleDelete(index)}>DELETE</Button>
        <Button size="small" onClick={handleOpen}>OPEN</Button>
      </CardActions>
    </Card>
  );
}

export default function MyList({list,edit}) {
  //console.log("list",list);
  const [display_index, setIndex] = useState(-1);
  const displayDetails = (index) => (event) => {
    event.preventDefault();
    setIndex(index);
  }
  return (
    <Box display="flex" flexDirection="row" sx={{ p: 3}} >
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
        {list.map((item, index) => (
          <ListItemButton key={item.name} onClick={displayDetails(index)}>
            <ListItemText primary={item.name} secondary={item.tags} />
          </ListItemButton>
        ))}
      </List>
      <GCard list={list} index={display_index} edit={edit}/>
    </Box>
  );

}