import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Fade, Stack, Typography } from '@mui/material'
import { ethers } from 'ethers';
import { WalletContext } from '../contexts/WalletContext'

export default function ConnectWallet(props) {
    const wallet = useContext(WalletContext);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(wallet.address ? false : true);
    }, [wallet.address]);

    return (
        <>
            <Fade in={visible} timeout={1000} unmountOnExit>
                <Card
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
                </Card>
            </Fade>
        </>
    )
}
