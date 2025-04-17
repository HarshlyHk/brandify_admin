// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff7403',
      light: '#ff7403',
      dark: '#c325c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#5D5FEF',
      contrastText: '#fff',
    },
    background: {
      default: '#FFF',
      paper: '#ffffff',
    },
    text: {
      primary: '#2D2A2E',
      secondary: '#666666',
    },
    divider: '#f5e1f5',
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

export default theme;
