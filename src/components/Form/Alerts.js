import { forwardRef } from 'react';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import { Stack } from '@mui/material';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Alerts = ({
  errMsg='', warnMsg='', successMsg='',
  setErrMsg, setWarnMsg, setSuccessMsg
}) => {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Collapse in={errMsg ? true : false} sx={{ }}>
        <Alert variant="filled" severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setErrMsg('');
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2, whiteSpace: 'pre-line' }}
        >{ errMsg }</Alert>
      </Collapse>
      
      <Collapse in={warnMsg?true:false}>
        <Alert variant="filled" severity="warning"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setWarnMsg('');
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2, whiteSpace: 'pre-line' }}
        >{ warnMsg }</Alert>
      </Collapse>

      <Collapse in={successMsg?true:false}>
        <Alert variant="filled" severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setSuccessMsg('');
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2, whiteSpace: 'pre-line' }}
        >{ successMsg }</Alert>
      </Collapse>
    </Stack>
  )
}

export default Alerts