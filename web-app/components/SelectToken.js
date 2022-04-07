import {
    Avatar,
    Box,
    Button,
    Card,
    CardMedia,
    CircularProgress,
    Fade,
    Grid,
    Slide,
    Stack,
    Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import Link from 'next/link';

export default function SelectToken(props) {
    const wallet = useContext(WalletContext);
    const { enqueueSnackbar } = useSnackbar();
    const hasTokens = wallet.tokens?.length > 0;

    return (
        <>
            <Fade in={hasTokens} timeout={1000} style={{ transitionDelay: '1000ms' }} unmountOnExit>
                <Box
                    sx={{
                        width: '60%',
                        height: '30%',
                        textAlign: 'center',
                        backgroundImage: `url("/images/branded-modal.png")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        padding: '8%',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -55%)`,
                        // marginTop: '200px',
                    }}
                >
                    {hasTokens && (
                        <>
                            <Typography
                                variant="h4"
                                sx={{
                                    marginBottom: 2,
                                    fontFamily: 'DK-DDG',
                                    color: '#AEAD8F',
                                    textShadow: '2px 2px #413D31',
                                    fontSize: '4vmin'
                                }}
                            >
                                Your souls
                            </Typography>
                            <Stack
                                className="masked-overflow"
                                direction="row"
                                spacing={8}
                                sx={{
                                    width: '65%',
                                    height: '115%',
                                    // border: '1px solid black',
                                    marginX: 'auto',
                                    overflowX: 'auto',
                                    overflowY: 'hidden',
                                    paddingX: 5
                                }}
                            >
                                {wallet.tokens.map((token, index) => {
                                    return (
                                        <Grid item key={index} xs={12} md={4}>
                                            <Stack direction="column" sx={{ padding: 0, height: '100%' }} alignItems="center">
                                                <video
                                                    className="soul-video"
                                                    src="https://storage.googleapis.com/hikari-genu/soul.mp4"
                                                    autoPlay
                                                    loop
                                                />
                                                <Typography
                                                    variant="h5"
                                                    sx={{
                                                        fontFamily: 'DK-DDG',
                                                        marginTop: 2,
                                                        color: '#302C21',
                                                        alignSelf: 'center',
                                                        fontSize: '2.5vmin'
                                                    }}
                                                >
                                                    Soul #{token.tokenId.toString()}
                                                </Typography>
                                                <Link href={`/personalize/${wallet.address}/${token.tokenId}`}>
                                                    <img src="/images/enter-genu-button.png" style={{ width: '120%', alignSelf: 'center' }} />
                                                </Link>
                                            </Stack>
                                        </Grid>
                                    );
                                })}
                            </Stack>
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
