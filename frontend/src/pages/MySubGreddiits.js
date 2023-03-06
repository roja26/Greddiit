import React, {useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DrawerAppBar from '../DrawerAppBar';
import Toolbar from '@mui/material/Toolbar';
import { Container } from './MySubGreddiits/Container';
import { Form } from './MySubGreddiits/Form';
import { Trigger } from './MySubGreddiits/Trigger';
import { ListItemText } from '@mui/material';
import { ListItemSecondaryAction } from '@mui/material';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import { Divider } from '@mui/material';
import { ListItemIcon } from '@mui/material';
import { Avatar } from '@mui/material';
import MyList from './MySubGreddiits/MyList';
import axios from 'axios';

export default function MySubGreddiits() {
  const triggerText = '+';
  // const [details, setName] = useState({_id: "",name: "",description: "",tags:"",banned:"", people: [], posts: []});
  // const [list, addList] = useState([{_id: "",name: "",description: "",tags:"",banned:"", people: [], posts: []}]);
  const [list, addList] = useState([]);
  const [details, setName] = useState({});

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token_login");
    axios.get("/api/subGreddiit/getsubGreddiit/"+id, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*',
      }
    })
    .then((res) => {
      if(res.status == 200){
        console.log(res.data)
        addList(res.data);
      }
      else{
        alert(res.data);
      }
    })
  }, []);

  const onSubmit = (event) => {
    event.preventDefault(event);
    addList([details].concat(list));
    console.log(list.length);
    const id = localStorage.getItem('user_id');
    axios.post("/api/subGreddiit/createsubGreddiit", {...details, id}, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
    })
    .then((res) => {
      if(res.status == 201){
        alert(res.data);
      }
      else if(res.status == 200){
        alert('SubGreddiit Added')
      }
    });
    setName({_id: "", name: "",description: "",tags:"",banned:"", people: [], posts: []});
  };
    return (
      <div>
        <DrawerAppBar />
        <Box bgcolor=" #a3dee3" component="main" sx={{ p: 3, height: '1000px'}}>
          <Toolbar />
          <Typography>
          <div className="App">
            <h1>My SubGreddiits page</h1>
            <Container triggerText={triggerText} onSubmit={onSubmit} details={details} detset={setName}/>
            <MyList list={list} edit={addList}/>
          </div>
          </Typography>
        </Box>
      </div>
      
    );
  }