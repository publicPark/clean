import { Box, Paper } from "@mui/material"
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';

const Description = ({ description, checked, handleChange }) => {
  return (
    <>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        mb: 3
      }}>
        <Paper elevation={3} sx={{
          whiteSpace: 'pre-line',
          textAlign: 'left',
          p: 2,
          fontSize: 14
        }}
        >
          {handleChange && 
            <>
              <FormControlLabel control={
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                />
              } label="아래 적힌 공지사항을 확인" />
              <Divider sx={{ mt: 1, mb: 2 }} />
            </>
          }
          <div>{description}</div>
        </Paper>
      </Box>
    </>
  )
}

export default Description