import React, {useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DrawerAppBar from '../DrawerAppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ButtonGroup from '@mui/material/ButtonGroup';
import axios from 'axios';


export default function MySubGreddiits() {
  const [list, addList] = useState([]);
  useEffect(() => {
    const id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token_login");
    axios.get("/api/user/getUser/"+id, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*',
      }
    })
    .then((res) => {
      if(res.status == 200){
        console.log(res.data)
        addList(res.data.saved);
      }
      else{
        alert(res.data);
      }
    })
  }, []);
  const UnSavePost =(item) => (event) => {
    event.preventDefault();
    axios
      .post("/api/user/RemoveSavePost", {postId: item._id, id: localStorage.getItem('user_id')}, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
      }).then((res) => {
        if(res.status == 201){
          alert(res.data);
        }else{
          alert("Removed");
          window.location.reload();
        }
      })
  }
    return (
      <div>
        <DrawerAppBar />
        <Box bgcolor=" #a3dee3" component="main" sx={{ p: 3, height: '1000px'}}>
          <Toolbar />
          <Typography>
            <h1>Saved Posts</h1>
          </Typography>
          <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper'}}>
          {list.map((item, index) => (
            <ListItemButton key={item._id}>
              <ListItemText primary={item.text} secondary={item.postedby.username+"/"+item.postedin.name}/>
              <ButtonGroup variant="contained" aria-label="outlined primary button group">
                      <Button style={{ backgroundColor: "red"}} onClick={UnSavePost(item)}>Remove</Button>          
              </ButtonGroup>
            </ListItemButton>
          ))}
      </List>
        </Box>
      </div>
      
    );
  }