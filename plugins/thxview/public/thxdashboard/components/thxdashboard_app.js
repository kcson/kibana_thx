import React from 'react';
import {
  HashRouter,
  Switch,
  Route
} from 'react-router-dom';
import PropTypes from 'prop-types';
import ThxDashboardHome from "./thxdashboard_home";

export function ThxDashboardApp(props) {
  return (
    <HashRouter>
      <Switch>
        <Route path='/'>
          <ThxDashboardHome addBasePath={props.addBasePath} httpClient={props.httpClient}/>
        </Route>
      </Switch>
    </HashRouter>
  )
}

ThxDashboardApp.propTypes = {
  addBasePath: PropTypes.func.isRequired,
  httpClient: PropTypes.func.isRequired
};
