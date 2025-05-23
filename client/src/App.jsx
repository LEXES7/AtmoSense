import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Home from './pages/home';
import Header from './components/Header';
import Footer from './components/Footer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#1976d2',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

export default function App() {
  const handleSearch = (query) => {
    console.log('Search query:', query);
    // Add your search logic here
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh' 
        }}>
          <Header onSearch={handleSearch} />
          {/* Add a container with padding-top to prevent content from being hidden under the fixed header */}
          <Box component="main" className="pt-20" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}