
import Chip from '@mui/material/Chip';
import styles from './Place.module.scss'
import { useState } from 'react';

import { useNavigate } from "react-router-dom";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Members from '../Form/Members';

const Place = ({ id, name, days, members, description, currentUser }) => {
  let navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const handleClick = () => {
    setOpen((cur)=> !cur)
  }

  const handleClose = () => {
    setOpen(false);
  };
  const handleListItemClick = (value) => {
    // edit
    if (value === 'Edit') navigate(`/placeform/${id}`)
    else if(value==='Cleaned') navigate(`/cleaned/${id}`)
  };


  return (
    <>
      <Chip label={name} onClick={handleClick} color="primary" />
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>{name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}<br /><br />
          </DialogContentText>
          <div>
            Limit days: <b>{days}일</b><br />
            Code: <b>{id}</b><br />
            Members: <Members members={ members } currentUser={currentUser} />
          </div>
        </DialogContent>
        <List sx={{ pt: 0 }}>
          <ListItem autoFocus button onClick={() => handleListItemClick('Edit')}>
            <ListItemText primary="Edit" />
          </ListItem>
          <ListItem autoFocus button onClick={() => handleListItemClick('Cleaned')}>
            <ListItemText primary="I've Cleaned!" />
          </ListItem>
        </List>
      </Dialog>
    </>
  )
}

export default Place