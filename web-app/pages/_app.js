import { SnackbarProvider } from 'notistack';
import { WalletProvider } from '../contexts/WalletContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from 'next/head';
import './styles.css';
import './../public/MyFontsWebfontsKit.css';
import { useEffect } from 'react';

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
    useEffect(() => {
        window.onresize = () => {
            document.body.style.zoom = window.innerWidth / window.outerWidth;
        };
    }, []);
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
                        horizontal: 'right',
                    }}
                >
                    <WalletProvider>
                        <video
                            playsInline
                            autoPlay
                            muted
                            loop
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        >
                            <source src="https://storage.googleapis.com/hikari-genu/bg-video.mp4" type="" />
                        </video>
                        <Component {...pageProps} />
                    </WalletProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </>
    );
}

export default MyApp;
