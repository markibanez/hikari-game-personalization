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
    const [currentGroup, setCurrentGroup] = useState(0);

    let grouping = [];
    const grouped = [];
    for (let i = 0; i < wallet.tokens.length; i++) {
        if (grouping.length < 3) {
            grouping.push(wallet.tokens[i]);

            if (i === wallet.tokens.length - 1) grouped.push(grouping);
        } else {
            grouped.push(grouping);
            grouping = [wallet.tokens[i]];
        }
    }

    const nextGroup = () => {
        console.log(currentGroup);
        if (currentGroup < grouped.length - 1) {
            const targetGroup = currentGroup + 1;
            setCurrentGroup(-1);
            console.log(targetGroup);
            setTimeout(() => {
                setCurrentGroup(targetGroup);
            }, 500)
        }
    }

    const prevGroup = () => {
        console.log(currentGroup)
        if (currentGroup >= 1) {
            const targetGroup = currentGroup - 1;
            setCurrentGroup(-1);

            setTimeout(() => {
                setCurrentGroup(targetGroup);
            }, 500)
        }

    }

    return (
        <>
            <Fade in={hasTokens} timeout={1000} style={{ transitionDelay: '1000ms' }} unmountOnExit>
                <Box
                    sx={{
                        width: '1200px',
                        height: '800px',
                        textAlign: 'center',
                        backgroundImage: `url("/images/branded-modal.png")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        padding: '60px',
                        // marginTop: '200px',
                    }}
                >
                    {hasTokens && (
                        <>
                            <Typography variant="h4" sx={{ marginTop: 20, marginBottom: 2, fontFamily: 'DK-DDG', color: '#AEAD8F' }}>
                                Your souls
                            </Typography>
                            <Grid container spacing={0} justifyContent="center">
                                <Grid item xs={1} onClick={prevGroup}>
                                    <img src="/images/prev.png" style={{ height: 95, marginTop: 110, zIndex: 1000 }} />
                                </Grid>

                                <Grid item xs={10}>
                                    {grouped.map((tokens, gindex) => {
                                        return (
                                            <Fade in={gindex === currentGroup} key={gindex} timeout={500} unmountOnExit >
                                                <Grid
                                                    container
                                                    spacing={{ xs: 18 }}
                                                    justifyContent="left"
                                                    sx={{ paddingX: 10 }}
                                                >
                                                    {tokens.map((token, index) => {
                                                        return (
                                                            <Grid item key={index} xs={12} md={4}>
                                                                <Stack
                                                                    direction="column"
                                                                    sx={{ padding: 1 }}
                                                                    alignItems="center"
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            backgroundImage: `url('/images/border-normal.png')`,
                                                                            backgroundSize: 'contain',
                                                                            backgroundRepeat: 'no-repeat',
                                                                            paddingTop: '7px',
                                                                            height: '280px',
                                                                            width: '280px',
                                                                            '&:hover': {
                                                                                backgroundImage: `url('/images/border-hover.png')`,
                                                                            },
                                                                        }}
                                                                    >
                                                                        <video
                                                                            src="https://storage.googleapis.com/hikari-genu/soul.mp4"
                                                                            style={{ height: '95%' }}
                                                                            autoPlay
                                                                            loop
                                                                        />
                                                                    </Box>
                                                                    <Typography
                                                                        variant="h4"
                                                                        sx={{
                                                                            fontFamily: 'DK-DDG',
                                                                            marginY: 1,
                                                                            color: '#302C21',
                                                                        }}
                                                                    >
                                                                        Soul #{token.tokenId.toString()}
                                                                    </Typography>
                                                                    <Link
                                                                        href={`/personalize/${wallet.address}/${token.tokenId}`}
                                                                    >
                                                                        <img src="/images/enter-genu-button.png" />
                                                                    </Link>
                                                                </Stack>
                                                            </Grid>
                                                        );
                                                    })}
                                                </Grid>
                                            </Fade>
                                        );
                                    })}
                                </Grid>

                                <Grid item xs={1} onClick={nextGroup}>
                                    <img src="/images/next.png" style={{ height: 95, marginTop: 110, zIndex: 100 }} />
                                </Grid>
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
