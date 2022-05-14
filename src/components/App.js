import './App.scss';
import {useTheme} from '../contexts/ThemeContext'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from './Layout';
import OMGLayout from './OMGLayout';

function App({ user }) {
  const { darkTheme } = useTheme()
  
  const themeMui = createTheme({
    palette: {
      primary: {
        main: '#ff4400',
      },
      neutral: {
        main: '#64748B',
        contrastText: '#fff',
      },
      mode: darkTheme ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={themeMui}>
      <div className={`App ${darkTheme?'dark':''}`}>
        <div className="Back">
        </div>

        <AuthProvider>  
          <div className="Front">
            {/* <Layout /> */}
            <OMGLayout />
          </div>
        </AuthProvider>
        
      </div>
    </ThemeProvider>
  );
}

export default App;
