import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Card, Fade, Stack, Typography, Backdrop, CircularProgress } from '@mui/material';
import { ethers } from 'ethers';
import { WalletContext } from '../contexts/WalletContext';
import Link from 'next/link';

export default function ConnectWallet(props) {
    const wallet = useContext(WalletContext);
    const [showYourSouls, setShowYourSouls] = useState(false);

    return (
        <>
            <Fade in={!wallet.address} timeout={1000} style={{ transitionDelay: '1000ms' }} unmountOnExit>
                <Box sx={{ width: '100vw', height: '100vh', textAlign: 'center' }}>
                    <img src="/images/begin-label.png" style={{ width: 500, marginTop: 40 }} />
                    <br />
                    <img
                        src="/images/begin-button.png"
                        style={{ width: 300, marginTop: 270 }}
                        onClick={async () => {
                            await wallet.connect();
                            setShowYourSouls(true);
                        }}
                    />
                </Box>
            </Fade>
            <Fade in={showYourSouls} timeout={1000} style={{ transitionDelay: '1000ms' }} unmountOnExit>
                <Box
                    sx={{
                        width: '800px',
                        height: '600px',
                        textAlign: 'center',
                        backgroundImage: `url("/images/branded-modal.png")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        paddingTop: '140px'
                    }}
                >
                    <Typography variant="h3" sx={{ fontFamily: 'DK-DDG', color: '#AEAD8F', marginTop: '30px' }}>
                        Your Souls...
                    </Typography>
                    <br />
                    <img
                        src="/images/begin-button.png"
                        style={{ width: 300, marginTop: 10 }}
                        onClick={async () => {
                            await wallet.getNFTs();
                            setShowYourSouls(false);
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
