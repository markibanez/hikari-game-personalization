import { WalletContext } from '/contexts/WalletContext';
import WalletInfo from '/components/WalletInfo';
import styles from '/styles/Home.module.css';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useContext, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';

export default function Token() {
    const wallet = useContext(WalletContext);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { address, token } = router.query;

    const validAddress = ethers.utils.isAddress(address);
    const csAddress = validAddress ? ethers.utils.getAddress(address) : null;

    const tokenId = parseInt(token);

    useEffect(() => {
        if (router.isReady) {
            if (!validAddress)
                enqueueSnackbar('Invalid address', { variant: 'error', persist: true });
            if (isNaN(tokenId))
                enqueueSnackbar('Invalid token id', { variant: 'error', persist: true });
        }
    }, [router, validAddress, tokenId]);


    useEffect(() => {
        wallet.getNFT(tokenId)
            .then(token => {
                console.log(token);
            })
    }, []);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <WalletInfo />

                {validAddress && !isNaN(tokenId) &&
                <Card>
                    <CardContent>

                    </CardContent>
                </Card>
                }
            </main>
        </div>
    );
}
