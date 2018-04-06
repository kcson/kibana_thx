import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import 'semantic-ui-css/semantic.min.css';
import template from './templates/report_ng_wrapper.html';
import 'ngreact';

import chrome from 'ui/chrome';
import {ThxReportApp} from "./components/thxreport_app";

uiRoutes.enable();
uiRoutes.when('/', {
  template,
  controller($scope, $http) {
    $scope.addBasePath = chrome.addBasePath;
    $scope.httpClient = $http;
  }
});

const app = uiModules.get('app/thxreport', ['react']);
app.directive('thxReportApp', function (reactDirective) {
  return reactDirective(ThxReportApp);
});
