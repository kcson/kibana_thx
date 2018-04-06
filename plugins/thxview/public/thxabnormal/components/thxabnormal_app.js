import React from 'react';
import {
  HashRouter,
  Switch,
  Route
} from 'react-router-dom'
import PropTypes from 'prop-types';
import ThxAbnormalHome from './thxabnormal_home';


export function ThxAbnormalApp(props) {
  return (
    <HashRouter>
      <Switch>
        <Route path='/'>
          <ThxAbnormalHome addBasePath={props.addBasePath} httpClient={props.httpClient}/>
        </Route>
      </Switch>
    </HashRouter>
  )
}

ThxAbnormalApp.propTypes = {
  addBasePath: PropTypes.func.isRequired,
  httpClient: PropTypes.func.isRequired
}

