import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// callback이 있으면 confirm
const AlertDialog = ({
  msg1, msg2, open, setOpen, callback, confirmText="예"
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleYeah = () => {
    callback();
    setOpen(false);
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{ msg1 }</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            { msg2 }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
          {callback && <Button onClick={handleYeah}>{confirmText}</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlertDialog;