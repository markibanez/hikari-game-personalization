import { Card, CircularProgress, Fade, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react'
import { WalletContext } from '../contexts/WalletContext';

export default function SelectToken(props) {
    const wallet = useContext(WalletContext);
    const { enqueueSnackbar } = useSnackbar();
    const visible = !(Boolean(wallet.selectedToken)) && Boolean(wallet.address);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible) {
            setLoading(true);

            wallet.getNFTs()
                .then(() => {

                })
                .catch(err => {
                    console.log(err);
                    enqueueSnackbar('Could not get your NFTs', { variant: 'error' });
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    }, [visible])

    return (
        <>
            <Fade in={visible} timeout={1000} style={{ transitionDelay: '1000ms' }} unmountOnExit>
                <Card sx={{ padding: 2 }}>
                    {loading &&
                    <>
                        <Typography variant="h5">
                            Getting your Hikari NFTs
                        </Typography>

                        <CircularProgress />
                    </>
                    }

                    {!loading &&
                    <>
                        <Typography variant="h5">
                            Select your Hikari NFT
                        </Typography>
                    </>
                    }
                </Card>
            </Fade>
        </>
    )
}
