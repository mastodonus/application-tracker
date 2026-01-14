import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',

    background: {
      default: '#121212',   // app background
      paper: '#1e1e1e',     // cards, modals, drawers
    },

    primary: {
      main: '#90caf9',      // soft blue (easy on eyes)
    },

    secondary: {
      main: '#f48fb1',      // muted pink accent
    },

    text: {
      primary: '#e0e0e0',
      secondary: '#a0a0a0',
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    h6: {
      fontWeight: 600,
    },
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1b1b1b',
          boxShadow: 'none',
          borderBottom: '1px solid #2a2a2a',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e1e1e',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;