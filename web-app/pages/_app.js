import { SnackbarProvider } from 'notistack';
import { WalletProvider } from '../contexts/WalletContext';
import './styles.css';

function MyApp({ Component, pageProps }) {
    return (
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
    );
}

export default MyApp;
