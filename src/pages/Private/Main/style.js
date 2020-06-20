import {makeStyles} from '@material-ui/styles';
const useStyles = makeStyles(theme => ({

    content:{
        marginTop: '4vh',
        padding: 20,
    },

    text1: {
        textAlign: 'left',
        fontSize: 40,
        fontWeight: 600,
        color: 'white',
        marginBottom: 20,
    },

    oading: {
        borderRadius: 5
    },

    text2: {
        textAlign: 'left',
        fontWeight: 450,
    },

    harga: {
        marginLeft: 15,
        marginTop: 5,
        marginBottom: 15
    },

    marginTextfield: {
        marginBottom: 20
    },

    divider: {
        border: '2px solid #33333',
        marginTop: 20,
        marginBottom: 30
    },

    total1: {
        textAlign: 'right',
    },

    total2: {
        textAlign: 'right',
        fontWeight: 'bold'

    },

    time: {
        fontSize: 11,
        textAlign: 'left',
    },

    footer: {
        marginBottom: 20,
    },

    conHarga: {
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        paddingRight: 30,
        paddingLeft: 30,
        paddingTop: 20,
        paddingBottom: 20,
    },

    bg: {
        width: '100%',
        height: 350,
        backgroundColor: '#2196f3',
        position: 'absolute',
        top:0,
        left: 0,
        zIndex: -1,
    },

    wm: {
        color: 'grey',
        textAlign: 'center',
        fontSize: 11,
        marginTop: 25,
    },

    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },

}))

export default useStyles;