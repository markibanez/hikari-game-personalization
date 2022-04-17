import { Box, Fade, Typography } from '@mui/material';
import React, { useState } from 'react';

export default function Intro(props) {
    const { setIntroDone } = props;
    const [slide, setSlide] = useState(1);
    const [loading, setLoading] = useState(false);

    const clickAudio = new Audio('/audio/click.wav');
    clickAudio.volume = 0.75;
    const hoverAudio = new Audio('/audio/hover.wav');
    hoverAudio.volume = 0.1;

    const exitedHandler = () => {
        const nextSlide = slide + 1;
        setSlide(nextSlide);
        onImageLoaded(`https://storage.googleapis.com/hikari-genu/intro/${nextSlide}.png`);

        if (nextSlide > 6) {
            setIntroDone(true);
        }
    };

    const onImageLoaded = (url) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            setLoading(false);
            console.log(`${url} loaded`);
        };
    };

    return (
        <>
            <Fade in={!loading} timeout={1000} onExited={exitedHandler}>
                <Box
                    sx={{
                        position: 'fixed',
                        padding: 0,
                        margin: 0,
                        width: '100%',
                        height: '100%',
                        aspectRatio: '16 / 9',
                        backgroundColor: '#24231d',
                        backgroundImage: `url('https://storage.googleapis.com/hikari-genu/intro/${slide}.png')`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        zIndex: 5,
                    }}
                >
                    <img
                        src="/images/continue-button.png"
                        style={{
                            width: '17%',
                            position: 'absolute',
                            bottom: '5%',
                            left: '50%',
                            transform: `translate(-50%, 0)`,
                        }}
                        onClick={() => {
                            clickAudio.play();
                            setLoading(true);
                        }}
                        onMouseEnter={() => hoverAudio.play()}
                    />
                </Box>
            </Fade>
        </>
    );
}
