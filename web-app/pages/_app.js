import { SnackbarProvider } from 'notistack';
import { WalletProvider } from '../contexts/WalletContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './styles.css';

const theme = createTheme({
    typography: {
        fontFamily: `HinaMincho`,
        fontSize: 14,
        fontWeightLight: 400,
        fontWeightRegular: 500,
        fontWeightMedium: 700,
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
