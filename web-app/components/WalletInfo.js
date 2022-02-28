import { Button, Card, Fade, Grow, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import Blockies from 'react-blockies';
import MenuIcon from '@mui/icons-material/Menu';

export default function WalletInfo(props) {
    const wallet = useContext(WalletContext);
    const [visible, setVisible] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const menuOpen = Boolean(menuAnchor);


    useEffect(() => {
        setVisible(wallet.address ? true : false);
    }, [wallet.address]);

    const menuClick = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const closeMenu = () => {
        setMenuAnchor(null);
    }

    const disconnectWallet = () => {
        wallet.disconnect();
        closeMenu();
    }

    return (
        <>
            <Fade in={visible}>
                <Card sx={{ padding: 1, position: 'absolute', top: 10, right: 10 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Blockies seed={wallet.address} />
                        <Typography variant="body1">{wallet.address?.substring(0, 12)}...</Typography>
                        <IconButton>
                            <MenuIcon onClick={menuClick} />
                        </IconButton>
                    </Stack>
                    <Menu
                        anchorEl={menuAnchor}
                        open={menuOpen}
                        onClose={closeMenu}
                    >
                        <MenuItem onClick={disconnectWallet}>Disconnect wallet</MenuItem>
                    </Menu>
                </Card>
            </Fade>
        </>
    );
}
