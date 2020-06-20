import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NotFound from './pages/404';
import Restricted from './pages/401';
import Private from './pages/Private';
import Login from './pages/Login';
import PrivateRoute from './config/PrivateRoute';
import FirebaseProvider from './config/FirebaseProvider';
import { SnackbarProvider } from 'notistack';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import theme from './theme';


function App() {

const newTheme = createMuiTheme(theme);

return (
    <MuiThemeProvider theme={newTheme}>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <SnackbarProvider maxSnack={3}>
    <FirebaseProvider>
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/login" component={Login}/>
                    <PrivateRoute exact path="/" component={Private}/>
                    <Route path="/404" component={NotFound}/>
                    <Route path="/401" component={Restricted}/>
                    <Route component={NotFound}/>
                </Switch>
            </Router>
        </div>
    </FirebaseProvider>
    </SnackbarProvider>
    </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
}

export default App;
