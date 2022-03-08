import { Box, Button, Card, CardContent, Fade, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useContext, useState } from 'react';
import { WalletContext } from '/contexts/WalletContext';
import { useSnackbar } from 'notistack';

export default function Decision(props) {
    const { state, decision, setState, setDecision, address, token } = props;
    const wallet = useContext(WalletContext);
    const [processing, setProcessing] = useState(false);
    const [chosenOption, setChosenOption] = useState(1);
    const { enqueueSnackbar } = useSnackbar();

    const chooseOption = async (option) => {
        setProcessing(true);
        setChosenOption(option);
    };

    const exitedHandler = async () => {
        try {
            const response = await fetch(`/api/update-state?address=${address}&token=${token}&option=${chosenOption}`);
            if (response.status === 200) {
                const result = await response.json();
                setState(result.state);
                setDecision(result.decision);
            } else {
                console.log(response);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setProcessing(false);
        }
    }

    return (
        <>
            <Fade
                in={!processing}
                timeout={1000}
                onExited={exitedHandler}
            >
                <Box
                    sx={{
                        padding: 0,
                        margin: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundImage: `url('/art/${decision.art_file}')`,
                        backgroundSize: 'cover',
                    }}
                >
                    <Box
                        sx={{
                            position: 'fixed',
                            top: -60,
                            left: 0,
                            width: '60vw',
                            height: '40vh',
                            backgroundImage: `url('/images/ink-stain.png')`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                        }}
                    ></Box>
                    <Box sx={{ position: 'fixed', top: 20, left: 20, maxWidth: '40vw' }}>
                        <Typography variant="body1" color="#FFF" sx={{ marginBottom: 2 }}>
                            {decision.dialogue}
                        </Typography>

                        {decision.option1_id && (
                            <a href="javascript:void(0)" onClick={() => chooseOption(1)}>
                                <Typography variant="body2" color="#FFF">
                                    {decision.option1_text || 'Continue...'}
                                </Typography>
                            </a>
                        )}
                        {decision.option2_id && (
                            <a href="javascript:void(0)" onClick={() => chooseOption(1)}>
                                <Typography variant="body2" color="#FFF">
                                    {decision.option2_text || 'Continue...'}
                                </Typography>
                            </a>
                        )}
                        {decision.option3_id && (
                            <a href="javascript:void(0)" onClick={() => chooseOption(1)}>
                                <Typography variant="body2" color="#FFF">
                                    {decision.option3_text || 'Continue...'}
                                </Typography>
                            </a>
                        )}
                        {decision.option4_id && (
                            <a href="javascript:void(0)" onClick={() => chooseOption(1)}>
                                <Typography variant="body2" color="#FFF">
                                    {decision.option4_text || 'Continue...'}
                                </Typography>
                            </a>
                        )}
                    </Box>
                </Box>
            </Fade>
        </>
    );
}
