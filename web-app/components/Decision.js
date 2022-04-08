import { Backdrop, Box, Button, Card, CardContent, Fade, Slide, Stack, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { WalletContext } from '/contexts/WalletContext';
import { useSnackbar } from 'notistack';
import uuid from 'react-uuid';
import achievements from './../data/achievements.json';

export default function Decision(props) {
    const { state, decision, setState, setDecision, address, token } = props;
    const [processing, setProcessing] = useState(false);
    const [chosenOption, setChosenOption] = useState(1);
    const [randomDismissed, setRandomDismissed] = useState(false);
    const [manaDismissed, setManaDismissed] = useState(false);
    const [showNewAch, setShowNewAch] = useState(false);
    const [achievement, setAchievement] = useState({})

    const clickAudio = new Audio('/audio/click.wav');
    clickAudio.volume = 0.75;
    const hoverAudio = new Audio('/audio/hover.wav');
    hoverAudio.volume = 0.1;
    const randomSuccessAudio = new Audio('/audio/random-success.wav');
    const randomFailAudio = new Audio('/audio/random-fail.wav');

    const chooseOption = async (option) => {
        clickAudio.play();
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

                if (result.state.isRandom) {
                    if (result.state.randomSuccess) {
                        console.log('play random success');
                        randomSuccessAudio.play();
                    } else {
                        console.log('play random success');
                        randomFailAudio.play();
                    }
                } else {
                    if (result.state.randomEffects?.mana > 0) {
                        randomSuccessAudio.play();
                    } else if (result.state.randomEffects?.mana <= 0) {
                        randomFailAudio.play();
                    }
                }

                if (result.state.newAchievement) {
                    console.log(achievements);
                    const found = achievements.find(a => a.Code === result.state.newAchievement);
                    console.log(found);
                    if (found) {
                        setAchievement(found);
                        setTimeout(() => {
                            setShowNewAch(true);
                            setTimeout(() => {
                                setShowNewAch(false);
                            }, 7000)
                        }, 2000)
                    }
                }

                setState(result.state);
                setDecision(result.decision);
                setRandomDismissed(false);
                setManaDismissed(false);
                onImageLoaded(`https://storage.googleapis.com/hikari-genu/art/${result.decision.id}.png`);
            } else {
                console.log(response);
            }
        } catch (err) {
            console.log(err);
        }
        // finally {
        //     setProcessing(false);
        // }
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
        justifyContent: 'left',
        '&:hover': {
            color: '#fcffa4',
        },
    };

    const optionLinkStyle = {
        display: 'block',
        width: '180px',
        textAlign: 'left',
        paddingLeft: 4,
        fontSize: '12pt',
        '&:hover': {
            color: '#fcffa4',
        },
    };

    const manaBoxStyle = {
        backgroundImage: `url('/images/mana-bg.png')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right top',
        width: '190px',
        height: '190px',
        zIndex: 20,
        // textAlign: 'center',
        // paddingTop: '10px',
        // paddingRight: '30px'
    };

    const onImageLoaded = (url) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            setProcessing(false);
            console.log(`${url} loaded`);
        };
    };

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    padding: 0,
                    margin: 0,
                    width: '100%',
                    height: '100%',
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
                        width: '100%',
                        height: '100%',
                        aspectRatio: '16 / 9',
                        backgroundImage: `url('https://storage.googleapis.com/hikari-genu/art/${decision.id}.png')`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        zIndex: 5,
                        filter:
                            Boolean(state?.isRandom && !randomDismissed) ||
                            Boolean(!state.isRandom && state.randomEffects?.mana && !manaDismissed)
                                ? `blur(8px)`
                                : 'initial',
                    }}
                >
                    <Box sx={{ position: 'fixed', bottom: 0, width: '100%' }}>
                        <Stack direction="row" justifyContent="center" spacing={15}>
                            {decision.option1_id && (
                                <Box
                                    sx={{
                                        cursor:
                                            decision.option1_id?.indexOf(',') > -1
                                                ? `url('/dice.cur'), auto`
                                                : 'inherit',
                                        ...optBoxStyle,
                                    }}
                                    display="flex"
                                    onClick={() => chooseOption(1)}
                                    onMouseEnter={() => hoverAudio.play()}
                                >
                                    <Typography variant="h6" sx={optionLinkStyle} color="#FFF">
                                        {decision.option1_text || 'Continue...'}
                                    </Typography>
                                </Box>
                            )}
                            {decision.option2_id && (
                                <Box
                                    sx={{
                                        cursor:
                                            decision.option2_id?.indexOf(',') > -1
                                                ? `url('/dice.cur'), auto`
                                                : 'inherit',
                                        ...optBoxStyle,
                                    }}
                                    display="flex"
                                    onClick={() => chooseOption(2)}
                                    onMouseEnter={() => hoverAudio.play()}
                                >
                                    <Typography variant="h6" sx={optionLinkStyle} color="#FFF">
                                        {decision.option2_text || 'Continue...'}
                                    </Typography>
                                </Box>
                            )}

                            {decision.option3_id && (
                                <Box
                                    sx={{
                                        cursor:
                                            decision.option3_id?.indexOf(',') > -1
                                                ? `url('/dice.cur'), auto`
                                                : 'inherit',
                                        ...optBoxStyle,
                                    }}
                                    display="flex"
                                    onClick={() => chooseOption(3)}
                                    onMouseEnter={() => hoverAudio.play()}
                                >
                                    <Typography variant="h6" sx={optionLinkStyle} color="#FFF">
                                        {decision.option3_text || 'Continue...'}
                                    </Typography>
                                </Box>
                            )}
                            {decision.option4_id && (
                                <Box
                                    sx={{
                                        cursor:
                                            decision.option4_id?.indexOf(',') > -1
                                                ? `url('/dice.cur'), auto`
                                                : 'inherit',
                                        ...optBoxStyle,
                                    }}
                                    display="flex"
                                    onClick={() => chooseOption(4)}
                                    onMouseEnter={() => hoverAudio.play()}
                                >
                                    <Typography variant="h6" sx={optionLinkStyle} color="#FFF">
                                        {decision.option4_text || 'Continue...'}
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </Box>

                    <Box sx={{ position: 'fixed', top: -20, right: -20 }}>
                        <Box sx={manaBoxStyle}>
                            <img
                                src="/images/mana-bottle.png"
                                style={{ height: '30%', position: 'absolute', top: '30px', left: '70px' }}
                            />
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: 'DK-DDG',
                                    position: 'absolute',
                                    left: '120px',
                                    top: '36px',
                                    textShadow: '2px 2px #413D31',
                                }}
                                color="#AEAD8F"
                            >
                                {state.mana}
                            </Typography>
                        </Box>
                    </Box>

                    <Slide in={showNewAch} direction="left">
                        <Box
                            sx={{
                                width: '20%',
                                height: '20%',
                                position: 'absolute',
                                right: 0,
                                top: '22%',
                                backgroundImage: `url('/images/achievement-bg.png')`,
                                backgroundPosition: 'right',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                zIndex: (theme) => theme.zIndex.drawer + 1,
                                display: 'flex',
                                justifyContent: 'left',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src="/images/sewer-rat.png"
                                style={{ width: '25%', paddingLeft: '15%', paddingBottom: '5%' }}
                            />
                            <Typography
                                variant="h3"
                                sx={{
                                    paddingLeft: '3%',
                                    paddingBottom: '7%',
                                    color: '#A49A81',
                                    maxWidth: '40%',
                                    textAlign: 'center',
                                    fontSize: '3.6vmin',
                                    fontFamily: 'DK-DDG',
                                    textShadow: '4px 4px rgba(0, 0, 0, 0.25)'
                                }}
                            >
                                {achievement.Name}
                            </Typography>
                        </Box>
                    </Slide>

                </Box>
            </Fade>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={Boolean(state.isRandom && !randomDismissed)}
                // onClick={() => { setRandomDismissed(true) }}
            >
                <Stack direction="column" justifyContent="center" alignItems="center">
                    {state.randomSuccess && <img src="/images/random-success.png" />}

                    {!state.randomSuccess && <img src="/images/random-fail.png" />}

                    {state.randomEffects?.mana !== undefined && (
                        <Box
                            textAlign="center"
                            sx={{
                                width: '300px',
                                backgroundImage: `url('/images/mana-result.png')`,
                                backgroundSize: 'contain',
                            }}
                        >
                            <h1>{`${state.randomEffects.mana >= 0 ? '+' : ''}${state.randomEffects.mana} Mana`}</h1>
                        </Box>
                    )}

                    <br />
                    <br />

                    <img
                        src="/images/close-button.png"
                        onClick={() => {
                            setRandomDismissed(true);
                            clickAudio.play();
                        }}
                        onMouseEnter={() => {
                            hoverAudio.play();
                        }}
                        style={{ width: '200px' }}
                    />
                </Stack>
            </Backdrop>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={Boolean(!state.isRandom && state.randomEffects?.mana && !manaDismissed)}
                // onClick={() => { setManaDismissed(true) }}
            >
                <Stack direction="column" justifyContent="center" alignItems="center">
                    {state.randomEffects?.mana >= 0 && <img src="/images/mana-gained.png" />}

                    {state.randomEffects?.mana < 0 && <img src="/images/mana-lost.png" />}

                    {state.randomEffects?.mana !== undefined && (
                        <Box
                            textAlign="center"
                            sx={{
                                width: '300px',
                                backgroundImage: `url('/images/mana-result.png')`,
                                backgroundSize: 'contain',
                            }}
                        >
                            <h1>{`${state.randomEffects.mana >= 0 ? '+' : ''}${state.randomEffects.mana} Mana`}</h1>
                        </Box>
                    )}

                    <br />
                    <br />

                    <img
                        src="/images/close-button.png"
                        onClick={() => {
                            setManaDismissed(true);
                            clickAudio.play();
                        }}
                        onMouseEnter={() => {
                            hoverAudio.play();
                        }}
                        style={{ width: '200px' }}
                    />
                </Stack>
            </Backdrop>
        </>
    );
}
