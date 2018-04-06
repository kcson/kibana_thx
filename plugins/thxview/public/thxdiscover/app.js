import {uiModules} from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import 'semantic-ui-css/semantic.min.css'
import template from './templates/discover_ng_wrapper.html';
import {ThxDiscoverApp} from './components/thxdiscover_app';
import chrome from 'ui/chrome';
import 'ngreact';

uiRoutes.enable();
uiRoutes.when('/', {
  template,
  controller($scope, $http) {
    $scope.addBasePath = chrome.addBasePath;
    $scope.httpClient = $http;
  }
});

const app = uiModules.get('app/thxdiscover', ['react']);
app.directive('thxDiscoverApp', function (reactDirective) {
  return reactDirective(ThxDiscoverApp);
})

