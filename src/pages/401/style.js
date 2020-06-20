import {makeStyles} from '@material-ui/styles';
const useStyles = makeStyles(theme => ({

    content:{
        marginTop: '4vh',
        padding: 20,
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
        textAlign: 'left',
        fontSize: 15,
        fontWeight: 350,
        color: 'grey',
    },

    text4: {
        textAlign: 'left',
        fontSize: 13,
        fontWeight: 300,
        color: 'grey',
    },


    text5: {
        marginTop: '5vh',
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 300,
        color: 'grey',
    },

    btn: {
        marginTop: '2vh',
        marginBottom: '2vh',
    },
}))

export default useStyles;