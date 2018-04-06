import React from 'react';
import {
  HashRouter,
  Switch,
  Route
} from 'react-router-dom';
import PropTypes from 'prop-types';
import ThxReportHome from "./thxreport_home";

export function ThxReportApp(props) {
  return (
    <HashRouter>
      <Switch>
        <Route path='/'>
          <ThxReportHome addBasePath={props.addBasePath} httpClient={props.httpClient}/>
        </Route>
      </Switch>
    </HashRouter>
  )
}

ThxReportApp.propTypes = {
  addBasePath: PropTypes.func.isRequired,
  httpClient: PropTypes.func.isRequired
}
