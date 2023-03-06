import React, {useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DrawerAppBar from '../DrawerAppBar';
import Toolbar from '@mui/material/Toolbar';
import { CardMedia } from '@mui/material';
import axios from 'axios';
import { Container } from './Posts/Container';
import MyList from './Posts/MyList';

function MediaCard({id}) {
    const [item, addItem] = useState({});
    useEffect(() => {
        const token = localStorage.getItem("token_login");
        axios.get("/api/subGreddiit/displaySub/"+id, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Access-Control-Allow-Origin': '*',
          }
        })
        .then((res) => {
          if(res.status == 200){
            addItem(res.data);
          }
          else{
            alert(res.data);
          }
        })
      }, []);
return (
    <Card sx={{ maxWidth: 800 }}>
    <CardMedia
        sx={{ height: 140 }}
        image="/images/image.jpeg"
    />
    <CardContent>
        <Typography variant="h5" component="div">
        {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {item.description}
        </Typography>
    </CardContent>
    </Card>
);
}

export default function ExpandSubGreddiit() {
    const triggerText = '+';
    const [details, setName] = useState({});
    const [list, addList] = useState([]);
    const id = window.location.pathname.split("/")[4];
    useEffect(() => {
        const token = localStorage.getItem("token_login");
        axios.get("/api/post/getPost/"+id, {
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
      }, [list]);

      const [bannedWords, setBannedWords] = useState("");
      useEffect(() => {
        const token = localStorage.getItem("token_login");
        axios.get("/api/subGreddiit/displaySub/"+id, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Access-Control-Allow-Origin': '*',
          }
        })
        .then((res) => {
          if(res.status == 200){
            setBannedWords(res.data.banned);
          }
          else{
            alert(res.data);
          }
        })
      }, []);
      
    
    function filterContent(content) {
      const bannedKeywordsList = bannedWords.split(',');
      const bannedKey = new RegExp(bannedKeywordsList.join('|'), 'i');
      const filteredContent = [];
      const words = content.split(' ');
      for (const element of words) {
        const filteredWord = element.replace(bannedKey, (match) => '*'.repeat(match.length));
        filteredContent.push(filteredWord);
      }
      return filteredContent.join(' ');
    }

    const onSubmit = (event) => {
        console.log(bannedWords.split(','));
        event.preventDefault(event);
        addList([details].concat(list));
        console.log(details);
        axios.post("/api/post/createPost", {...details, text: filterContent(details.text) ,postedin: id, postedby: localStorage.getItem('user_id'), upvotes: 0, downvotes: 0}, {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
        })
        .then((res) => {
            if(res.status == 201){
            alert(res.data);
            }
            else if(res.status == 200){
            alert('Post Added')
            }
        });
        setName({_id: "", text: "", postedby: "", postedin: "", upvotes: 0, downvotes: 0});
    };    
    return (
      <div>
        <DrawerAppBar />
        <Box bgcolor=" #a3dee3" component="main" sx={{ p: 3, height: '1000px'}}>
          <Toolbar />
          <Typography>
            <MediaCard id={id}/>
            <br />
            <Container triggerText={triggerText} onSubmit={onSubmit} details={details} detset={setName} subid={id}/>
            <br/>
            <h3>Posts-</h3>
            <MyList list={list} edit={addList}/>
          </Typography>
        </Box>
      </div>
      
    );
  }

