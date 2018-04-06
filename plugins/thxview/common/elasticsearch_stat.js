export const stat = () => {
  return {
    "body": {
      "size": 0,
      "_source": {
        "excludes": []
      },
      "aggs": {
        "6": {
          "date_histogram": {
            "field": "@timestamp",
            "interval": "1d",
            "time_zone": "Asia/Tokyo",
            "min_doc_count": 1
          },
          "aggs": {
            "7": {
              "terms": {
                "field": "geoip.ip",
                "size": 50,
                "order": {
                  "2": "desc"
                }
              },
              "aggs": {
                "2": {
                  "sum": {
                    "field": "detected_count.total"
                  }
                },
                "3": {
                  "sum": {
                    "field": "detected_count.email"
                  }
                },
                "4": {
                  "sum": {
                    "field": "detected_count.jumin"
                  }
                },
                "5": {
                  "sum": {
                    "field": "detected_count.phone"
                  }
                }
              }
            }
          }
        }
      },
      "stored_fields": ["*"],
      "script_fields": {

      },
      "docvalue_fields": ["@timestamp",
        "http.response.headers.X-Api-Version",
        "tls.server_certificate.not_after",
        "tls.server_certificate.not_before",
        "tls.server_certificate_chain.not_after",
        "tls.server_certificate_chain.not_before"],
      "query": {
        "bool": {
          "must": [{
            "match_all": {

            }
          },
            {
              "exists": {
                "field": "detected_count.total"
              }
            },
            {
              "range": {
                "@timestamp": {
                  "gte": 1521903600000,
                  "lte": 1522508399999,
                  "format": "epoch_millis"
                }
              }
            }],
          "filter": [],
          "should": [],
          "must_not": []
        }
      }
    }
  };
};

export const report = () => {
  return {
    "body": {
      "size": 0,
      "_source": {
        "excludes": []
      },
      "aggs": {
        "4": {
          "terms": {
            "field": "geoip.ip",
            "size": 12,
            "order": {
              "1": "desc"
            }
          },
          "aggs": {
            "1": {
              "sum": {
                "field": "detected_count.email"
              }
            },
            "2": {
              "sum": {
                "field": "detected_count.phone"
              }
            },
            "3": {
              "sum": {
                "field": "detected_count.jumin"
              }
            }
          }
        }
      },
      "stored_fields": ["*"],
      "script_fields": {

      },
      "docvalue_fields": ["@timestamp",
        "http.response.headers.X-Api-Version",
        "tls.server_certificate.not_after",
        "tls.server_certificate.not_before",
        "tls.server_certificate_chain.not_after",
        "tls.server_certificate_chain.not_before"],
      "query": {
        "bool": {
          "must": [{
            "match_all": {

            }
          },
            {
              "range": {
                "@timestamp": {
                  "gte": 1519830000000,
                  "lte": 1522508399999,
                  "format": "epoch_millis"
                }
              }
            }],
          "filter": [],
          "should": [],
          "must_not": []
        }
      }
    }
  };
};

export const reportContent = () => {
  const reportContent =
    '{{#each report}}' +
    '{{#xlsxAdd "xl/worksheets/sheet1.xml" "worksheet.sheetData[0].row"}}' +
    '    <row>' +
    '        <c t="inlineStr"><is><t>{{system}}</t></is></c>' +
    '        <c><v>{{email}}</v></c>' +
    '        <c><v>{{phone}}</v></c>' +
    '        <c><v>{{jumin}}</v></c>' +
    '    </row>' +
    '{{/xlsxAdd}}' +
    '{{/each}}'+
    '{{{xlsxPrint}}}';

  return reportContent;
};
