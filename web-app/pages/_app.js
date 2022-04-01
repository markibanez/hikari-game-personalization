import { SnackbarProvider } from 'notistack';
import { WalletProvider } from '../contexts/WalletContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from 'next/head'
import './styles.css';
import './../public/MyFontsWebfontsKit.css'

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
        <>
            <Head>
                <title>Hikari</title>
            </Head>
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
        </>
    );
}

export default MyApp;
