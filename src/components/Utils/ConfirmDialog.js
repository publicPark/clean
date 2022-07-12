import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// callback이 있으면 confirm
const AlertDialog = ({
  msg1, msg2, open, setOpen, callback, confirmText = "예",
  isForm, formLabel="입력하세요"
}) => {
  const [text, setText] = useState("")
  const [err, setErr] = useState("")

  const handleClose = () => {
    setOpen(false);
  };

  const handleYeah = () => {
    setErr("")
    if (isForm) {
      if (!text) {
        setErr(`${formLabel}!`)
        return
      }
      callback(text);
    } else {
      callback();
    }
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
          <DialogContentText id="alert-dialog-slide-description" sx={{whiteSpace:'pre-line'}}>
            {msg2}
          </DialogContentText>
          {isForm &&
            <TextField id="standard-basic" label={formLabel} variant="standard"
            sx={{mt:1}}
            value={text} onChange={(e)=>setText(e.target.value)}
            />
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
          {callback && <Button onClick={handleYeah}>{ err ? err : confirmText}</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlertDialog;