import {stat, report, reportContent} from "../../common/elasticsearch_stat";
import jsreportCore from 'jsreport-core';
import jsreportXlsx from 'jsreport-xlsx';
import jsreportHandle from 'jsreport-handlebars';
import fs from 'fs';

export default function (server) {
  const dataCluster = server.plugins.elasticsearch.getCluster('data');

  server.route({
    path: '/api/thxreport/stat',
    method: 'POST',
    handler(req, reply) {
      const STAT = stat();

      const rangeFilter = STAT.body.query.bool.must[2];
      rangeFilter.range['@timestamp'].gte = req.payload.fromDate;
      rangeFilter.range['@timestamp'].lte = req.payload.toDate;
      rangeFilter.range['@timestamp'].time_zone = req.payload.timeZone;
      rangeFilter.range['@timestamp'].format = req.payload.format;

      STAT.body.aggs["6"].date_histogram.time_zone = req.payload.timeZone;
      console.log(STAT.body.aggs);

      dataCluster.callWithRequest(req, 'search', STAT).then(
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
    path: '/api/thxreport/report',
    method: 'POST',
    handler(req, reply) {
      let jsreport = jsreportCore();
      jsreport.use(jsreportXlsx());
      jsreport.use(jsreportHandle());

      const reportContentStr = reportContent();
      const REPORT = report();

      const rangeFilter = REPORT.body.query.bool.must[1];
      rangeFilter.range['@timestamp'].gte = req.payload.fromDate;
      rangeFilter.range['@timestamp'].lte = req.payload.toDate;
      rangeFilter.range['@timestamp'].time_zone = req.payload.timeZone;
      rangeFilter.range['@timestamp'].format = req.payload.format;

      dataCluster.callWithRequest(req, 'search', REPORT).then(
        (result) => {
          const report = [];

          result.aggregations["4"].buckets.map((bucket,i) => {
            report.push({
              system: bucket.key,
              email: bucket["1"].value,
              phone: bucket["2"].value,
              jumin: bucket["3"].value,
            });
          });

          jsreport.init().then(() => {
            return jsreport.render({
              template: {
                recipe: 'xlsx',
                engine: 'handlebars',
                content: reportContentStr,
                xlsxTemplate: {
                  content: fs.readFileSync('template/report_template.xlsx').toString('base64')
                },
              },
              data: {
                report: report
              },
            }).then((report) => {
              reply(report.content.toString('base64'));
              //report.stream.pipe(req.raw.res);
            })
          });
        },
        (err) => {
          reply(err);
        }
      );
    }
  });
}
