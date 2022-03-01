import { Avatar, Button, Card, CardMedia, CircularProgress, Fade, Grid, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../contexts/WalletContext';

export default function SelectToken(props) {
    const wallet = useContext(WalletContext);
    const { enqueueSnackbar } = useSnackbar();
    const visible = !Boolean(wallet.selectedToken) && Boolean(wallet.address);
    const [loading, setLoading] = useState(true);
    const hasTokens = wallet.tokens?.length > 0;

    useEffect(() => {
        if (visible) {
            wallet
                .getNFTs()
                .then(() => {})
                .catch((err) => {
                    console.log(err);
                    enqueueSnackbar('Could not get your NFTs', { variant: 'error' });
                });
        }
    }, [visible]);

    const personalizeClicked = (token) => {};

    return (
        <>
            <Fade in={visible} timeout={1000} style={{ transitionDelay: '1000ms' }} unmountOnExit>
                <Card
                    sx={{
                        padding: 2,
                        textAlign: 'center',
                        width: { xs: '80vw', md: '70vw', lg: '60vw', xl: '50vw' },
                        marginTop: 10
                    }}
                >
                    {wallet.gettingTokens && (
                        <>
                            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                                Getting your Hikari NFTs
                            </Typography>

                            <CircularProgress />
                        </>
                    )}

                    {!wallet.gettingTokens && (
                        <>
                            {hasTokens && (
                                <>
                                    <Typography variant="h5" sx={{ marginBottom: 2 }}>
                                        Select your Hikari NFT
                                    </Typography>
                                    <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
                                        {wallet.tokens.map((token, index) => {
                                            return (
                                                <Grid item key={index} xs={12} sm={6} md={3} lg={4} xl={3}>
                                                    <Card variant="outlined">
                                                        <CardMedia
                                                            component="img"
                                                            height={{ xs: '160px', md: '140px' }}
                                                            image={token.image}
                                                            alt={token.name}
                                                        />

                                                        <Stack direction="column" sx={{ padding: 1 }}>
                                                            <Typography variant="body1">{token.name}</Typography>
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                href={`/personalize/${wallet.address}/${token.tokenId}`}
                                                                target="_blank"
                                                                rel="noreferrer noopener"
                                                            >
                                                                Personalize
                                                            </Button>
                                                        </Stack>
                                                    </Card>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </>
                            )}

                            {!hasTokens && (
                                <Typography variant="h5">
                                    You do not have Hikari NFTs. Please acquire at least one to proceed.
                                </Typography>
                            )}
                        </>
                    )}
                </Card>
            </Fade>
        </>
    );
}
