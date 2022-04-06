import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useContext, useState } from 'react';
import { WalletContext } from '/contexts/WalletContext';
import { useSnackbar } from 'notistack';

export default function Start(props) {
    const { setState, setDecision, address, token } = props;
    const wallet = useContext(WalletContext);
    const [verifying, setVerifying] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const sign = async () => {
        setVerifying(true);

        try {
            const { ethersSigner } = wallet;
            const signature = await ethersSigner.signMessage('update-state');

            const response = await fetch(`/api/update-state?address=${address}&token=${token}&signature=${signature}`);
            if (response.status === 200) {
                const result = await response.json(); console.log(result);
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
                        width: '800px',
                        height: '600px',
                        textAlign: 'center',
                        backgroundImage: `url("/images/branded-modal-2.png")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        paddingTop: '220px',
                        marginTop: '140px'
                    }}
                >

                    <Typography variant="h3" sx={{ fontFamily: 'DK-DDG', color: '#AEAD8F', marginTop: '10px' }}>
                        SIGN TRANSACTION
                    </Typography>
                    <Typography variant="h4" sx={{ paddingX: 10, fontSize: '20pt', color: '#302C21', marginTop: 2 }}>
                        You must approve a state change in your wallet to begin the Gen-U experience with this soul.
                    </Typography>
                    <br/>
                    <img
                        src="/images/sign-button.png"
                        style={{ width: 300, marginTop: 10 }}
                        onClick={sign}
                    />
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
