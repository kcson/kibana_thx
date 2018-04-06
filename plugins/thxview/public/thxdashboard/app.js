import {uiModules} from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import 'semantic-ui-css/semantic.min.css';
import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';

import template from './templates/dashboard_ng_wrapper.html';
import chrome from 'ui/chrome';
import 'ngreact';
import {ThxDashboardApp} from "./components/thxdashboard_app";

uiRoutes.enable();
uiRoutes.when('/', {
  template,
  controller($scope, $http) {
    $scope.addBasePath = chrome.addBasePath;
    $scope.httpClient = $http;
  }
});

const app = uiModules.get('app/thxdashboard', ['react']);
app.directive('thxDashboardApp', function (reactDirective) {
  console.log('call thxDashboardApp');
  return reactDirective(ThxDashboardApp);
});
