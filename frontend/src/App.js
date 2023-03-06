import React, { useState, useEffect } from "react";
import Login from "./Login";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link
} from 'react-router-dom';
import Homepage from "./Homepage";
import Profile from "./pages/Profile";
import MySubGreddiits from "./pages/MySubGreddiits";
import SubGreddiits from "./pages/SubGreddiits";
import Saved from "./pages/Saved"
import MySubUser from "./pages/MySubUser";
import MySubJoin from "./pages/MySubJoin";
import MySubStats from "./pages/MySubStats";
import MySubReport from "./pages/MySubReport";
import ExpandSubGreddiit from "./pages/ExpandSubGreddiit";
import { ThemeProvider, createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    primary: {
      main: '#ec2323',
    },
    secondary: {
      main: '#23ecec',
    },
  }
});
function App() {
  const loggedin = localStorage.getItem("token_login");
  return (
    <div>
    <ThemeProvider theme={theme}>
    </ThemeProvider>
    <Router>
      <Routes>
        <Route exact path='/' element={loggedin ? <Homepage /> : <Login />} ></Route>
        <Route exact path='/homepage' element={loggedin ? <Homepage /> : <Login />}></Route>
        <Route exact path="/homepage/profile" element={loggedin ? <Profile /> : <Login />}></Route>
        <Route exact path="/homepage/mysub" element={loggedin ? <MySubGreddiits /> : <Login />}></Route>
        <Route exact path="/homepage/sub" element={loggedin ? <SubGreddiits /> : <Login />}></Route>
        <Route exact path="/homepage/saved" element={loggedin ? <Saved /> : <Login />}></Route>
        <Route exact path="/homepage/mysub/users/:id" element={loggedin ? <MySubUser /> : <Login />}></Route>
        <Route exact path="/homepage/mysub/joiningreq/:id" element={loggedin ? <MySubJoin /> : <Login />}></Route>
        <Route exact path="/homepage/mysub/stats/:id" element={loggedin ? <MySubStats /> : <Login />}></Route>
        <Route exact path="/homepage/mysub/reported/:id" element={loggedin ? <MySubReport /> : <Login />}></Route>
        <Route exact path="/homepage/sub/greddiit/:id" element={loggedin ? <ExpandSubGreddiit /> : <Login />}></Route>
      </Routes>
    </Router>
    </div>
    // <div>
    //   <Login />
    // </div> 
  );
}

export default App;
