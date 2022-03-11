import { Box, Button, Card, CardContent, Fade, Stack, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { WalletContext } from '/contexts/WalletContext';
import { useSnackbar } from 'notistack';

export default function Decision(props) {
    const { state, decision, setState, setDecision, address, token } = props;
    const [processing, setProcessing] = useState(false);
    const [chosenOption, setChosenOption] = useState(1);

    const chooseOption = async (option) => {
        setProcessing(true);
        setChosenOption(option);
    };

    const choiceStyle = {
        width: '100%',
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
    };

    const optBoxStyle = {
        backgroundImage: `url('/choice-ink-stain.png')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '300px',
        height: '150px',
        zIndex: 20,
        alignItems: 'center',
        justifyContent: 'center'
    };

    const optionLinkStyle = {
        display: 'block',
        width: '200px',
        textAlign: 'center',
        '&:hover': {
            color: '#fcffa4'
        },
    };

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    padding: 0,
                    margin: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#000',
                    zIndex: 1,
                }}
            ></Box>
            <Fade in={!processing} timeout={1000} onExited={exitedHandler}>
                <Box
                    sx={{
                        position: 'fixed',
                        padding: 0,
                        margin: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundImage: `url('/art/${decision.art_file}')`,
                        backgroundSize: 'cover',
                        zIndex: 5,
                    }}
                >
                    <Box
                        sx={{
                            position: 'fixed',
                            top: -60,
                            left: 0,
                            width: '70vw',
                            height: '50vh',
                            backgroundImage: `url('/images/ink-stain.png')`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                        }}
                    ></Box>
                    <Box
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 20,
                            maxWidth: '40vw',
                            height: '40vh',
                            alignItems: 'center',
                        }}
                        display="flex"
                    >
                        <Typography variant="h6" color="#FFF" sx={{ marginBottom: 2 }}>
                            {decision.dialogue}
                        </Typography>
                    </Box>

                    <Box sx={{ position: 'fixed', bottom: 0, width: '100%' }}>
                        <Stack direction="row" justifyContent="center" spacing={1}>
                            {decision.option1_id && (
                                <Box sx={optBoxStyle} display="flex" onClick={() => chooseOption(1)}>
                                    <Typography variant="h6" sx={optionLinkStyle} color="#FFF">
                                        {decision.option1_text || 'Continue...'}
                                    </Typography>
                                </Box>
                            )}
                            {decision.option2_id && (
                                <Box sx={optBoxStyle} display="flex" onClick={() => chooseOption(2)}>
                                    <Typography variant="h6" sx={optionLinkStyle} color="#FFF">
                                        {decision.option2_text || 'Continue...'}
                                    </Typography>
                                </Box>
                            )}

                            {decision.option3_id && (
                                <Box sx={optBoxStyle} display="flex" onClick={() => chooseOption(3)}>
                                    <Typography variant="h6" sx={optionLinkStyle} color="#FFF">
                                        {decision.option3_text || 'Continue...'}
                                    </Typography>
                                </Box>
                            )}
                            {decision.option4_id && (
                                <Box sx={optBoxStyle} display="flex" onClick={() => chooseOption(4)}>
                                    <Typography variant="h6" sx={optionLinkStyle} color="#FFF">
                                        {decision.option4_text || 'Continue...'}
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </Box>
                </Box>
            </Fade>
        </>
    );
}
