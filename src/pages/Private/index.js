// React
import React from 'react';

// React Router Dom
import { Switch, Route } from 'react-router-dom';

// Pages
import Main from './Main';

function Private() {
    return (
        <div>
                <Switch>
                    <Route component={Main}/>
                </Switch>
        </div>
    );
}

export default Private;