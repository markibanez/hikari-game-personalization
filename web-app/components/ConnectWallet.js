import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Card, Fade, Stack, Typography, Backdrop, CircularProgress } from '@mui/material';
import { ethers } from 'ethers';
import { WalletContext } from '../contexts/WalletContext';
import Link from 'next/link';

export default function ConnectWallet(props) {
    const wallet = useContext(WalletContext);
    const [showYourSouls, setShowYourSouls] = useState(false);

    useEffect(() => {
        if (wallet.address) {
            wallet.getNFTs();
        }
    }, [wallet.address])

    return (
        <>
            <Fade in={!wallet.address} timeout={1000} style={{ transitionDelay: '1000ms' }} unmountOnExit>
                <Box sx={{ width: '100vw', height: '100vh', textAlign: 'center' }}>
                    <img src="/images/begin-label.png" style={{ width: 500, marginTop: 40 }} />
                    <br />
                    <img
                        src="/images/connect-button.png"
                        style={{ width: 300, marginTop: 270 }}
                        onClick={async () => {
                            await wallet.connect();
                        }}
                    />
                </Box>
            </Fade>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={Boolean(wallet.address) && wallet.gettingTokens}
                // onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}
