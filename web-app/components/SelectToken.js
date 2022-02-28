import { Card, Fade } from '@mui/material';
import React, { useContext } from 'react'
import { WalletContext } from '../contexts/WalletContext';

export default function SelectToken(props) {
    const wallet = useContext(WalletContext);
    const visible = !(Boolean(wallet.selectedToken)) && Boolean(wallet.address);
    console.log(visible);

    return (
        <>
            <Fade in={visible} timeout={1000} style={{ transitionDelay: '1000ms' }} unmountOnExit>
                <Card sx={{ padding: 2 }}>
                    Hello
                </Card>
            </Fade>
        </>
    )
}
