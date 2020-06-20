export default theme => ({

    text: {
        textAlign: 'left',
        [theme.breakpoints.down('sm')]: {
            marginTop: 80,
            textAlign: 'center'
        },
    },

    loginContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
    },

    textloop: {
        backgroundColor: 'grey',
        color: 'white',
        paddingLeft: 5,
        paddingRight: 5
    },

    loginBlock: {
        padding: '100px 1vw 140px 1vw',
        [theme.breakpoints.down('sm')]: {
            padding: '140px 3vw 50px',
        },
    },

    formRow: {
        margin: '0 auto 10px',

    },

    desc: {
        marginBottom: 10,
        color: 'grey',
        fontSize: 20,
        [theme.breakpoints.down('xs')]: {
            fontSize: 15,
        },
    },

    desc2: {
        color: 'grey',
        fontSize: 45,
        [theme.breakpoints.down('md')]: {
            fontSize: 40,
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: 35,
        },
        fontWeight: 700,
    },

    pageTitle: {
        marginTop: 10,
        color: 'grey',
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 600,
    },

    pageSubtitle: {
        color: 'grey',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 500,
        marginTop: 0,
        marginBottom: 30,
    },

    wm: {
        color: 'grey',
        textAlign: 'center',
        fontSize: 11,
        marginTop: 20,
    },

    textField: {
        width: '100%',
    },

    iconColor: {
        color: 'grey',
    },

    loginBtn: {
        marginTop: 30,
        borderRadius: 4,
        textTransform: 'Capitalize',
        fontWeight: 'bold',
        padding: '10px 25px',
        width: '100%'
    },

    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },

});