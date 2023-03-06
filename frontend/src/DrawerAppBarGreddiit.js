import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./pages/Profile";
import MySubGreddiits from "./pages/MySubGreddiits";
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ForumIcon from '@mui/icons-material/Forum';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Group';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ReportIcon from '@mui/icons-material/Report';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { width } from "@mui/system";

const drawerWidth = 240;
//const navItems = ['Profile', 'MySubGreddiits', 'SubGreddiits', 'Saved'];




export default function DrawerAppBarGreddiit(props) {
  // navigate between Users, JoiningRequests, Stats, Reported pages through key board shortcuts
  

  const navItems = [
    { label: "Profile", path: "/homepage/profile", icon: <PermIdentityIcon /> },
    { label: "MySubGreddiits", path: "/homepage/mysub", icon: <RateReviewIcon /> },
    { label: "SubGreddiits", path: "/homepage/sub", icon: <ForumIcon /> },
    { label: "Saved", path: "/homepage/saved", icon: <StarIcon /> },
    { label: "Users", path: "/homepage/mysub/users/"+props.subId, icon: <GroupIcon /> },
    { label: "JoiningRequests", path: "/homepage/mysub/joiningreq/"+props.subId, icon: <AddBoxIcon /> },
    { label: "Stats", path: "/homepage/mysub/stats/"+props.subId, icon: <AssessmentIcon /> },
    { label: "Reported", path: "/homepage/mysub/reported/"+props.subId, icon: <ReportIcon /> },
    { label: "Logout", path: "/", icon: <LogoutIcon /> }
  ];
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
    
  };
  const navigate= useNavigate();
  const handleChange = (page) => {
    if(page.path === "/"){
      localStorage.removeItem("token_login");
      localStorage.removeItem("user_id")
      //localStorage.clear();
    }
    var link = `${page.path}`;
    // const loggedin = localStorage.getItem("token_login");
    // console.log(loggedin);
    navigate(link);
    console.log(page);
  }
 
  // useeffect to navigate between pages using keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key == "1") {
        handleChange({path: "/homepage/mysub/users/"+props.subId});
      } else if (event.key == "2") {
        handleChange({path: "/homepage/mysub/joiningreq/"+props.subId});
      } else if (event.key == "3") {
        handleChange({path: "/homepage/mysub/stats/"+props.subId});
      } else if (event.key == "4") {
        handleChange({path: "/homepage/mysub/reported/"+props.subId});
      } 
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);



  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Greddiit
      </Typography>
      <Divider />
      <List>
        {navItems.map(({label}) => (
          <ListItem key={label} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Greddiit
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map(({label,path,icon}) => (
              <Button style={{ width: '170px' }} onClick={() => handleChange({path})} key={label} sx={{ color: '#fff' }} startIcon={icon}>
                {label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="permanent"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

DrawerAppBarGreddiit.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};