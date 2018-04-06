import {M_SEARCH} from "../../common/elasticsearch_discover";
import {searchDiscover} from "../../common/elasticsearch_discover";
import {exportDiscover} from "../../common/elasticsearch_discover";
import moment from "moment/moment";
import {RIGHT_ALIGNMENT} from "../../../../ui_framework/services";
import stringify from 'csv-stringify';
import {EXPORT_SPLIT_SIZE} from "../../common/elasticsearch_discover";

export default function (server) {
  const adminCluster = server.plugins.elasticsearch.getCluster('admin');
  const dataCluster = server.plugins.elasticsearch.getCluster('data');

  server.route({
    path: '/api/thxdiscover/ping',
    method: 'GET',
    handler(req, reply) {
      adminCluster.callWithInternalUser('ping').then(
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
    path: '/api/thxdiscover/msearch',
    method: 'POST',
    handler(req, reply) {
      dataCluster.callWithRequest(req, 'msearch', M_SEARCH).then(
        (result) => {
          console.log(JSON.stringify(result));
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
    path: '/api/thxdiscover/search',
    method: 'POST',
    handler(req, reply) {
      const SEARCH_DISCOVER = searchDiscover();
      const rangeFilter = SEARCH_DISCOVER.body.query.bool.must[0];
      rangeFilter.range['@timestamp'].gte = req.payload.fromDate;
      rangeFilter.range['@timestamp'].lte = req.payload.toDate;
      rangeFilter.range['@timestamp'].time_zone = req.payload.timeZone;
      console.log(SEARCH_DISCOVER.body.query.bool.must[0]);

      const keywordFilter = SEARCH_DISCOVER.body.query.bool.must[1];
      keywordFilter.match["http.response.body"].query = req.payload.keyword;
      console.log(SEARCH_DISCOVER.body.query.bool.must[1]);

      SEARCH_DISCOVER.body.from = req.payload.from;

      dataCluster.callWithRequest(req, 'search', SEARCH_DISCOVER).then(
        (result) => {
          reply(result);
        },
        (err) => {
          console.log(err);
          reply(err);
        }
      );
      //reply({ time: (new Date()).toISOString() });
    }
  });

  server.route({
    path: '/api/thxdiscover/export',
    method: 'POST',
    handler(req, reply) {
      const EXPORT_DISCOVER = exportDiscover();
      const columns = {
        logDate: '접속일시',
        userId: '사용자 ID',
        userName: '이름',
        ip: 'IP',
        system: '시스템',
        policy: '검출정책',
        page: '접근페이지',
        detected: '검출데이터'
      };
      const stringifier = stringify({header: true, columns: columns});
      let row = '';
      stringifier.on('readable', function () {
        while (row = stringifier.read()) {
          req.raw.res.write(row);
          //req.raw.res.flush();
          //reply(row);
        }
      });
      stringifier.on('error', function (err) {
        console.log(err.message);
      });
      stringifier.on('finish', function () {
        //reply.continue();
        req.raw.res.end();
      });

      const rangeFilter = EXPORT_DISCOVER.body.query.bool.must[0];
      rangeFilter.range['@timestamp'].gte = req.payload.fromDate;
      rangeFilter.range['@timestamp'].lte = req.payload.toDate;
      rangeFilter.range['@timestamp'].time_zone = req.payload.timeZone;
      console.log(EXPORT_DISCOVER.body.query.bool.must[0]);

      const keywordFilter = EXPORT_DISCOVER.body.query.bool.must[1];
      keywordFilter.match["http.response.body"].query = req.payload.keyword;
      console.log(EXPORT_DISCOVER.body.query.bool.must[1]);

      dataCluster.callWithRequest(req, 'search', EXPORT_DISCOVER).then(
        (result) => {
          let timeStamp = '';
          let searchId = '';
          result.hits.hits.map((hit) => {
            let path = '-';
            if (hit._source.path) {
              path = hit._source.path;
            }
            stringifier.write([
              hit._source['@timestamp'],
              hit._source['client_ip'],
              hit._source['client_ip'],
              hit._source['client_ip'],
              hit._source.ip,
              '정책1',
              path,
              '1'
            ]);
            timeStamp = hit._source['@timestamp'];
            searchId = hit._id;
          });
          if (result.hits.hits.length === EXPORT_SPLIT_SIZE) {
            EXPORT_DISCOVER.body.search_after = [];
            const searchTimestamp = moment(timeStamp).valueOf();
            searchAfterQuery(req, reply, searchTimestamp, searchId, EXPORT_DISCOVER, stringifier).then(
              () => {
                stringifier.end();
              }
            )
          } else {
            stringifier.end();
          }
        },
        (err) => {
          console.log(err);
          reply(err);
        }
      );
      //stringifier.end();
    }
  });

  async function searchAfterQuery(req, reply, searchTimestamp, searchId, EXPORT_DISCOVER, stringifier) {
    EXPORT_DISCOVER.body.search_after.push(searchTimestamp);
    EXPORT_DISCOVER.body.search_after.push(searchId);
    const result = await dataCluster.callWithRequest(req, 'search', EXPORT_DISCOVER);
    let timeStamp = '';
    let _id = '';
    result.hits.hits.map((hit) => {
      let path = '-';
      if (hit._source.path) {
        path = hit._source.path;
      }
      stringifier.write([
        hit._source['@timestamp'],
        hit._source['client_ip'],
        hit._source['client_ip'],
        hit._source['client_ip'],
        hit._source.ip,
        '정책1',
        path,
        '1'
      ]);
      timeStamp = hit._source['@timestamp'];
      _id = hit._id;
    });
    if (result.hits.hits.length === EXPORT_SPLIT_SIZE) {
      EXPORT_DISCOVER.body.search_after = [];
      const searchTimestamp = moment(timeStamp).valueOf();
      await searchAfterQuery(req, reply, searchTimestamp, _id, EXPORT_DISCOVER, stringifier);
    }
  }
}
