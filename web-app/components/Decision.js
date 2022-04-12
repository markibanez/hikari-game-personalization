import { Backdrop, Box, Button, Card, CardContent, Fade, Grid, Slide, Stack, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { WalletContext } from '/contexts/WalletContext';
import { useSnackbar } from 'notistack';
import uuid from 'react-uuid';
import achievements from './../data/achievements.json';
import slideAudioData from './../data/audio.json';
import musicData from './../data/music.json';

export default function Decision(props) {
    const { state, decision, setState, setDecision, manaRanking, setManaRanking, address, token } = props;
    const [processing, setProcessing] = useState(false);
    const [chosenOption, setChosenOption] = useState(1);
    const [randomDismissed, setRandomDismissed] = useState(false);
    const [manaDismissed, setManaDismissed] = useState(false);
    const [showNewAch, setShowNewAch] = useState(false);
    const [achievement, setAchievement] = useState({});
    const [currentAudio, setCurrentAudio] = useState(null);
    const [currentMusic, setCurrentMusic] = useState(null);
    const [currentMusicAudio, setCurrentMusicAudio] = useState(null);
    const [currentMusicFile, setCurrentMusicFile] = useState(null);
    const [art, setArt] = useState(null);
    const [dataSubmitted, setDataSubmitted] = useState(false);

    const wallet = useContext(WalletContext);
    const { enqueueSnackbar } = useSnackbar();

    const clickAudio = new Audio('/audio/click.wav');
    clickAudio.volume = 0.75;
    const hoverAudio = new Audio('/audio/hover.wav');
    hoverAudio.volume = 0.1;
    const randomSuccessAudio = new Audio('/audio/random-success.mp3');
    const randomFailAudio = new Audio('/audio/random-fail.mp3');

    const chooseOption = async (option) => {
        clickAudio.play();
        setProcessing(true);
        setChosenOption(option);
    };

    const choiceStyle = {
        width: '100%',
    };

    const { story_effects } = decision;
    // achievement
    useEffect(() => {
        if (story_effects) {
            const found = achievements.find((a) => a.Code === story_effects);
            if (found) {
                setAchievement(found);
                setTimeout(() => {
                    setShowNewAch(true);
                }, 1000);
            }
        }
    }, [story_effects]);

    // music
    const audioData = slideAudioData.find((d) => d.id === state.currentDecision);
    const musicName = audioData?.bg_music;
    useEffect(() => {
        if (musicName) {
            const music = musicData[musicName];
            if (music?.length > 0) {
                setCurrentMusic(audioData.bg_music);
                const musicAudio = new Audio(`/audio/music/${music[0]}`);
                if (currentMusicAudio) fadeCurrentMusicAudio(music[0]);
                else setCurrentMusicFile(music[0]);
            }
        }
    }, [musicName]);

    useEffect(() => {
        const musicAudio = new Audio(`/audio/music/${currentMusicFile}`);
        musicAudio.volume = 0.075;
        musicAudio.onended = (e) => {
            let index = musicData[musicName].findIndex((m) => m === currentMusicFile);
            if (index > -1) {
                if (index + 1 === musicData[musicName].length) index = 0;
                else index++;
                setCurrentMusicFile(musicData[musicName][index]);
            }
        };
        musicAudio.play();
        setCurrentMusicAudio(musicAudio);
    }, [currentMusicFile]);

    const exitedHandler = async () => {
        try {
            const response = await fetch(`/api/update-state?address=${address}&token=${token}&option=${chosenOption}`);
            if (response.status === 200) {
                fadeCurrentAudio();
                setShowNewAch(false);

                const result = await response.json();
                console.log(result);

                if (result.state.isRandom) {
                    if (result.state.randomSuccess) {
                        randomSuccessAudio.play();
                    } else {
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
                    const found = achievements.find((a) => a.Code === result.state.newAchievement);
                    if (found) {
                        setAchievement(found);
                        setTimeout(() => {
                            setShowNewAch(true);
                        }, 1000);
                    }
                }

                if (result.manaRanking?.length > 0) {
                    setManaRanking(result.manaRanking[0]);
                }

                setRandomDismissed(false);
                setManaDismissed(false);

                const isFinalSlide = decision?.id === 700;
                let artUrl;
                if (isFinalSlide) {
                    if (state.gender === 'male') artUrl = endArtMale;
                    else if (state.gender === 'female') artUrl = endArtFemale;
                } else {
                    artUrl = `https://storage.googleapis.com/hikari-genu/art/${decision?.id}.png`;
                }

                onImageLoaded(artUrl, result.state, result.decision);
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

    const endArtMale = `https://storage.googleapis.com/hikari-genu/final/final-slide-male.png`;
    const endArtFemale = `https://storage.googleapis.com/hikari-genu/final/final-slide-female.png`;

    function fadeCurrentAudio(next) {
        if (!currentAudio) return;

        if (currentAudio.volume - 0.003 > 0) {
            currentAudio.volume -= 0.003;
            setTimeout(() => fadeCurrentAudio(next), 4);
        } else {
            currentAudio.pause();
            if (next) {
                next.play();
                setCurrentAudio(next);
            }
        }
    }

    function fadeCurrentMusicAudio(next) {
        if (!currentMusicAudio) return;

        if (currentMusicAudio.volume - 0.003 > 0) {
            currentMusicAudio.volume -= 0.003;
            setTimeout(() => fadeCurrentMusicAudio(next), 4);
        } else {
            currentMusicAudio.pause();
            currentMusicAudio.remove();
            if (next) setCurrentMusicFile(next);
        }
    }

    const enterHandler = () => {
        playSlideAudio();
    };

    const playSlideAudio = () => {
        const data = slideAudioData.find((d) => d.id === state.currentDecision);
        if (data) {
            console.log(data);
            try {
                if (currentAudio) currentAudio.pause();
                const audioFile = data.audio_file;
                const audio = new Audio(`/audio/bg/${audioFile}`);
                audio.onended = () => {
                    const loopFile = data.loop_file;
                    console.log(`${audioFile} ended, playing loop ${loopFile}`);
                    const loop = new Audio(`/audio/bg/${loopFile}`);
                    loop.loop = true;
                    fadeCurrentAudio(loop);
                };
                audio.play();
                setCurrentAudio(audio);
            } catch (err) {
                console.log(err);
            }
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

    useEffect(() => {
        const isFinalSlide = decision?.id === 700;
        let artUrl;
        if (isFinalSlide) {
            if (state.gender === 'male') artUrl = endArtMale;
            else if (state.gender === 'female') artUrl = endArtFemale;
        } else {
            artUrl = `https://storage.googleapis.com/hikari-genu/art/${decision?.id}.png`;
        }
        setArt(artUrl);
    }, []);

    const onImageLoaded = async (url, state, decision) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            console.log(`${url} loadeddata`)
            setArt(url);
            setState(state);
            setDecision(decision);
            setProcessing(false);
        };
        // console.log(url);
        // let blob = await fetch(url).then((r) => r.blob());
        // let dataUrl = await new Promise((resolve) => {
        //     let reader = new FileReader();
        //     reader.onload = () => resolve(reader.result);
        //     reader.readAsDataURL(blob);
        // });

        // setArt(dataUrl);
    };

    const finalOverviewSx = {
        fontSize: '2vmin',
        fontFamily: 'Charter',
        color: '#302C21',
    };

    const finalize = async () => {
        const { ethersSigner } = wallet;
        const signature = await ethersSigner.signMessage('finalize-state');

        const response = await fetch(`/api/finalize-state?address=${address}&token=${token}&signature=${signature}`);
        if (response.status === 200) {
            const result = await response.json();
            setDataSubmitted(true);
            enqueueSnackbar(
                <Typography sx={{ margin: 0, padding: 0, fontSize: '2vmin' }}>
                    Your Gen-U state has been finalized
                </Typography>,
                { variant: 'success' }
            );
        } else {
            enqueueSnackbar(
                <Typography sx={{ margin: 0, padding: 0, fontSize: '2vmin' }}>
                    Could not finalize your Gen-U state
                </Typography>,
                { variant: 'error' }
            );
        }
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
            <Fade
                in={!processing}
                timeout={{ enter: 1000, exit: 1000 }}
                onEnter={enterHandler}
                onExited={exitedHandler}
            >
                <Box
                    sx={{
                        position: 'fixed',
                        padding: 0,
                        margin: 0,
                        width: '100%',
                        height: '100%',
                        aspectRatio: '16 / 9',
                        backgroundImage: `url('${art}')`,
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
                    {decision.id !== 700 && (
                        <>
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

                            <Slide
                                in={showNewAch}
                                direction="left"
                                onEnter={() => {
                                    setTimeout(() => {
                                        setShowNewAch(false);
                                    }, 15000);
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '24%',
                                        height: '24%',
                                        position: 'absolute',
                                        right: '-2%',
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
                                        src={`/images/icons/${achievement.File}`}
                                        style={{ width: '25%', paddingLeft: '15%', paddingBottom: '5%' }}
                                    />
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            paddingLeft: '3%',
                                            paddingBottom: '7%',
                                            color: '#A49A81',
                                            maxWidth: '37%',
                                            textAlign: 'center',
                                            fontSize: '3vmin',
                                            fontFamily: 'DK-DDG',
                                            textShadow: '4px 4px rgba(0, 0, 0, 0.25)',
                                        }}
                                    >
                                        {achievement.Name}
                                    </Typography>
                                </Box>
                            </Slide>
                        </>
                    )}

                    {decision.id === 700 && (
                        <>
                            <Box
                                sx={{
                                    width: '40%',
                                    height: '50%',
                                    backgroundImage: `url('/images/congrats-bg.png')`,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    position: 'absolute',
                                    top: '0%',
                                    right: '5%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'end',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '80%',
                                        height: '60%',
                                        marginBottom: '10%',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography sx={{ color: '#302C21', fontSize: '2vmin', fontFamily: 'Charter' }}>
                                        {`You've successfully completed the Gen-U storyline.`}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: '#302C21',
                                            fontSize: '2vmin',
                                            fontFamily: 'Charter',
                                            marginTop: '3%',
                                        }}
                                    >
                                        Your data is now ready to be processed by the Gen-U system. By clicking the
                                        button below your data will be submitted and your art will be generated over the
                                        next 72 hours.
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: '#302C21',
                                            fontSize: '2vmin',
                                            fontFamily: 'Charter',
                                            marginTop: '3%',
                                        }}
                                    >
                                        Please click the button below and approve this action in your wallet.
                                    </Typography>

                                    <img
                                        src="/images/submit-button.png"
                                        style={{ width: '30%', marginTop: '2%' }}
                                        onMouseEnter={() => hoverAudio.play()}
                                        onClick={() => {
                                            clickAudio.play();
                                            finalize();
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    width: '40%',
                                    height: '40%',
                                    backgroundImage: `url('/images/final-overview.png')`,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    position: 'absolute',
                                    bottom: '10%',
                                    right: '5.5%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        // border: '3px solid black',
                                        width: '45%',
                                        height: '90%',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: 'DK-DDG',
                                            color: '#AEAD8F',
                                            fontSize: '3vmin',
                                            textShadow: '4px 4px #302C21',
                                        }}
                                    >
                                        Overview
                                    </Typography>

                                    <Grid container sx={{ width: '100%', marginTop: '3%' }} spacing={1}>
                                        <Grid item xs={8} sx={{ textAlign: 'left' }}>
                                            <Typography sx={finalOverviewSx}>Final Mana:</Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                            <Typography sx={finalOverviewSx}>{state.mana}</Typography>
                                        </Grid>
                                        <Grid item xs={8} sx={{ textAlign: 'left' }}>
                                            <Typography sx={finalOverviewSx}>Your Mana Ranking:</Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                            <Typography sx={finalOverviewSx}>#{manaRanking?.manaRank}</Typography>
                                        </Grid>

                                        <Grid item xs={8} sx={{ textAlign: 'left' }}>
                                            <Typography sx={finalOverviewSx}>Luck Ratio:</Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                            <Typography sx={finalOverviewSx}>
                                                {(
                                                    (100 * state.randomSuccess) /
                                                    (state.randomSuccess + state.randomFail)
                                                ).toFixed(2)}
                                                %
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={5} sx={{ textAlign: 'left' }}>
                                            <Typography sx={finalOverviewSx}>Achivements:</Typography>
                                        </Grid>
                                        <Grid item xs={7} sx={{ textAlign: 'left' }}>
                                            <Typography sx={finalOverviewSx}>
                                                <ul
                                                    className="custom-scrollbar"
                                                    style={{
                                                        textAlign: 'left',
                                                        marginTop: 0,
                                                        overflowY: 'auto',
                                                        overflowX: 'clip',
                                                        height: '16vmin',
                                                    }}
                                                >
                                                    {state.achievements?.map((ac) => {
                                                        return <li key={ac}>{achievements.find(a => a.Code === ac)?.Name}</li>;
                                                    })}
                                                </ul>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>

                            {dataSubmitted &&
                            <img
                                src="/images/continue-button.png"
                                style={{ position: 'absolute', bottom: '-2%', right: '17%', width: '16%' }}
                                onMouseEnter={() => {
                                    hoverAudio.play();
                                }}
                                onClick={() => {
                                    clickAudio.play();
                                    chooseOption(1);
                                }}
                            />
                            }
                        </>
                    )}
                </Box>
            </Fade>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={Boolean(state.isRandom && !randomDismissed)}
                onEnter={() => currentAudio?.pause()}
                onExit={() => currentAudio?.play()}
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
                onEnter={() => currentAudio?.pause()}
                onExit={() => currentAudio?.play()}
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
