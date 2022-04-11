import { WalletContext } from '/contexts/WalletContext';
import WalletInfo from '/components/WalletInfo';
import styles from '/styles/Home.module.css';
import { useRouter } from 'next/router';
import { constants, ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import { Backdrop, Box, Card, CardContent, CircularProgress, Fade } from '@mui/material';
import Start from '../../../components/Start';
import Decision from '../../../components/Decision';
import Intro from '../../../components/Intro';

export default function Token() {
    const wallet = useContext(WalletContext);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { address, token } = router.query;
    const [loading, setLoading] = useState(true);
    const [ownsToken, setOwnsToken] = useState(false);
    const [state, setState] = useState({});
    const [decision, setDecision] = useState({});
    const [introDone, setIntroDone] = useState(false);
    const [manaRanking, setManaRanking] = useState(null);

    const validAddress = ethers.utils.isAddress(address);
    const csAddress = validAddress ? ethers.utils.getAddress(address) : null;

    const tokenId = parseInt(token);

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            if (router.isReady && wallet.address && wallet.ethersProvider && address && !isNaN(tokenId)) {
                try {
                    const owner = await wallet.getNFTOwner(tokenId);
                    setOwnsToken(owner === wallet.address);

                    if (owner !== wallet.address) {
                        enqueueSnackbar('You do not own this NFT pass', { variant: 'error', autoHideDuration: 20000 });
                        return;
                    }

                    const response = await fetch(`/api/get-state?address=${address}&token=${tokenId}`);
                    if (response.status === 200) {
                        const result = await response.json();
                        setState(result.state);
                        setDecision(result.decision);
                        if (result.manaRanking?.length > 0) setManaRanking(result.manaRanking[0]);
                    }
                } catch (err) {
                    enqueueSnackbar('Could not load state', { variant: 'error' });
                    router.push('/');
                    console.log(err);
                } finally {
                    setLoading(false);
                }
            }

            // cache first intro image
            const img = new Image();
            img.src = 'https://storage.googleapis.com/hikari-genu/intro/1.png';
        };

        load();
    }, [router, address, tokenId, wallet]);

    useEffect(() => {
        if (router.isReady) {
            if (!validAddress) enqueueSnackbar('Invalid address', { variant: 'error', persist: true });
            if (isNaN(tokenId)) enqueueSnackbar('Invalid token id', { variant: 'error', persist: true });
        }
    }, [router, validAddress, tokenId]);

    useEffect(() => {
        wallet.getNFT(tokenId).then((token) => {
            console.log(token);
        }).catch(() => { router.push('/') });
    }, []);

    return (
        <div className={styles.container} style={{ overflow: 'hidden' }}>
            <main className={styles.main}>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                {/* <WalletInfo /> */}

                <Fade
                    in={!loading && address && !isNaN(tokenId) && !state?.signed}
                    mountOnEnter
                    timeout={1000}
                    style={{ transitionDelay: `500ms` }}
                >
                    <Box>
                        <Start setState={setState} setDecision={setDecision} address={address} token={token} />
                    </Box>
                </Fade>

                {!loading && state.signed && decision?.id === 1 && !introDone && (
                    <Box
                        sx={{
                            padding: 0,
                            margin: 0,
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            zIndex: 0,
                            backgroundColor: '#24231d',
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        <Intro setIntroDone={setIntroDone} />
                    </Box>
                )}

                <Fade
                    in={!loading && state.signed && decision && (introDone || state.currentDecision > 1)}
                    mountOnEnter
                    timeout={1000}
                    style={{ transitionDelay: `500ms` }}
                >
                    <Box sx={{ padding: 0, margin: 0, position: 'fixed', left: 0, top: 0, zIndex: 0 }}>
                        <Decision
                            state={state}
                            decision={decision}
                            setState={setState}
                            setDecision={setDecision}
                            manaRanking={manaRanking}
                            setManaRanking={setManaRanking}
                            address={address}
                            token={token}
                        />
                    </Box>
                </Fade>

                {validAddress && !isNaN(tokenId) && <></>}
            </main>
        </div>
    );
}
