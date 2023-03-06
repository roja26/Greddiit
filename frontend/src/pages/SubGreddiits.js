import React, {useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DrawerAppBar from '../DrawerAppBar';
import Toolbar from '@mui/material/Toolbar';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import axios from 'axios';
import Fuse from 'fuse.js';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Filter, Style } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import Chip from '@mui/material/Chip';
import StyleIcon from '@mui/icons-material/Style';
import AccessTimeIcon from '@mui/icons-material/AccessTime';


let temp = [];
let displayTags = [];
function SortTags({data, setData, searchData, setSearchData, allTags}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleTag = (tag) => (event) => {
    setAnchorEl(null);
    for (let i = 0; i < data.length; i++) {
      var tl = data[i].tags.split(',');
      for (let j = 0; j < tl.length; j++) {
        if (tl[j] == tag) {
          temp.push(data[i]);
          displayTags.push(tag);
          break;
        }
      }
    }
    console.log(displayTags);
    console.log(temp);
    setData(temp);
    setSearchData(temp);
  };
  return (
    <div>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <StyleIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        {allTags.map((tag) => (
          <MenuItem onClick={handleTag(tag)}>{tag}</MenuItem>
        ))}
      </Menu>
    </div>
  );
}


function SortMenu({data, setData, searchData, setSearchData}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAscAZ = () => {
    setAnchorEl(null);
    data.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    }
    );
    setData(data);
    setSearchData(data);
  };
  const handleDescAZ = () => {
    setAnchorEl(null);
    data.sort((a, b) => {
      if (a.name > b.name) {
        return -1;
      }
      if (a.name < b.name) {
        return 1;
      }
      return 0;
    });
    setData(data);
    setSearchData(data);
  };
  const handleAscFollow = () => {
    setAnchorEl(null);
    data.sort((a, b) => {
      if (a.people.length < b.people.length) {
        return -1;
      }
      if (a.people.length > b.people.length) {
        return 1;
      }
      return 0;
    }
    );
    setData(data);
    setSearchData(data);
  };
  const handleDescFollow = () => {
    setAnchorEl(null);
    data.sort((a, b) => {
      if (a.people.length > b.people.length) {
        return -1;
      }
      if (a.people.length < b.people.length) {
        return 1;
      }
      return 0;
    });
    setData(data);
    setSearchData(data);
  };
  const handleCreate = () => {
    setAnchorEl(null);
    data.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      return 0;
    });
    setData(data);
    setSearchData(data);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{fontSize: '40px'}}
      >
        <FilterListIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleAscAZ}><SortByAlphaIcon /> Ascending</MenuItem>
        <MenuItem onClick={handleDescAZ}><SortByAlphaIcon />Descending</MenuItem>
        <Divider />
        <MenuItem onClick={handleAscFollow}><PersonIcon />Ascending</MenuItem>
        <MenuItem onClick={handleDescFollow}><PersonIcon />Descending</MenuItem>
        <Divider />
        <MenuItem onClick={handleCreate}><AccessTimeIcon/>New First</MenuItem>
      </Menu>
    </div>
  );
}

function ActionAreaCard({item}) {
  const tags = item.tags.split(',');
  const navigate = useNavigate();
  const Expand = (event) => {
    event.preventDefault();
    console.log(item._id);
    if(disable)
      navigate("/homepage/sub/greddiit/"+item._id);
  };
  const joinSub =(item) => (event) => {
    event.preventDefault();
    axios
      .post("/api/subGreddiit/joinSub", {subId: item._id, id: localStorage.getItem('user_id')}, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
      }).then((res) => {
        if(res.status == 201){
          alert(res.data);
        }else{
          alert("Requested to join");
          window.location.reload();
        }
      })
  }
  const [disable, setDisable] = useState(false);
  const [mod, setMod] = useState(false);
  const [joined, setJoined] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token_login");
    axios.get("/api/subGreddiit/getJoined/"+item._id, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*',
      }
    })
    .then((res) => {
      if(res.status == 200){
        setJoined(res.data);
      }
      else{
        alert(res.data);
      }
    })
  }, []);
  useEffect(() => {
    joined.forEach((item, index) => {
    if (item._id == localStorage.getItem('user_id')) {
      setDisable(true);
      if(index == 0){
        setMod(true);
      }
    }
  });
  }, [joined]);

  const leaveSub =(item) => (event) => {
    event.preventDefault();
    axios
      .post("/api/subGreddiit/leaveSub", {subId: item._id, id: localStorage.getItem('user_id')}, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', Authorization: 'Bearer ' + localStorage.getItem('token_login') }
      }).then((res) => {
        if(res.status == 201){
          alert(res.data);
        }else{
          alert("Left SubGreddiit");
          window.location.reload();
        }
      })
  }
  
  return (
    <Card sx={{ maxWidth: 345, maxHeight: 400, display: 'inline-flex'}}>
      <CardActionArea onClick={Expand}>
        <CardMedia
          component="img"
          height="140"
          image="/images/image.jpeg"
          alt="person"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button sx={{color: "green"}} variant="outlined" size="normal" onClick={joinSub(item)} disabled={disable}>Join</Button>
          <Button sx={{color: "red"}} variant="outlined" size="normal" onClick={leaveSub(item)} disabled={!disable || mod}>Leave</Button>
        </CardActions>
        <CardActions>
          {tags.map((tag, index) => (
            <Chip label={tag} key={index} size="small" />
          ))}
        </CardActions>
      </CardActionArea>
    </Card>
  );
}
export default function MySubGreddiits() {
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState(data);
  const [q, setQ] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const searchItem = (query) =>(event) =>{
    event.preventDefault();
    console.log(query);
    if (!query) {
      setSearchData(data);
      return;
    }
    const fuse = new Fuse(data, {
      keys: ["name", "description"]
    });
    const result = fuse.search(query);
    const finalResult = [];
    if (result.length) {
      result.forEach((item) => {
        finalResult.push(item.item);
      });
      setSearchData(finalResult);
    } else {
      setSearchData([]);
    }
  };
  const handleChange = (event) => {
    setQ(event.target.value);
  };
  useEffect(() => {
    const token = localStorage.getItem("token_login");
    axios.get("/api/subGreddiit/subGreddiits/", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*',
      }
    })
    .then((res) => {
      if(res.status == 200){
        setData(res.data);
      }
      else{
        alert(res.data);
      }
    })
  }, [data]);

  const allTags = [...new Set(data.map((item) => item.tags.split(',')).flat())];
  useEffect(() => {
    setSelectedTags(displayTags);
  }, [displayTags]);

  const deleteTag = (tag) => (event) =>{
    event.preventDefault();
    // remove tag from displayTags
    displayTags = selectedTags.filter((item) => item !== tag);
    setSelectedTags(displayTags);
    // iterate through searchData and remove if it contains the tag
    let filteredData = [];
    console.log("*", filteredData);
    for (let i = 0; i < searchData.length; i++) {
      var tl = searchData[i].tags.split(',');
      var contains = 0;
      for (let j = 0; j < tl.length; j++) {
        if (tl[j] == tag) {
          contains = 1;
          break;
        }
        if(contains == 0){
          // add to filteredData if it doesnt already exist
          if(!filteredData.includes(searchData[i])){
            filteredData.push(searchData[i]);
          }

        }
      }
    }
    temp = filteredData;
    console.log(displayTags);
    console.log(filteredData);
    setSearchData(filteredData);

  };


    return (
      <div>
        <DrawerAppBar />
        <Box bgcolor=" #a3dee3" component="main" sx={{ p: 3, height: '1000px', margin: 'auto'}}>
          <Toolbar />
          <Typography>
            <h1>SubGreddiits page</h1>
          </Typography>
          <div>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 1500, spacing: 2 }}
          >
            <InputBase fullWidth={true}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search SubGreddiits"
              inputProps={{ 'aria-label': 'search subGreddiits' }}
              onChange={handleChange}
            />
            {selectedTags.map((item) => ( 
              <Chip label={item} key={item} size="small" onDelete={deleteTag(item)}/> 
            ))}
            <SortTags data={data} setData={setData} searchData={searchData} setSearchData={setSearchData} allTags={allTags}/>
            <SortMenu data={data} setData={setData} searchData={searchData} setSearchData={setSearchData}/>
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={searchItem(q)}>
              <SearchIcon />
            </IconButton>
          </Paper>
          < br />
          {searchData.map((item) => (
            <ActionAreaCard key={item.name} item={item} />
          ))}
          </div>
        </Box>
      </div>
      
    );
  }