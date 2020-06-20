// React
import React, { useState } from 'react';

// Material UI
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import style from './style';
import {withStyles} from '@material-ui/core/styles';
import isEmail from 'validator/lib/isEmail';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import EmailIcon from '@material-ui/icons/Email';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import WifiOffIcon from '@material-ui/icons/WifiOff';

// Firebase
import { useFirebase } from '../../config/FirebaseProvider';

//React Router Dom
import { Redirect } from 'react-router-dom';

// React Text Loop
import TextLoop from 'react-text-loop';

// React Detect Offline
import { Offline } from 'react-detect-offline';


function Login(props) {

    // Styles
    const { classes, location} = props;

    // Firebase
    const {loading, user, auth} = useFirebase();

    // State Data
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    // State Error
    const [error, setError] = useState({
        email: '',
        password: ''
    })

    // State Submitting
    const [isSubmitting, setSubmitting] = useState(false);

    //Handle Change Textfield
    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

        setError({
            ...error,
            [e.target.name]: ''
        })
    }

    // Validasi
    const validate = () => {
        const newError = { ...error };
        const { email, password } = form;


        if (!email) {
            newError.email = 'Email Harus Di Isi';

        } else if (!isEmail(email)) {
            newError.email = 'Email Tidak Valid';
        }

        if (!password) {
            newError.password = 'Password Harus Di Isi';
        }


        return newError;
    }

    // Handle Submit
    const handleSubmit = async e => {
        e.preventDefault();
        const findError = validate();

        if (Object.values(findError).some(m => m !== "")) {
            setError(findError)
        } else {
            setSubmitting(true)
            try {
                await auth.signInWithEmailAndPassword(form.email, form.password);
            } catch (e) {
                const newError = {};

                switch (e.code) {

                    case 'auth/user-not-found':
                        newError.email = 'Email tidak terdaftar';
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Email tidak valid';
                        break;
                    case 'auth/wrong-password':
                        newError.password = 'Password salah';
                        break;
                    case 'auth/user-disabled':
                        newError.email = 'Pengguna di blokir';
                        break;
                    default:
                        newError.email = 'Terjadi kesalahan, silahkan coba lagi';
                        break;
                }

                setError(newError);
                setSubmitting(false)
            }
        }
    }

    // Loading
    if (loading){
        return (
            <Container maxWidth="sm" className={classes.loginContainer}>
                <CircularProgress size={60} className={classes.loginContainer}/>
            </Container>
        )
    }

    // Redirect User Terautentikasi
    if (user) {
        const redirectTo = location.state && location.state.from && location.state.from.pathname ? location.state.from.pathname : '/';
        return <Redirect to={redirectTo} />
    }
    
    return (
            <Grid container alignItems="center" justify="center" alignContent="center" spacing={3}>
                <Grid item xl={6} lg={6} md={7} sm={12} xs={12}>
                    <Container maxWidth="sm" className={classes.text}>
                    <Typography className={classes.desc}>selamat datang di aplikasi kelola sewa gedung <br/> _________</Typography>
                    <Typography className={classes.desc2}>

                        kelola data penyewaan gedung anda dengan {" "}

                        <TextLoop mask={true}>
                            <span className={classes.textloop}>mudah</span>
                            <span className={classes.textloop}>aman</span>
                            <span className={classes.textloop}>cepat</span>
                        </TextLoop>

                        {" "} disini.

                    </Typography>
                    </Container>
                </Grid>
                <Grid item  xl={5} lg={5} md={4} sm={12} xs={12}>
                <Container maxWidth="xs">
                <div className={classes.loginBlock}>
                    <Typography className={classes.pageSubtitle}>Login untuk melanjutkan</Typography>
                    <form onSubmit={handleSubmit}>
                        <div className={classes.formRow}>
                            <TextField
                                variant="outlined"
                                autoComplete="off"
                                disabled={isSubmitting}
                                id="email"
                                name="email"
                                placeholder="Masukkan Email"
                                className={classes.textField}
                                value={form.email}
                                onChange={handleChange}
                                helperText={error.email}
                                error={error.email ? true : false}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon className={classes.iconColor} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        <div className={classes.formRow}>
                            <TextField
                                autoComplete="off"
                                variant="outlined"
                                disabled={isSubmitting}
                                id="password"
                                name="password"
                                placeholder="Masukkan Password"
                                className={classes.textField}
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                helperText={error.password}
                                error={error.password ? true : false}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <VpnKeyIcon className={classes.iconColor} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        <div className={classes.formRow}>
                            <Button
                                disabled={isSubmitting}
                                className={classes.loginBtn}
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                {isSubmitting === true && <CircularProgress size={24} className={classes.buttonProgress} />}Masuk
                            </Button>
                        </div>
                    </form>
                </div>
                {/* Alert Offline */}
                <Offline>
                    <Snackbar open={true} anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} autoHideDuration={null}>
                        <Alert color="error" iconMapping={{ success: <WifiOffIcon fontSize="inherit" /> }} variant="filled" elevation={6}>
                          Tidak Ada Koneksi Internet, Silahkan Hubungkan
                        </Alert>
                    </Snackbar>
                </Offline>
            </Container>
                </Grid>
                <Grid item xs={12}>
                    <Typography className={classes.wm}>{'\u00A9'} SandyAN - 2020</Typography>
                </Grid>
            </Grid>
            
    );
}

export default withStyles(style)(Login);