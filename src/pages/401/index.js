// React
import React from 'react';

// Image

// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

// Styles
import useStyles from './style';

// Firebase
import { useFirebase } from '../../config/FirebaseProvider';

// React Router Dom
import { Redirect } from 'react-router-dom';


function Restricted() {

        const classes = useStyles();

        const {auth, user} = useFirebase();

        // Dialog Box
        const [open, setOpen] = React.useState(false);

        const handleClose = () => {
            setOpen(false);
        };


        const handleLogout = (e) => {
            auth.signOut();
        }

        if (!user){
            return <Redirect to="/login"/>
        }


    return(
        <Container maxWidth="xs">
                <div className={classes.content}>
                    <Typography className={classes.text1}>401</Typography>
                    <Typography className={classes.text2}>Yah, Ada Masalah !</Typography>
                    <Typography className={classes.text3}>Mungkin...</Typography>
                    <ul>
                        <li>
                            <Typography className={classes.text4}>Koneksi Internet Anda Bermasalah</Typography>
                        </li>
                        <li>
                        <Typography className={classes.text4}>Atau Akun Anda Tidak Terdaftar</Typography>
                        </li>
                    </ul>
                    <Typography className={classes.text3}>Coba Untuk...</Typography>
                    <ul>
                        <li>
                            <Typography className={classes.text4}>Periksa Koneksi Internet Anda</Typography>
                        </li>
                        <li>
                            <Typography className={classes.text4}>Refresh Halaman</Typography>
                        </li>
                        <li>
                        <Typography className={classes.text4}>Masuk Dengan Akun YAng Tersedia</Typography>
                        </li>
                    </ul>
                    <Typography className={classes.text5}>Tekan Logout Untuk Beralih Akun, Tekan Refresh Untuk Refresh Halaman</Typography>
                    <Grid container spacing={2} className={classes.btn}>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => {
                                    window.location.reload(true);
                                }}
                            >
                                Refresh
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                onClick={()=>{
                                    setOpen(true);
                                }}
                            >
                                Logout
                            </Button>
                        </Grid>
                    </Grid>
                </div>
                {/* Dialog Box Logout */}

                <Dialog
                    open={open}
                    keepMounted
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogContent>
                        <DialogTitle id="alert-dialog-slide-title"><Typography variant="h6">Anda Yakin ?</Typography></DialogTitle>
                    </DialogContent>
                    <Divider/>
                    <DialogActions>
                        <Button
                            onClick={handleClose}
                            color="secondary"
                            fullWidth
                        >
                            Kembali
                        </Button>
                        <Button
                            onClick={handleLogout}
                            fullWidth
                        >
                            Logout
                        </Button>
                    </DialogActions>
                </Dialog>
        </Container>
    )
}

export default Restricted;