import {makeStyles} from '@material-ui/styles';
const useStyles = makeStyles(theme => ({

    content:{
        marginTop: '10vh',
        padding: 20,
        margin: 'auto',
    },

    text1: {
        marginTop: '3vh',
        marginBottom: '1vh',
        textAlign: 'center',
        fontSize: 70,
        fontWeight: 600,
        color: 'grey',
    },

    text2: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 300,
        color: 'grey',
        marginBottom: '4vh',
    },

    text3: {
        marginBottom: '4vh',
        textAlign: 'center',
        fontSize: 13,
        fontWeight: 300,
        color: 'grey',
    },
}))

export default useStyles;