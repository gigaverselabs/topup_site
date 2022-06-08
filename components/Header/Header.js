import { useAuth } from '../../utils/auth';
import { useState } from 'react';
import { AppBar, Button, Container, IconButton, Grid, Stack, Toolbar, Typography, Box, Paper } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Link } from '@mui/material';

import Modal from '@mui/material/Modal';

const Header = () => {
    const auth = useAuth()

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [connected, isConnecting] = useState(false);

    async function login() {
        isConnecting(true);
        try {
            await auth.usePlug()
        } catch {

        }
        isConnecting(false);
    }

    async function logout() {
        auth.wallet.logOut();
    }

    return (
            <AppBar position="static" color="background">
                <Container maxWidth="lg">
                    <Toolbar>
                        <Typography variant="h5" color="inherit" component="div" sx={{ flexGrow: 1 }}>
                            <Link href='https://twitter.com/GigaverseLabs'>
                                <img src="/logo_icon.svg" alt='logo' style={{ marginTop: '10px' }} />
                            </Link>
                        </Typography>
                        <Typography variant="h5" color="inherit" component="div" sx={{ flexGrow: 1 }}>
                            TOP UP SITE
                        </Typography>
                        <Stack spacing={2} direction="row">
                            {auth.principal !== null && auth.principal !== undefined ? <>
                                <LoadingButton loading={connected} variant="contained" onClick={logout}>Disconnect Wallet</LoadingButton>
                            </> :
                                <LoadingButton loading={connected} variant="contained" onClick={login}>Connect Wallet</LoadingButton>
                            }
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>
    );
};

export default Header;
