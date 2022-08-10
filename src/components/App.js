import './App.scss';
import {useTheme} from '../contexts/ThemeContext'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from './Layout';

// 배포 환경에서 console.log, console.warn 지우기
if (process.env.NODE_ENV === "production") {
  console.log = function no_console() {};
  console.warn = function no_console() {};
}

function App({ user }) {
  const { darkTheme } = useTheme()
  
  const themeMui = createTheme({
    palette: {
      primary: {
        main: '#ff4400',
      },
      secondary: {
        main: '#2e7d32',
      },
      neutral: {
        main: '#757575',
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
            <Layout/>
          </div>
        </AuthProvider>
        
      </div>
    </ThemeProvider>
  );
}

export default App;
