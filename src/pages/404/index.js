// React
import React from 'react';

// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

// Styles
import useStyles from './style';

function NotFound() {
    const classes = useStyles();
    return(
        <Container maxWidth="xs">
                <div className={classes.content}>
                    <Typography className={classes.text1}>404</Typography>
                    <Typography className={classes.text2}>Yah, Anda Nyasar !</Typography>
                    <Typography className={classes.text3}>Mungkin Permintaan Anda Salah.<br/>Cek Permintaan Anda, Atau Tekan Tombol Dibawah Untuk Kembali</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={()=>{window.history.back()}}
                    >
                        Kembali
                    </Button>
                </div>
        </Container>
    )
}

export default NotFound;