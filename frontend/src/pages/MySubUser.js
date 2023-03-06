import React, {useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DrawerAppBarGreddiit from '../DrawerAppBarGreddiit';
import Toolbar from '@mui/material/Toolbar';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import PeopleIcon from '@mui/icons-material/People';
import BlockIcon from '@mui/icons-material/Block';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import axios from 'axios';


export default function MySubUser() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [users, setUsers] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const subId = window.location.pathname.split("/")[4];
  useEffect(() => {
    const token = localStorage.getItem("token_login");
    axios.get("/api/subGreddiit/getJoined/"+subId, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*',
      }
    })
    .then((res) => {
      if(res.status == 200){
        console.log(res.data)
        setUsers(res.data);
      }
      else{
        alert(res.data);
      }
    })
  }, []);
  // const users = ["A","B","C"];
  useEffect(() => {
    const token = localStorage.getItem("token_login");
    axios.get("/api/report/getBlocked/"+subId, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*',
      }
    })
    .then((res) => {
      if(res.status == 200){
        console.log(res.data)
        setBlocked(res.data);
      }
      else{
        alert(res.data);
      }
    })
  }, []);

  const handleClick1 = () => {
    setOpen1(!open1);
  };
  const handleClick2 = () => {
    setOpen2(!open2);
  };
  return (
    <div>
      <DrawerAppBarGreddiit subId={subId}/>
      <Box bgcolor=" #a3dee3" component="main" sx={{ p: 3, height: '1000px'}}>
        <Toolbar />
        <Typography>
          <h1>My Sub Users</h1>
        </Typography>
        <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Users
        </ListSubheader>
      }> 
      <ListItemButton onClick={handleClick1}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Joined" />
        {open1 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open1} timeout="auto" unmountOnExit>
        {users.map(item => (
          <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} key={item._id}>
            <ListItemIcon>
              <SentimentSatisfiedAltIcon />
            </ListItemIcon>
            <ListItemText primary={item.username} />
          </ListItemButton>
        </List>
        ))}
      </Collapse>
      
      <ListItemButton onClick={handleClick2}>
        <ListItemIcon>
          <BlockIcon />
        </ListItemIcon>
        <ListItemText primary="Blocked" />
        {open2 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open2} timeout="auto" unmountOnExit>
      {blocked.map(item => (
          <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <SentimentVeryDissatisfiedIcon/>
            </ListItemIcon>
            <ListItemText primary={item.postedby.username} />
          </ListItemButton>
        </List>
        ))}
      </Collapse>
    </List>
      </Box>
    </div>
    
  );
}

