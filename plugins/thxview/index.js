import {resolve} from 'path';
import initDiscoverApi from './server/routes/server_api_discover';
import initDashboardApi from './server/routes/server_api_dashboard';
import initStatApi from './server/routes/server_api_stat';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'thxview',
    id: 'thxview',
    uiExports: {
      app: [
        {
          id: 'thxdashboard',
          title: '대시보드',
          description: 'An awesome Kibana plugin',
          main: 'plugins/thxview/thxdashboard/app',
          order: -1005,
          icon: 'plugins/thxview/thxdashboard/assets/thxdashboard.svg',
          url: '/app/thxdashboard#/',
        },
        {
          id: 'thxabnormal',
          title: '이상행동',
          description: 'An awesome Kibana plugin',
          main: 'plugins/thxview/thxabnormal/app',
          order: -1004,
          icon: 'plugins/thxview/thxabnormal/assets/thxabnormal.svg',
          url: '/app/thxabnormal#/'
        },
        {
          id: 'thxdiscover',
          title: '통합로그',
          description: 'An awesome Kibana plugin',
          main: 'plugins/thxview/thxdiscover/app',
          order: -1003,
          icon: 'plugins/thxview/thxdiscover/assets/thxdiscover.svg',
          url: '/app/thxdiscover#/',
        },
        {
          id: 'thxreport',
          title: '통계/리포트',
          description: 'An awesome Kibana plugin',
          main: 'plugins/thxview/thxreport/app',
          order: -1002,
          icon: 'plugins/thxview/thxreport/assets/thxreport.svg',
          url: '/app/thxreport#/',
        },
      ],

      translations: [
        resolve(__dirname, './translations/es.json')
      ],
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) {
      // Add server routes and initialize the plugin here
      initDiscoverApi(server);
      initDashboardApi(server);
      initStatApi(server);
    }
  });
};
