import React from 'react';
import {
  HashRouter,
  Switch,
  Route
} from 'react-router-dom';
import PropTypes from 'prop-types';
import ThxDiscoverHome from './thxdiscover_home';

export function ThxDiscoverApp(props) {
   return (
    <HashRouter>
      <Switch>
        <Route path="/">
          <ThxDiscoverHome
            addBasePath={props.addBasePath}
            httpClient={props.httpClient}
          />
        </Route>
      </Switch>
    </HashRouter>
  );
}

ThxDiscoverApp.propTypes = {
  addBasePath: PropTypes.func.isRequired,
  httpClient: PropTypes.func.isRequired
};

