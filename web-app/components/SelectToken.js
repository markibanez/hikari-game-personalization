import { Avatar, Box, Button, Card, CardMedia, CircularProgress, Fade, Grid, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import Link from 'next/link'

export default function SelectToken(props) {
    const wallet = useContext(WalletContext);
    const { enqueueSnackbar } = useSnackbar();
    const hasTokens = wallet.tokens?.length > 0;
    console.log(wallet.tokens, 'wallet.tokens');

    return (
        <>
            <Fade in={hasTokens} timeout={1000} style={{ transitionDelay: '1000ms' }} unmountOnExit>
                <Box
                    sx={{
                        width: '1500px',
                        height: '900px',
                        textAlign: 'center',
                        backgroundImage: `url("/images/plain-modal.png")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        paddingY: '50px',
                        marginTop: '150px'
                    }}
                >
                    {hasTokens && (
                        <>
                            <Typography variant="h2" sx={{ marginY: 5, fontFamily: 'DK-DDG', color: '#AEAD8F' }}>
                                Select a soul to personalize
                            </Typography>
                            <Grid container spacing={{ xs: 1, md: 1 }} justifyContent="left" sx={{ paddingX: 10 }}>
                                {wallet.tokens.map((token, index) => {
                                    return (
                                        <Grid item key={index} xs={12} sm={6} md={3}>
                                            <Stack direction="column" sx={{ padding: 1 }}>
                                                <video src="/art/soul.mp4" style={{ height: 150 }} autoPlay loop />
                                                <Typography variant="h5" sx={{ fontFamily: 'DK-DDG', marginY: 1, color: '#302C21' }}>Soul No. {token.tokenId.toString()}</Typography>
                                                <Link href={`/personalize/${wallet.address}/${token.tokenId}`}>
                                                    <img src="/images/personalize-button.png" style={{ cursor: 'pointer' }} />
                                                </Link>
                                            </Stack>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </>
                    )}
                </Box>

                {/* <Card
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
                                                            <Link href={`/personalize/${wallet.address}/${token.tokenId}`}>
                                                                <Button
                                                                    variant="outlined"
                                                                    color="primary"
                                                                >
                                                                    Personalize
                                                                </Button>
                                                            </Link>
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
                </Card> */}
            </Fade>
        </>
    );
}
