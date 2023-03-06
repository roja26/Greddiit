import React from 'react';
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add';
const Trigger = ({ triggerText, buttonRef, showModal }) => {
  return (

    <Button style={{ borderRadius: 35, backgroundColor: "secondary", align: "center"}} variant="contained" onClick={showModal} className="btn btn-lg btn-danger center modal-button" ref={buttonRef}><Add /></Button>
  );
};
export default Trigger;