import React, {useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DrawerAppBar from '../DrawerAppBar';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import CardMedia from '@mui/material/CardMedia';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { LineAxisOutlined, SettingsInputSvideoRounded, Token } from '@mui/icons-material';
import axios from 'axios';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >

  </Box>
);

function BasicMenu({people, name}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleDelete= (item) => (event) => {
    event.preventDefault();
    if(name=="Following"){
      const id = localStorage.getItem('user_id');
    axios
      .post("/api/user/removeFollowing", {me_id: localStorage.getItem('user_id'), personId: item._id}, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
      }).then((res) => {
        if(res.status == 201){
          alert(res.data);
        }else{
          window.location.reload();
        }
      })
  
    }
    else{
      const id = localStorage.getItem('user_id');
    axios
      .post("/api/user/removeFollower", {me_id: localStorage.getItem('user_id'), personId: item._id}, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
      }).then((res) => {
        if(res.status == 201){
          alert(res.data);
        }else{
          window.location.reload();
        }
      })
    }
  }
  return (
    <div>
      <h4 align="center">{name}</h4>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{width: '180px', fontSize: '40px'}}
      >
        {people.length}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {people.map((item, index) =>(
          <MenuItem onClick={handleClose}>{item.username}
          <IconButton aria-label="delete" onClick={handleDelete(item)}>
          <DeleteIcon />
          </IconButton> 
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
function BasicCard() {
  const [editable, onChange] = useState(true);
  const [user, setUser] = useState({followers: [], following: []});

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
        setUser(res.data);
      }
      else{
        alert(res.data);
      }
    })
  }, []);

  const editPage = (event) => {
    event.preventDefault();
    console.group(editable)
    onChange(false)
  }
  const savePage = (event) => {
    const id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token_login");
    event.preventDefault();
    console.group(editable)
    onChange(true)
    axios.post("/api/user/updateUser", {...user, id}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*',
      }
    })
    .then((res) => {
      if(res.status == 200){
        console.log(res.data)
        setUser(res.data);
      }
      else{
        alert(res.data);
      }
    })
  }
  const handleChange = (event) => {
    setUser({...user, [event.target.id]: event.target.value});
  };
  return (
    <div style={{
        position: 'absolute', left: '50%', top: '53%',
        transform: 'translate(-50%, -50%)',
    }}>
    <Card variant='outlined' sx={{ width: 450 }}>
    <h2> My Profile </h2>
    <CardMedia
        sx={{ height: 200 }}
        image="/images/image.jpeg"
        title="me"
      />
      <CardContent>
        <div style={{
          display: 'flex', 
          }}>
          <BasicMenu people={user.followers} name="Followers"/>
          <BasicMenu people={user.following} name="Following"/>
        </div>
        <Typography sx={{ fontSize: 18 }} color="text.secondary" >
          First Name:
        </Typography>
        <Typography variant="h6" component="div">
        <TextField id="firstname" size= "small" value={user.firstname} onChange={handleChange} disabled={editable}/>
        </Typography>
        <Typography sx={{ fontSize: 18 }} color="text.secondary">
          Last Name:
        </Typography>
        <Typography variant="h6" component="div">
        <TextField id="lastname" size= "small" value={user.lastname} onChange={handleChange} disabled={editable} />
        </Typography>
        <Typography sx={{ fontSize: 18 }} color="text.secondary" >
          User Name:
        </Typography>
        <Typography variant="h6" component="div">
        <TextField id="username" size= "small" value={user.username} onChange={handleChange} disabled={editable} />
        </Typography>
        <Typography sx={{ fontSize: 18 }} color="text.secondary" >
          Email:
        </Typography>
        <Typography variant="h6" component="div">
        <TextField id="email" size= "small" value={user.email} onChange={handleChange} disabled={editable} />
        </Typography>
        <Typography sx={{ fontSize: 18 }} color="text.secondary" >
          Contact:
        </Typography>
        <Typography variant="h6" component="div">
        <TextField id="contact" size= "small" value={user.contact} onChange={handleChange} disabled={editable} />
        </Typography>
        <Typography sx={{ fontSize: 18 }} color="text.secondary" >
          Age:
        </Typography>
        <Typography variant="h6" component="div">
        <TextField id="age" size= "small" value={user.age} onChange={handleChange} disabled={editable} />
        </Typography>
        <CardActions>
        <Button style={{ borderRadius: 35, backgroundColor: "secondary", align: "center"}} variant="contained" onClick={editPage} >Edit</Button>
        <Button style={{ borderRadius: 35, backgroundColor: "secondary", align: "center"}} variant="contained" onClick={savePage} >Save</Button>
        </CardActions>
      </CardContent>
      </Card>
      </div>
  );
}
export default function Profile() {
    return (
      <div>
        <DrawerAppBar />
        <Box bgcolor=" #a3dee3" component="main" sx={{ p: 3, height: '1000px'}}>
          <Toolbar />
          <Typography>
            <BasicCard />
          </Typography>
        </Box>
      </div>
      
    );
  }