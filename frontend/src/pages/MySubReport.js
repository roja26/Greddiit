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
import axios from 'axios';
import ListItemButton from '@mui/material/ListItemButton';
import ButtonGroup from '@mui/material/ButtonGroup';


function BlockCancelButton(props) {
  const [timer, setTimer] = useState(-1);

  const clickCancel =(event) => {
    event.preventDefault();
    setTimer(-1);
  }

  useEffect(() => {
    if(timer > 0){
      setTimeout(() => {
        setTimer(time => time - 1);
      }, 1000);
    }else if(timer == 0){
      props.clickBlock(props.item, props.index);
      setTimer(-1);
    }
  }, [timer]);

  return (
    <>
    {timer > 0 ? 
      <Button style={{ backgroundColor: "purple"}} onClick={clickCancel}>Cancel in {timer}</Button> : 
      <Button style={{ backgroundColor: "red"}} disabled={props.disableBlock[props.index]} onClick={()=>setTimer(3)}>Block</Button>
    }
    </>
  );
}
{/* <Button style={{ backgroundColor: "red"}} disabled={props.disableBlock[index]} onClick={props.clickBlock(item, index)}>Block</Button> */}
export default function MySubReport() {
  const subId = window.location.pathname.split("/")[4];
  const [list, addList] = useState([]);
  const [disableBlock, setDisableBlock] = useState(Array(list.length).fill(false));
  const [disableDelete, setDisableDelete] = useState(Array(list.length).fill(false)); 
  useEffect(() => {
    const token = localStorage.getItem("token_login");
    axios.get("/api/report/getReport/"+subId, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*',
      }
    })
    .then((res) => {
      if(res.status == 200){
        addList(res.data);
      }
      else{
        alert(res.data);
      }
    })
    //iterate through list and set disableBlock and disableDelete to opposite of ignore
    var temp = Array(list.length).fill(false);
    var temp2 = Array(list.length).fill(false);
    list.map((item, index) => {
      if(item.ignored == true){
        temp[index] = true;
        temp2[index] = true;

      }
    })
    setDisableBlock(temp);
    setDisableDelete(temp2);
  }, []);
  

  const clickIgnore = (item, index) => (event) => {
    event.preventDefault();
    console.log(disableBlock);
    axios.
    post("/api/report/setIgnored", {id: item._id, ignored: true}, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
    }).then((res) => {
      if(res.status == 201){
        alert(res.data);
      }else{
        alert("Ignored");
        window.location.reload();
      }
    }
    )
    var temp = disableBlock;
    temp[index] = true;
    setDisableBlock(temp);
    
    var temp2 = disableDelete;
    temp2[index] = true;
    setDisableDelete(temp2);

  }

  const clickBlock = (item, index) => {
    // event.preventDefault();
    console.log("hey");
    axios
    .post("/api/report/blockPost", {id: item._id, postId: item.post._id, subId: subId}, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
    }).then((res) => {
      if(res.status == 201){
        alert(res.data);
      }else{
        alert("Blocked");
        window.location.reload();
      }
    }
    )
  }
    
  const clickDelete = (item) => (event) => {
    event.preventDefault();
    axios
    .post("/api/report/deletePost", {id: item._id, postId: item.post._id, subId: subId}, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
    }).then((res) => {
      if(res.status == 201){
        alert(res.data);
      }else{
        alert("Deleted");
        window.location.reload();
      }
    }
    )
  }

    return (
      <div>
       <DrawerAppBarGreddiit subId={subId}/>
        <Box bgcolor=" #a3dee3" component="main" sx={{ p: 3, height: '1000px'}}>
          <Toolbar />
          <Typography>
            <h1>My Sub Reports</h1>
          </Typography>
          <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper'}}>
        {list.map((item, index) => (
          <div>
          <ListItemButton key={index} >
            <ListItemText primary={item.concern} secondary={item.reportedby.username} />
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <BlockCancelButton disableBlock={disableBlock} clickBlock={clickBlock} item={item} index={index}/>
                    <Button style={{ backgroundColor: "blue"}} disabled={disableDelete[index]} onClick={clickDelete(item)}>Delete</Button>
                    <Button style={{ backgroundColor: "grey"}} onClick={clickIgnore(item, index)} >Ignore</Button>
            </ButtonGroup>
          </ListItemButton>
        </div>
        ))}
      </List>
        </Box>
      </div>
      
    );
  }