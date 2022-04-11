import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useContext, useState } from 'react';
import { WalletContext } from '/contexts/WalletContext';
import { useSnackbar } from 'notistack';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Start(props) {
    const { setState, setDecision, address, token } = props;
    const wallet = useContext(WalletContext);
    const [verifying, setVerifying] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const router = useRouter();

    const sign = async () => {
        setVerifying(true);

        try {
            const { ethersSigner } = wallet;
            const signature = await ethersSigner.signMessage('update-state');

            const response = await fetch(`/api/update-state?address=${address}&token=${token}&signature=${signature}`);
            if (response.status === 200) {
                const result = await response.json();
                console.log(result);
                setState(result.state);
                setDecision(result.decision);
            } else {
                enqueueSnackbar('Something went wrong', { variant: 'error' });
            }
        } catch (err) {
            enqueueSnackbar('Something went wrong', { variant: 'error' });
            console.log(err);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '22%',
                    left: '50%',
                    transform: `translate(-50%, -55%)`,
                    // backgroundImage: '/images/back-to-home.png',
                    // backgroundSize: 'contain',
                    // backgroundRepeat: 'no-repeat',
                    // backgroundPosition: 'center',
                    // width: '10vmin',
                    // height: '5%'
                }}
                onClick={() => router.back()}
            >
                <img src="/images/back-to-home.png" />
                {/* <Typography variant="h5" sx={{ padding: '15px 25px', fontWeight: 700, color: '#302C21' }}>
                    Back to Home
                </Typography> */}
            </Box>
            <Box
                sx={{
                    width: '43%',
                    height: '43%',
                    textAlign: 'center',
                    backgroundImage: `url("/images/branded-modal-2.png")`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    // paddingTop: '180px',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -65%)`,
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontFamily: 'DK-DDG',
                        color: '#AEAD8F',
                        marginTop: '16vmin',
                        fontSize: '3vmin',
                        textShadow: '2px 2px #413D31',
                    }}
                >
                    SIGN TRANSACTION
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        paddingX: '20%',
                        fontSize: '20pt',
                        color: '#302C21',
                        marginTop: 2,
                        fontSize: '2.25vmin',
                        fontFamily: 'Charter',
                    }}
                >
                    You must approve a state change in your wallet to begin the Gen-U experience with this soul.
                </Typography>
                <br />
                <img src="/images/sign-button.png" style={{ width: '20%', marginTop: '0' }} onClick={sign} />
            </Box>
            {/* <Card>
                <CardContent>
                    <Stack direction="column">
                        <Typography variant="h5">Personalization Start</Typography>
                        <Typography variant="body1">We need to verify your wallet with your signature</Typography>

                        <LoadingButton variant="contained" sx={{ marginTop: 5 }} onClick={sign} loading={verifying}>
                            Sign and continue
                        </LoadingButton>
                    </Stack>
                </CardContent>
            </Card> */}
        </>
    );
}
