import { Backdrop, Box, Button, Card, CardContent, Fade, Stack, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { WalletContext } from '/contexts/WalletContext';
import { useSnackbar } from 'notistack';

export default function Decision(props) {
    const { state, decision, setState, setDecision, address, token } = props; console.log(state, decision);
    const [processing, setProcessing] = useState(false);
    const [chosenOption, setChosenOption] = useState(1);
    const [randomDismissed, setRandomDismissed] = useState(false);
    const [manaDismissed, setManaDismissed] = useState(false);

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
                console.log(result);
                setState(result.state);
                setDecision(result.decision);
                setRandomDismissed(false);
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
        backgroundImage: `url('/images/option-bg4.png')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '300px',
        height: '120px',
        zIndex: 20,
        alignItems: 'center',
        justifyContent: 'left'
    };

    const optionLinkStyle = {
        display: 'block',
        width: '180px',
        textAlign: 'left',
        paddingLeft: 4,
        fontSize: '12pt',
        '&:hover': {
            color: '#fcffa4'
        },
    };

    const manaBoxStyle = {
        backgroundImage: `url('/images/mana-counter.png')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right top',
        width: '190px',
        height: '190px',
        zIndex: 20,
        // textAlign: 'center',
        // paddingTop: '10px',
        // paddingRight: '30px'
    }


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
                        backgroundImage: `url('https://storage.googleapis.com/hikari-genu/art/${decision.id}.png')`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        zIndex: 5,
                        filter: Boolean(state?.isRandom && !randomDismissed) || Boolean(!state.isRandom && state.randomEffects?.mana && !manaDismissed) ? `blur(8px)` : 'initial'
                    }}
                >
                    {/* <Box
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
                    </Box> */}

                    <Box sx={{ position: 'fixed', bottom: 0, width: '100%' }}>
                        <Stack direction="row" justifyContent="center" spacing={15}>
                            {decision.option1_id && (
                                <Box sx={{cursor: decision.option1_id?.indexOf(',') > -1 ? `url('/dice.cur'), auto` : 'inherit', ...optBoxStyle}} display="flex" onClick={() => chooseOption(1)}>
                                    <Typography variant="h6" sx={optionLinkStyle} color="#FFF">
                                        {decision.option1_text || 'Continue...'}
                                    </Typography>
                                </Box>
                            )}
                            {decision.option2_id && (
                                <Box sx={{cursor: decision.option2_id?.indexOf(',') > -1 ? `url('/dice.cur'), auto` : 'inherit', ...optBoxStyle}} display="flex" onClick={() => chooseOption(2)}>
                                    <Typography variant="h6" sx={optionLinkStyle} color="#FFF">
                                        {decision.option2_text || 'Continue...'}
                                    </Typography>
                                </Box>
                            )}

                            {decision.option3_id && (
                                <Box sx={{cursor: decision.option3_id?.indexOf(',') > -1 ? `url('/dice.cur'), auto` : 'inherit', ...optBoxStyle}} display="flex" onClick={() => chooseOption(3)}>
                                    <Typography variant="h6" sx={optionLinkStyle} color="#FFF">
                                        {decision.option3_text || 'Continue...'}
                                    </Typography>
                                </Box>
                            )}
                            {decision.option4_id && (
                                <Box sx={{cursor: decision.option4_id?.indexOf(',') > -1 ? `url('/dice.cur'), auto` : 'inherit', ...optBoxStyle}} display="flex" onClick={() => chooseOption(4)}>
                                    <Typography variant="h6" sx={optionLinkStyle} color="#FFF">
                                        {decision.option4_text || 'Continue...'}
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </Box>

                    <Box sx={{ position: 'fixed', top: -20, right: -20 }}>
                        <Box sx={manaBoxStyle}>
                            <Typography variant="h4" sx={{ fontFamily: 'DK-DDG', position: 'absolute', left: '120px', top: '36px' }} color="#AEAD8F">
                                {state.mana}
                            </Typography>
                        </Box>
                    </Box>

                </Box>

            </Fade>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={Boolean(state.isRandom && !randomDismissed)}
                onClick={() => { setRandomDismissed(true) }}
            >
                <Stack direction="column" justifyContent="center" alignItems="center">
                    {state.randomSuccess &&
                    <img src="/images/random-success.png" />
                    }

                    {!state.randomSuccess &&
                    <img src="/images/random-fail.png" />
                    }

                    {state.randomEffects?.mana !== undefined &&
                        <Box textAlign="center" sx={{ width: '300px', backgroundImage: `url('/images/mana-result.png')`, backgroundSize: 'contain' }}>
                            <h1>{`${state.randomEffects.mana >= 0 ? '+' : ''}${state.randomEffects.mana} Mana`}</h1>
                        </Box>
                    }

                    <br /><br />

                    <img src="/images/back-button.png" onClick={() => { setRandomDismissed(true) }} style={{ width: '200px' }} />

                </Stack>

            </Backdrop>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={Boolean(!state.isRandom && state.randomEffects?.mana && !manaDismissed)}
                onClick={() => { setManaDismissed(true) }}
            >
                <Stack direction="column" justifyContent="center" alignItems="center">
                    {state.randomEffects?.mana >= 0 &&
                    <img src="/images/mana-gained.png" />
                    }

                    {!state.randomEffects?.mana < 0 &&
                    <img src="/images/mana-lost.png" />
                    }

                    {state.randomEffects?.mana !== undefined &&
                        <Box textAlign="center" sx={{ width: '300px', backgroundImage: `url('/images/mana-result.png')`, backgroundSize: 'contain' }}>
                            <h1>{`${state.randomEffects.mana >= 0 ? '+' : ''}${state.randomEffects.mana} Mana`}</h1>
                        </Box>
                    }

                    <br /><br />

                    <img src="/images/back-button.png" onClick={() => { setManaDismissed(true) }} style={{ width: '200px' }} />

                </Stack>
            </Backdrop>
        </>
    );
}
