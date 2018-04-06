import {uiModules} from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import 'semantic-ui-css/semantic.min.css';
import template from './templates/abnormal_ng_wrapper.html';
import chrome from 'ui/chrome';
import 'ngreact';
import {ThxAbnormalApp} from "./components/thxabnormal_app";

uiRoutes.enable();
uiRoutes
  .when('/', {
    template,
    controller($scope, $http) {
      $scope.addBasePath = chrome.addBasePath;
      $scope.httpClient = $http;
    }
  });

const app = uiModules.get('app/thxabnormal', ['react']);
app.directive('thxAbnormalApp', function(reactDirective) {
  return reactDirective(ThxAbnormalApp);
});
