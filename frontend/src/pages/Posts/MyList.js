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
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ButtonGroup from '@mui/material/ButtonGroup';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

export default function MyList({list,edit}) {
  const [display_index, setIndex] = useState(-1);
  const displayDetails = (index) => (event) => {
    event.preventDefault();
    setIndex(index);
  }
  const Upvote = (item) => (event) => {
    event.preventDefault();
    axios
      .post("/api/post/upvote", {id: item._id}, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
      }).then((res) => {
        if(res.status == 201){
          alert(res.data);
        }
        window.location.href = window.location.href;
      })
  }
  const Downvote = (item) => (event) => {
    event.preventDefault();
    axios
      .post("/api/post/downvote", {id: item._id}, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
      }).then((res) => {
        if(res.status == 201){
          alert(res.data);
        }else{
          window.location.reload();
        }
      })
  }
  const Follow = (item) => (event) => {
    event.preventDefault();
    axios
      .post("/api/user/addFollower", {followerId: localStorage.getItem('user_id'), id: item.postedby._id}, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
      }).then((res) => {
        if(res.status == 201){
          alert(res.data);
        }else{
          alert("Followed");
          window.location.reload();
        }
      })
    }
  const SavePost =(item) => (event) => {
    event.preventDefault();
    axios
      .post("/api/user/savePost", {postId: item._id, id: localStorage.getItem('user_id')}, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
      }).then((res) => {
        if(res.status == 201){
          alert(res.data);
        }else{
          alert("Saved");
          window.location.reload();
        }
      })
  }
  // declare a new state variable, which we'll call "open"
  const [open, setOpen] = useState(Array(list.length).fill(false));
  const [enterComment, newComment] = useState("");
  //const comments =['a', 'b', 'c'];
  const handleClick = (index) => (event) => {
    event.preventDefault();
    const newOpen = [...open];
    newOpen[index] = !newOpen[index];
    setOpen(newOpen);
  };
  const handleChange = (event) => {
    newComment(event.target.value);
  };

  const sendComment = (item) => (event) => {
    event.preventDefault();
    axios
    .post("/api/post/addComment", {id: item._id, comment: enterComment}, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
    }).then((res) => {
      if(res.status == 201){
        alert(res.data);
      }else{
        alert("Commented");
        window.location.reload();
      }
    })
    newComment("");
  }
  const sendReport = (item) => (event) => {
    event.preventDefault();
    var reason = prompt("Enter reason for report");
    axios
    .post("/api/report/createReport", {reportedby: localStorage.getItem('user_id'), offender:item.postedby._id ,concern: reason, post: item._id, subId: window.location.pathname.split("/")[4]  }, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
    }).then((res) => {
      if(res.status == 201){
        alert(res.data);
      }else{
        alert("Reported");
        window.location.reload();
      }
    }
    )
  }
 
  return (
    <Box display="flex" flexDirection="row" sx={{ p: 3}} >
      <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper'}}>
        {list.map((item, index) => (
          <div>
          <ListItemButton key={item._id} onClick={handleClick(index)}>
            <ListItemText primary={item.text} secondary={item.blocked ? "Blocked User" : item.postedby.username} />
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button style={{ backgroundColor: "green"}} onClick={Upvote(item)}>{item.upvotes} </Button>
                    <Button style={{ backgroundColor: "red"}} onClick={Downvote(item)}>{item.downvotes}</Button>
                    <Button variant="outlined" onClick={Follow(item)}>Follow User</Button>
                    <Button style={{ backgroundColor: "purple"}} onClick={SavePost(item)}>Save</Button>
                    <Button style={{ backgroundColor: "orange"}} onClick={sendReport(item)}><ReportProblemIcon /></Button>
            </ButtonGroup>
          </ListItemButton>
          <Collapse in={open[index]} timeout="auto" unmountOnExit>
            <p> Comments- </p>
            <TextField size="small" id="comment" label="Comment" variant="outlined" value={enterComment} onChange={handleChange} /> 
            <Button style={{
              borderRadius: 35,
              backgroundColor: "#49aec4", align: "center"}} variant="contained" onClick={sendComment(item)}>Submit</Button>
          {item.comments && item.comments.map(item => (
            <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} key={item}>
              <ListItemText primary={item} />
            </ListItemButton>
            </List>
            ))}
          </Collapse>
        </div>
        ))}
      </List>
    </Box>
  );

}