import {chartDashBoard, topNDashBoard, chartPatternDashBoard, topNPatternDashBoard, totalSumDashBoard, daySumDashBoard} from "../../common/elasticsearch_dashboard"

export default function (server) {
  //const adminCluster = server.plugins.elasticsearch.getCluster('admin');
  const dataCluster = server.plugins.elasticsearch.getCluster('data');

  server.route({
    path: '/api/thxdashboard/ping',
    method: 'GET',
    handler(req, reply) {
      dataCluster.callWithInternalUser('ping').then(
        () => {
          reply('call ping');
        },
        (err) => {
          reply(err);
        }
      );
      //reply({ time: (new Date()).toISOString() });
    }
  });

  server.route({
    path: '/api/thxdashboard/chart',
    method: 'POST',
    handler(req, reply) {
      const CHART_DASHBOARD = chartDashBoard();

      const rangeFilter = CHART_DASHBOARD.body.query.bool.must[1];
      rangeFilter.range['@timestamp'].gte = req.payload.fromDate;
      rangeFilter.range['@timestamp'].lte = req.payload.toDate;
      rangeFilter.range['@timestamp'].time_zone = req.payload.timeZone;
      rangeFilter.range['@timestamp'].format = req.payload.format;
      if (req.payload.chartType === "IP") {
        CHART_DASHBOARD.body.aggs["chart_by_ip"].terms.field = "geoip.ip";
      } else {
        CHART_DASHBOARD.body.aggs["chart_by_ip"].terms.field = "client_ip.keyword";
      }

      const aggFilter = CHART_DASHBOARD.body.aggs["chart_by_ip"].aggs;//["interval_sum"]["date_histogram"]
      aggFilter.interval_sum.date_histogram.interval = req.payload.interval;
      aggFilter.interval_sum.date_histogram.time_zone = req.payload.timeZone;

      console.log(CHART_DASHBOARD.body.aggs);

      dataCluster.callWithRequest(req, 'search', CHART_DASHBOARD).then(
        (result) => {
          reply(result);
        },
        (err) => {
          reply(err);
        }
      );
    }
  });

  server.route({
    path: '/api/thxdashboard/chart_pattern',
    method: 'POST',
    handler(req, reply) {
      const CHART_PATTERN_DASHBOARD = chartPatternDashBoard();

      const rangeFilter = CHART_PATTERN_DASHBOARD.body.query.bool.must[1];
      rangeFilter.range['@timestamp'].gte = req.payload.fromDate;
      rangeFilter.range['@timestamp'].lte = req.payload.toDate;
      rangeFilter.range['@timestamp'].time_zone = req.payload.timeZone;
      rangeFilter.range['@timestamp'].format = req.payload.format;

      const aggFilter = CHART_PATTERN_DASHBOARD.body.aggs["chart_by_pattern"];//["interval_sum"]["date_histogram"]
      aggFilter.date_histogram.interval = req.payload.interval;
      aggFilter.date_histogram.time_zone = req.payload.timeZone;

      console.log(CHART_PATTERN_DASHBOARD.body.aggs);

      dataCluster.callWithRequest(req, 'search', CHART_PATTERN_DASHBOARD).then(
        (result) => {
          reply(result);
        },
        (err) => {
          reply(err);
        }
      );
    }
  });

  server.route({
    path: '/api/thxdashboard/topn',
    method: 'POST',
    handler(req, reply) {
      const TOPN_DASHBOARD = topNDashBoard();

      const rangeFilter = TOPN_DASHBOARD.body.query.bool.must[1];
      rangeFilter.range['@timestamp'].gte = req.payload.fromDate;
      rangeFilter.range['@timestamp'].lte = req.payload.toDate;
      rangeFilter.range['@timestamp'].time_zone = req.payload.timeZone;
      rangeFilter.range['@timestamp'].format = req.payload.format;
      if (req.payload.chartType === "IP") {
        TOPN_DASHBOARD.body.aggs["2"].terms.field = "geoip.ip";
      } else {
        TOPN_DASHBOARD.body.aggs["2"].terms.field = "client_ip.keyword";
      }
      TOPN_DASHBOARD.body.aggs["2"].terms.size = req.payload.size;

      console.log(TOPN_DASHBOARD.body.aggs);

      dataCluster.callWithRequest(req, 'search', TOPN_DASHBOARD).then(
        (result) => {
          reply(result);
        },
        (err) => {
          reply(err);
        }
      );
    }
  });

  server.route({
    path: '/api/thxdashboard/topn_pattern',
    method: 'POST',
    handler(req, reply) {
      const TOPN_PATTERN_DASHBOARD = topNPatternDashBoard();

      const rangeFilter = TOPN_PATTERN_DASHBOARD.body.query.bool.must[1];
      rangeFilter.range['@timestamp'].gte = req.payload.fromDate;
      rangeFilter.range['@timestamp'].lte = req.payload.toDate;
      rangeFilter.range['@timestamp'].time_zone = req.payload.timeZone;
      rangeFilter.range['@timestamp'].format = req.payload.format;

      console.log(TOPN_PATTERN_DASHBOARD.body.aggs);

      dataCluster.callWithRequest(req, 'search', TOPN_PATTERN_DASHBOARD).then(
        (result) => {
          reply(result);
        },
        (err) => {
          reply(err);
        }
      );
    }
  });

  server.route({
    path: '/api/thxdashboard/sum',
    method: 'POST',
    handler(req, reply) {
      const DAY_SUM_DASHBOARD = daySumDashBoard();
      const TOTAL_SUM_DASHBOARD = totalSumDashBoard();

      const rangeFilter = DAY_SUM_DASHBOARD.body.query.bool.must[1];
      rangeFilter.range['@timestamp'].gte = req.payload.fromDate;
      rangeFilter.range['@timestamp'].lte = req.payload.toDate;
      rangeFilter.range['@timestamp'].time_zone = req.payload.timeZone;
      rangeFilter.range['@timestamp'].format = req.payload.format;
      dataCluster.callWithRequest(req, 'search', DAY_SUM_DASHBOARD).then(
        (result) => {
          result.todaySum = result.aggregations.total_sum.value;
          dataCluster.callWithRequest(req, 'search', TOTAL_SUM_DASHBOARD).then(
            (result1) => {
              result.totalSum = result1.aggregations.total_sum.value;
              reply(result);
            },
            (err) => {
              reply(err)
            }
          );
        },
        (err) => {
          reply(err)
        }
      );
    }
  });
}
