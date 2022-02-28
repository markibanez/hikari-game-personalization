import { Button, Card, Stack, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { WalletContext } from '../contexts/WalletContext'

export default function ConnectWallet(props) {
    const wallet = useContext(WalletContext);

    return (
        <>
            <Card
                sx={{
                    padding: 4,
                    opacity: 0.8
                }}
            >
                <Stack>
                    <Typography variant="h4" sx={{ marginBottom: 3 }}>
                        connect your web3 wallet
                    </Typography>
                    <Button variant="outlined" size="large" onClick={wallet.connect}>Connect</Button>
                </Stack>
            </Card>
        </>
    )
}
