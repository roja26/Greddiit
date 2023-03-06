import React, {useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import RegisterFields from "./RegisterFields";
import LoginFields from "./LoginFields";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link
} from 'react-router-dom';

export default function Login() {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // console.log(value);
  };

  return (
    <div style={{
      position: 'absolute', left: '50%', top: '30%',
      transform: 'translate(-50%, -50%)',
  }}>
    <Box sx={{ width: '100%', typography: 'body1' }}>
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Login" value="1" />
          <Tab label="Register" value="2" />
        </TabList>
      </Box>
      <TabPanel value="1"><LoginFields /></TabPanel>
      <TabPanel value="2"><RegisterFields /></TabPanel>
    </TabContext>
  </Box>
  </div>
  );
}

