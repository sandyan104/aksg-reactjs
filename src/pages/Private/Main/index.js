// React
import React, { useEffect, useState } from 'react';

// Firebase
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { useFirebase } from '../../../config/FirebaseProvider';

// Material UI
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddBoxIcon from '@material-ui/icons/AddBox';
import GetAppIcon from '@material-ui/icons/GetApp';
import WifiOffIcon from '@material-ui/icons/WifiOff';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import MaterialTable from 'material-table';

// Download Data
import { saveAs } from 'file-saver';
import XLSX from 'xlsx';

// Styles
import useStyles from './style';

// Dialog
import AddDialog from './dialog';

// Snackbar
import { useSnackbar } from 'notistack';

// Formatter
import { unixToDate2, unixToDate } from '../../../utils/formatter';
import { currency } from '../../../utils/formatter-rupiah';
// React Detect Offline
import { Offline } from 'react-detect-offline';

function Main() {

    // Style
    const classes = useStyles();

    // Auth untuk Logout
    const { auth } = useFirebase();

    // Snackbar
    const { enqueueSnackbar } = useSnackbar();

    // Dialog Logout
    const [open, setOpen] = React.useState(false);

    // Handle Click Logout
    const handleLogout = (e) => {
        auth.signOut();
    }

    // Dialog Download
    const [openDownload, setOpenDownload] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseDownload = () => {
        setOpenDownload(false);
    };

    // Handle Download
    const handleDownload = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const Data = XLSX.utils.json_to_sheet(table.data.map(data => {
            return {
                NamaPenyewa: data.nama ? data.nama : 'Tidak Ada Data',
                Alamat: data.alamat ? data.alamat : 'Tidak Ada Data',
                Tujuan: data.tujuan ? data.tujuan : 'Tidak Ada Data',
                LamaSewa: data.lama ? data.lama : 'Tidak Ada Data',
                Dari: data.dari ? unixToDate2(data.dari.toMillis()) : 'Tidak Ada Data',
                Sampai: data.sampai ? unixToDate2(data.sampai.toMillis()) : 'Tidak Ada Data',
                TanggalPengajuan: data.tgl_pengajuan ? unixToDate(data.tgl_pengajuan) : 'Tidak Ada Data',
                TotalHarga: data.total ? currency(data.total) : 'Tidak Ada Data',

            }
        }));
        const sheets = { Sheets: { 'data': Data }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(sheets, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        saveAs(data, `Data_Sewa_Gedung-byAKSG.xlsx`);
        setOpenDownload(false);
        setTimeout(() => { enqueueSnackbar('Mengunduh Data...', { variant: 'info' }) }, 700);
    }



    // Query Data Harga
    const { firestore } = useFirebase();

    const query = firestore.collection('data');

    const [snapshot, loading] = useCollection(query)

    // Data
    const [table, setTable] = React.useState({
        columns: [
            { title: 'Nama Penyewa', field: 'nama' },
            { title: 'Alamat', field: 'alamat' },
            { title: 'Tujuan', field: 'tujuan' },
            {
                title: 'Lama Sewa', field: 'lama',
                render: rowData => <Typography variant="body2">{rowData.lama} Hari</Typography>
            },
            {
                title: 'Dari', field: 'dari',
                render: rowData => <Typography variant="body2">{unixToDate2(rowData.dari ? rowData.dari.toMillis() : <></>)}</Typography>
            },
            {
                title: 'Sampai', field: 'sampai',
                render: rowData => <Typography variant="body2">{unixToDate2(rowData.sampai ? rowData.sampai.toMillis() : <></>)}</Typography>
            },
            {
                title: 'Tanggal Pengajuan', field: 'tgl_pengajuan',
                render: rowData => <Typography variant="body2">{unixToDate(rowData.tgl_pengajuan ? rowData.tgl_pengajuan : <></>)}</Typography>
            },
            {
                title: 'Total Harga', field: 'total',
                render: rowData => <Typography variant="body2">{currency(rowData.total ? rowData.total : <></>)}</Typography>
            }


        ],
        data: [
        ],
    });

    useEffect(() => {
        if (snapshot && !snapshot.empty) {
            setTable(table => {
                return {
                    ...table,
                    data: snapshot.docs.map(doc => {
                        return {
                            uid: doc.id,
                            ...doc.data()
                        }
                    })
                }
            })
        } else {
            setTable(table => {
                return {
                    ...table,
                    data: []
                }
            })
        }
    }, [snapshot]);

    // On Submit Harga
    const [submitH, setSubmitH] = useState(false);

    // Error Harga
    const [error, setError] = useState({
        perhari: '',
    })

    // Data Harga
    const HCol = firestore.doc(`harga/sewa`)
    const [Harga, loadingH] = useDocument(HCol)

    const [harga, setHarga] = useState({
        perhari: 0,
    });


    useEffect(() => {
        if (Harga) {
            setHarga(harga => ({
                ...harga,
                ...Harga.data()
            }))
        }
    }, [Harga])

    // Handle Change Harga
    const handleChange = e => {
        const { name, value } = e.target;
        console.log(value);
        setHarga(harga => ({
            ...harga,
            [name]: value
        }))

        setError(error => ({
            ...error,
            [name]: ''
        }))
    }

    // Validasi Harga
    const validateC = async () => {
        const newError = { ...error };
        const { perhari } = harga;

        if (!perhari || harga.perhari === "Rp. " || harga.perhari === "Rp. 0"  || harga.perhari === "Rp. 00" || harga.perhari === 0) {
            newError.perhari = 'Harga Harus Di Isi';
        }

        return newError
    }

    // Handle Submit
    const handleSubmit = async e => {
        e.preventDefault();
        const findError = await validateC();

        if (Object.values(findError).some(m => m !== "")) {
            setError(findError)
        } else {
            setSubmitH(true)
            try {
                const hph = harga.perhari.replace("Rp. ", "").replace(".", "");
                await firestore.doc('harga/sewa').set({
                    perhari: parseInt(hph)
                }, { merge: true })

                enqueueSnackbar('Harga Berhasil Diperbarui', { variant: 'success' })
            }
            catch (e) {
                const newError = {};

                newError.perhari = e.message;

                newError.perhari = e.message;

                setError(newError);

                enqueueSnackbar('Harga Gagal Diperbarui', { variant: 'error' })
            }

            setSubmitH(false)
        }
    }

    const [dialog, setDialog] = useState({
        mode: 'Tambah',
        open: false,
        data: {},
        harga: ''
    });


    return (
        <Container>
            <div className={classes.bg}></div>
            <div className={classes.content}>
                <Grid container>
                    <Grid item xs={5}>
                        <Typography className={classes.text1}>Data Penyewaan Gedung</Typography>
                    </Grid>
                    <Grid item md={6} sm={4} xs={4}>
                    </Grid>

                    {/* Tombol Logout */}
                    <Grid item xs={1}>
                        <Button variant="contained" color="secondary" onClick={() => { setOpen(true) }}>Logout</Button>
                    </Grid>
                </Grid>
                <Paper elevation={5}>

                    {/* Indikator Loading */}
                    {
                        (loading || loadingH) &&
                        <LinearProgress className={classes.oading} variant="query" color="secondary" />
                    }


                    {/* Harga */}
                    <div className={classes.conHarga}>
                        <Grid container direction="row" alignItems="center" spacing={3}>
                            <Grid item >
                                <Typography className={classes.text2}>Harga Sewa :</Typography>
                            </Grid>
                            <Grid item >
                                <TextField
                                    variant="standard"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">/ hari</InputAdornment>,
                                    }}
                                    name="perhari"
                                    id="perhari"
                                    disabled={submitH}
                                    onChange={handleChange}
                                    value={currency(harga.perhari)}
                                    helperText={error.perhari}
                                    error={error.perhari ? true : false}
                                />
                            </Grid>
                            <Grid item >
                                <Button variant="outlined" size="small" disabled={submitH} onClick={handleSubmit}>
                                    {submitH === true && <CircularProgress size={24} className={classes.buttonProgress} />} Simpan
                                </Button>
                            </Grid>
                        </Grid>
                    </div>


                    {/* Tabel */}
                    <MaterialTable

                        components={{
                            Container: props => <div {...props} elevation={0} />
                        }}

                        columns={table.columns}

                        data={table.data}

                        actions={[

                            // Tombol Edit Data
                            {
                                icon: 'edit',
                                tooltip: 'Edit',
                                onClick: (event, data) => {
                                    setDialog({
                                        mode: 'Edit',
                                        data,
                                        harga,
                                        open: true
                                    })
                                }
                            },

                            // Tombol Tambah Data
                            {
                                icon: () => <AddBoxIcon />,
                                tooltip: 'Tambah',
                                isFreeAction: true,
                                onClick: (e) => {
                                    setDialog({
                                        mode: 'Tambah',
                                        data: {},
                                        open: true,
                                        harga
                                    })
                                }
                            },

                            // Download Data
                            {
                                icon: () => <GetAppIcon />,
                                tooltip: 'Ekspor Data Ke Excel',
                                isFreeAction: true,
                                onClick: () => {
                                    setOpenDownload(true)
                                }
                            },
                        ]}

                        editable={{

                            // Tombol Hapus Data
                            onRowDelete: async (oldData) => {
                                await firestore.doc(`data/${oldData.uid}`).delete();
                                enqueueSnackbar('Data Berhasil Dihapus', { variant: 'success' })
                            }
                        }}

                        // Translate
                        localization={{
                            body: {
                                emptyDataSourceMessage: 'Tidak Ada Data',
                                addTooltip: 'Tambah',
                                editTooltip: 'Ubah',
                                deleteTooltip: 'Hapus',
                                editRow: {
                                    deleteText: 'Anda Yakin Akan Menghapus Data Ini ?',
                                    cancelTooltip: 'Batal',
                                    saveTooltip: 'Ya'
                                }
                            },

                            toolbar: {
                                searchTooltip: 'Cari',
                                searchPlaceholder: 'Cari Data'
                            },

                            header: {
                                actions: 'Tindakan'
                            },

                            pagination: {
                                labelRowsSelect: 'Baris',
                                labelDisplayedRows: ' {from}-{to} Dari {count} Baris',
                                firstTooltip: 'Halaman Pertama',
                                previousTooltip: 'Halaman Sebelumnya',
                                nextTooltip: 'Halaman Selanjutnya',
                                lastTooltip: 'Halaman Terakhir'
                            },

                        }}

                        options={{
                            searchFieldAlignment: 'left',
                            showTitle: false,
                            actionsColumnIndex: -1
                        }}
                    />
                </Paper>
                <Typography className={classes.wm}>{'\u00A9'} SandyAN - 2020</Typography>
            </div>

        {/* Dialog Box Download */}
            <Dialog
                open={openDownload}
                keepMounted
                onClose={handleCloseDownload}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    {
                        table.data.length !== 0 ?
                            <DialogTitle id="alert-dialog-slide-title"><Typography variant="body1" align="center">Anda Akan Menguduh <br/> Data_Sewa_Gedung-byAKSG.xlsx</Typography></DialogTitle>
                            :
                            <DialogTitle id="alert-dialog-slide-title"><Typography variant="body1" align="center">Tidak Ada Data, <br/> Silahkan Tambah Data Terlebih Dahulu</Typography></DialogTitle>
                    }
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button
                        onClick={handleCloseDownload}
                        fullWidth
                    >
                        Kembali
                    </Button>
                    {
                        table.data.length !== 0 &&
                            <Button
                                onClick={handleDownload}
                                fullWidth
                                color="primary"
                            >
                                Ya
                            </Button>
                    }
                </DialogActions>
            </Dialog>

            {/* Dialog Box Logout */}
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <DialogTitle id="alert-dialog-slide-title"><Typography variant="body1">Anda Yakin ?</Typography></DialogTitle>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color="primary"
                        fullWidth
                    >
                        Kembali
                        </Button>
                    <Button
                        onClick={handleLogout}
                        fullWidth
                        color="secondary"
                    >
                        Logout
                        </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Tambah/Edit Data */}
            <AddDialog
                dialog={dialog}
                handleClose={() => {
                    setDialog({ mode: 'Tambah', open: false, data: {}, harga });
                }}
            />

        {/* Alert Offline */}
            <Offline>
                <Snackbar open={true} anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} autoHideDuration={null}>
                    <Alert color="error" iconMapping={{ success: <WifiOffIcon fontSize="inherit" /> }} variant="filled" elevation={6}>
                      Tidak Ada Koneksi Internet, Hubungkan Jaringan
                    </Alert>
                </Snackbar>
            </Offline>
        </Container>
    )
}

export default Main;