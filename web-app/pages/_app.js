import { SnackbarProvider } from 'notistack';
import { WalletProvider } from '../contexts/WalletContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './styles.css';

const theme = createTheme({
    typography: {
        fontFamily: `Bankai`,
        fontSize: 14,
        fontWeightLight: 400,
        fontWeightRegular: 500,
        fontWeightMedium: 700,
    },
    palette: {
        // background: {
        //     default: '#FFF',
        //     paper: '#FFF',
        // },
        // text: {
        //     primary: '#000'
        // },
        // primary: {
        //     main: '#E6EEF7'
        // },
        // secondary: {
        //     main: '#FFF'
        // },
        // action: {
        //     active: '#FFF'
        // },
    },
});

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider
                maxSnack={6}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
            >
                <WalletProvider>
                    <Component {...pageProps} />
                </WalletProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default MyApp;
