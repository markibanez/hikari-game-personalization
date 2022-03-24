import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Card, Fade, Stack, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { WalletContext } from '../contexts/WalletContext';
import Link from 'next/link';

export default function ConnectWallet(props) {
    const wallet = useContext(WalletContext);

    return (
        <>
            <Fade in={!wallet.address} timeout={1000} style={{ transitionDelay: '1000ms' }} unmountOnExit>
                <Box sx={{ width: '100vw', height: '100vh', textAlign: 'center' }}>
                    <img src="/images/begin-label.png" style={{ width: 500, marginTop: 40 }} />
                    <br />
                    <img
                        src="/images/begin-button.png"
                        style={{ width: 300, marginTop: 270, cursor: 'pointer' }}
                        onClick={wallet.connect}
                    />
                </Box>

                {/* <Card
                    sx={{
                        padding: 4,
                    }}
                >
                    <Stack>
                        <Typography variant="h4" sx={{ marginBottom: 3 }}>
                            connect your web3 wallet
                        </Typography>
                        <Button variant="outlined" size="large" onClick={wallet.connect}>Connect</Button>
                    </Stack>
                </Card> */}
            </Fade>
        </>
    );
}
