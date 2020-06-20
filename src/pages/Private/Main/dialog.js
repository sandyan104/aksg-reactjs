import React, { useState, useEffect } from 'react';

// MUI
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { useFirebase } from '../../../config/FirebaseProvider';
import InputAdornment from '@material-ui/core/InputAdornment';
import DialogContent from '@material-ui/core/DialogContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import { DatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

// Date-fns
import idLocale from 'date-fns/locale/id';
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns';
import format from 'date-fns/format';

// Other
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import useStyles from './style';
import { unixToDate3 } from '../../../utils/formatter';
import { currency } from '../../../utils/formatter-rupiah';


function AddDialog({ dialog: { mode, open, data, harga }, handleClose }) {

    const { firestore } = useFirebase();

    // Style
    const classes = useStyles();

    // Data Form
    const [form, setForm] = useState({
        nama: '',
        alamat: '',
        tujuan: '',
        lama: '',
    })

    // Data dari Date Picker
    const [selectedDate, handleDateChange] = useState();
    const [selectedDateSampai, handleDateChangeSampai] = useState();

    // Edit UPdate
    const [ins, setIns] = useState(form.tgl_pengajuan);
    const [upd, setUpd] = useState(form.updated_at);

    const [error, setError] = useState({
        nama: '',
        alamat: '',
        tujuan: '',
        lama: '',
    })

    useEffect(() => {

        const defaultData = {
            nama: '',
            alamat: '',
            tujuan: '',
            lama: '',
        }

        const defaultError = {
            nama: '',
            alamat: '',
            tujuan: '',
            lama: '',
        }

        if (mode === 'Tambah') {
            setForm(defaultData)
            setError(defaultError)
            setIns('-')
            setUpd('-')
        }

        else if (mode === 'Edit') {
            setForm(data)
            handleDateChange(new Date(data.dari.toMillis()))
            handleDateChangeSampai(new Date(data.sampai.toMillis()))
            setError(defaultError)

            setIns(unixToDate3(data.tgl_pengajuan))
            setUpd(unixToDate3(data.updated_at))
        }

    }, [mode, data])


    // Snackbar
    const { enqueueSnackbar } = useSnackbar();

    // Disable Saat Submit
    const [isSubmitting, setSubmitting] = useState(false);

    // HandleChange
    const handleChange = e => {

        const { name, value } = e.target;

        setForm(form => ({
            ...form,
            [name]: value
        }))

        setError(error => ({
            ...error,
            [name]: ''
        }))

    }

    // Validasi
    const validate = async () => {

        const newError = { ...error };

        const { nama, alamat, tujuan, lama } = form;
        const dari = selectedDate;
        const sampai = selectedDateSampai

        if (!nama) {
            newError.nama = 'Nama Penyewa Harus Di Isi';
        }

        if (!alamat) {
            newError.alamat = 'Alamat Harus Di Isi';
        }

        if (!tujuan) {
            newError.tujuan = 'Tujuan Harus Di Isi';
        }

        if (!lama) {
            newError.lama = 'Lama Sewa Harus Di Isi';
        }

        if (!dari) {
            newError.dari = 'Dari Harus Di Isi';
        }

        if (!sampai) {
            newError.sampai = 'Sampai Harus Di Isi';
        }
        return newError;
    }

    // Total Bayar
    const total = harga.perhari * form.lama

    // Handle Submit
    const handleSubmit = async e => {
        e.preventDefault();
        const findError = await validate();


        if (Object.values(findError).some(m => m !== "")) {
            setError(findError)
        } else {
            setSubmitting(true)
            try {

                const DCol = firestore.collection(`data`);

                if (mode === 'Tambah') {
                    if (form.lama === '1') {
                        await DCol.add({
                            ...form,
                            tgl_pengajuan: Date.now(),
                            updated_at: Date.now(),
                            dari: selectedDate,
                            sampai: selectedDate,
                            total: total
                        });
                    }

                    else {
                        await DCol.add({
                            ...form,
                            tgl_pengajuan: Date.now(),
                            updated_at: Date.now(),
                            dari: selectedDate,
                            sampai: selectedDateSampai,
                            total: total
                        });
                    }
                    enqueueSnackbar('Data Berhasil Ditambahkan', { variant: "success" })
                }

                else if (mode === 'Edit') {
                    const { uid, tableData, ...restForm } = form;
                    await DCol.doc(uid).update({
                        ...restForm, updated_at: Date.now(), dari: selectedDate, sampai: selectedDateSampai, total: total
                    })
                    enqueueSnackbar('Data Berhasil Diperbarui', { variant: "success" })
                }

                handleClose()

            } catch (e) {

                const newError = {};

                newError.submit = e.message;

                setError(newError);
            }

            setSubmitting(false)
        }
    }

    // Grid Size dan Label Textfield Disaat lama pinjam = 1 hari
    let xs = 4
    let label = "Dari"

    if (form.lama === "1") {
        xs = 6
        label = "Tanggal Sewa"
    }

    class LocalizedUtils extends DateFnsUtils {
      getDatePickerHeaderText(date) {
        return format(date, "dd MMMM yyyy", { locale: this.locale });
      }
    }

    return <Dialog
        fullWidth
        maxWidth="sm"
        disableBackdropClick={isSubmitting}
        disableEscapeKeyDown={isSubmitting}
        open={open}
        onClose={handleClose}
    >
        <DialogTitle>{mode} Data Penyewa</DialogTitle>
        {isSubmitting === true && <LinearProgress />}
        <DialogContent dividers>
            <form id="create-data-form" onSubmit={handleSubmit}>


                <TextField
                    className={classes.marginTextfield}
                    disabled={isSubmitting}
                    id="nama"
                    name="nama"
                    label="Nama Penyewa"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    autoComplete="off"
                    value={form.nama}
                    onChange={handleChange}
                    helperText={error.nama}
                    error={error.nama ? true : false}
                />

                <TextField
                    className={classes.marginTextfield}
                    disabled={isSubmitting}
                    id="alamat"
                    name="alamat"
                    label="Alamat"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    autoComplete="off"
                    value={form.alamat}
                    onChange={handleChange}
                    helperText={error.alamat}
                    error={error.alamat ? true : false}
                />

                <TextField
                    className={classes.marginTextfield}
                    disabled={isSubmitting}
                    id="tujuan"
                    name="tujuan"
                    label="Tujuan"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    autoComplete="off"
                    fullWidth
                    value={form.tujuan}
                    onChange={handleChange}
                    helperText={error.tujuan}
                    error={error.tujuan ? true : false}
                />

                <Grid container alignContent="center" alignItems="center" justify="center" spacing={3}>
                    <Grid item xs={xs}>
                        <TextField
                            className={classes.marginTextfield}
                            disabled={isSubmitting}
                            id="lama"
                            name="lama"
                            label="Lama Sewa"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            autoComplete="off"
                            fullWidth
                            value={form.lama}
                            onChange={handleChange}
                            helperText={error.lama}
                            error={error.lama ? true : false}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">Hari</InputAdornment>
                            }}
                        />
                    </Grid>
                    <Grid item xs={xs}>
                        <MuiPickersUtilsProvider utils={LocalizedUtils} locale={idLocale}>
                            <DatePicker
                                disabled={isSubmitting}
                                className={classes.marginTextfield}
                                id="dari"
                                name="dari"
                                fullWidth
                                format="dd MMMM yyyy"
                                label={label}
                                okLabel="Oke"
                                cancelLabel="Batal"
                                value={selectedDate}
                                onChange={handleDateChange}
                                helperText={error.dari}
                                error={error.dari ? true : false}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    {
                        form.lama !== "1" &&
                        <Grid item xs={4}>
                            <MuiPickersUtilsProvider utils={LocalizedUtils} locale={idLocale}>
                                <DatePicker
                                    disabled={isSubmitting || form.lama === '1'}
                                    className={classes.marginTextfield}
                                    id="sampai"
                                    name="sampai"
                                    fullWidth
                                    format="dd MMMM yyyy"
                                    label="Sampai"
                                    okLabel="Oke"
                                    cancelLabel="Batal"
                                    value={selectedDateSampai}
                                    onChange={handleDateChangeSampai}
                                    helperText={error.sampai}
                                    error={error.sampai ? true : false}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    }
                </Grid>

                <Divider className={classes.divider}/>

                <Grid container alignContent="center" alignItems="center" justify="center" spacing={1} className={classes.footer}>
                    <Grid item xs={6}>
                        
                        <Grid container alignContent="center" alignItems="center" justify="center">
                            <Grid item xs={12}>
                                <Typography
                                    className={classes.time}
                                >
                                    Tanggal Reservasi &emsp; &nbsp; : &nbsp; <strong> {ins} </strong>
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    className={classes.time}
                                >
                                    Update Data Terakhir &nbsp; : &nbsp; <strong> {upd} </strong>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container alignContent="center" alignItems="center" justify="center">
                            <Grid item xs={4}>
                                <Typography
                                    className={classes.total1}
                                >
                                    Total &nbsp; :
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography
                                    variant="h6"
                                    className={classes.total2}
                                >
                                    {currency(total)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                


            </form>
        </DialogContent>
        <DialogActions>
            <Button
                disabled={isSubmitting}
                onClick={handleClose}
            >
                Batal
                    </Button>
            <Button
                form="create-data-form"
                disabled={isSubmitting}
                type="submit"
                color="primary"
            >
                Simpan
                    </Button>
        </DialogActions>
    </Dialog>

}

AddDialog.propTypes = {
    dialog: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired
}

export default withRouter(AddDialog);
