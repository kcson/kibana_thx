export const searchDiscover = () => {
  return {
    "body": {
      "from": 0, "size": 10,
      "sort": [{
        "@timestamp": {
          "order": "desc",
          "unmapped_type": "boolean"
        }
      }],
      "_source": [
        "@timestamp",
        "ip",
        "client_ip",
        "path",
        "detected",
        //"http.response.body"
      ],
      "query": {
        "bool": {
          "must": [
            {
              "range": {
                "@timestamp": {
                  "gte": "2018-01-01||/d",
                  "lte": "2018-01-30||/d",
                  "format": "yyyy-MM-dd",
                  "time_zone": "Asia/Seoul"
                }
              }
            },
            {
              "match": {
                "http.response.body": {
                  "query": "",
                  "fuzziness": 2,
                  "zero_terms_query": "all",
                  "boost": 2.0
                }
              }
            },
            {
              "wildcard": {
                "ip": {
                  "value": "*"
                }
              }
            }
          ]
        }
      }
    }
  };
};

export const EXPORT_SPLIT_SIZE = 100;
export const exportDiscover = () => {
  return {
    "body": {
      "from": 0, "size": EXPORT_SPLIT_SIZE,
      "sort": [
        {
          "@timestamp": {
            "order": "desc",
            "unmapped_type": "boolean"
          }
        },
        {"_id": "desc"}
      ],
      "_source": [
        "@timestamp",
        "ip",
        "client_ip",
        "path",
        //"http.response.body"
      ],
      "query": {
        "bool": {
          "must": [
            {
              "range": {
                "@timestamp": {
                  "gte": "2018-01-01||/d",
                  "lte": "2018-01-30||/d",
                  "format": "yyyy-MM-dd",
                  "time_zone": "Asia/Seoul"
                }
              }
            },
            {
              "match": {
                "http.response.body": {
                  "query": "",
                  "fuzziness": 2,
                  "zero_terms_query": "all",
                  "boost": 2.0
                }
              }
            },
            {
              "wildcard": {
                "ip": {
                  "value": "*"
                }
              }
            }
          ]
        }
      }
    }
  }
};

export const M_SEARCH = {
  body: [
    {
      index: ["logstash-*"],
      ignore_unavailable: true,
      preference: 1517154572326
    },
    {
      version: true,
      size: 10,
      sort: [{
        "@timestamp": {
          order: "desc",
          unmapped_type: "boolean"
        }
      }],
      _source: {
        excludes: []
      },
      aggs: {
        2: {
          date_histogram: {
            field: "@timestamp",
            interval: "12h",
            time_zone: "Asia/Tokyo",
            min_doc_count: 1
          }
        }
      },
      stored_fields: ["*"],
      script_fields: {},
      docvalue_fields: ["@timestamp",
        "tls.server_certificate.not_after",
        "tls.server_certificate.not_before",
        "tls.server_certificate_chain.not_after",
        "tls.server_certificate_chain.not_before"],
      query: {
        bool: {
          must: [
            {
              match_all: {}
            },
            {
              range: {
                "@timestamp": {
                  gte: 1514732400000,
                  lte: 1517410799999,
                  format: "epoch_millis"
                }
              }
            }
          ],
          filter: [],
          should: [],
          must_not: []
        }
      },
      highlight: {
        pre_tags: ["@kibana-highlighted-field@"],
        post_tags: ["@/kibana-highlighted-field@"],
        fields: {
          "*": {}
        },
        fragment_size: 2147483647
      }
    }
  ]
};

