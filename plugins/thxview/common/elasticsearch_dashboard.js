export const chartDashBoard = () => {
  return {
    "body": {
      "size": 0,
      "_source": {
        "excludes": []
      },
      "aggs": {
        "chart_by_ip": {
          "terms": {
            "field": "geoip.ip",
            "size": 5,
            "order": {
              "total_sum": "desc"
            }
          },
          "aggs": {
            "total_sum": {
              "sum": {
                "field": "detected_count.total"
              }
            },
            "interval_sum": {
              "date_histogram": {
                "field": "@timestamp",
                "interval": "1h",
                "time_zone": "Asia/Tokyo",
                "min_doc_count": 1
              },
              "aggs": {
                "sum_by_date": {
                  "sum": {
                    "field": "detected_count.total"
                  }
                }
              }
            }
          }
        }
      },
      "stored_fields": ["*"],
      "script_fields": {},
      "query": {
        "bool": {
          "must": [{
            "match_all": {}
          },
            {
              "range": {
                "@timestamp": {
                  "gte": 1521385200000,
                  "lte": 1521471599999,
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

export const chartPatternDashBoard = () => {
  return {
    "body": {
      "size": 0,
      "_source": {
        "excludes": []
      },
      "aggs": {
        "chart_by_pattern": {
          "date_histogram": {
            "field": "@timestamp",
            "interval": "1d",
            "time_zone": "Asia/Tokyo",
            "min_doc_count": 1
          },
          "aggs": {
            "sum_email": {
              "sum": {
                "field": "detected_count.email"
              }
            },
            "sum_jumin": {
              "sum": {
                "field": "detected_count.jumin"
              }
            },
            "sum_phone": {
              "sum": {
                "field": "detected_count.phone"
              }
            }
          }
        },
        "total_email": {
          "sum": {
            "field": "detected_count.email"
          }
        },
        "total_jumin": {
          "sum": {
            "field": "detected_count.jumin"
          }
        },
        "total_phone": {
          "sum": {
            "field": "detected_count.phone"
          }
        }
      },
      "stored_fields": ["*"],
      "script_fields": {},
      "docvalue_fields": ["@timestamp",
        "http.response.headers.X-Api-Version",
        "tls.server_certificate.not_after",
        "tls.server_certificate.not_before",
        "tls.server_certificate_chain.not_after",
        "tls.server_certificate_chain.not_before"],
      "query": {
        "bool": {
          "must": [{
            "match_all": {}
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


export const topNDashBoard = () => {
  return {
    "body": {
      "size": 0,
      "_source": {
        "excludes": []
      },
      "aggs": {
        "2": {
          "terms": {
            "field": "geoip.ip",
            "size": 5,
            "order": {
              "1": "desc"
            }
          },
          "aggs": {
            "1": {
              "sum": {
                "field": "detected_count.total"
              }
            },
            "3": {
              "max": {
                "field": "detected_count.total"
              }
            },
            "4": {
              "min": {
                "field": "detected_count.total"
              }
            },
            "5": {
              "avg": {
                "field": "detected_count.total"
              }
            }
          }
        }
      },
      "stored_fields": ["*"],
      "script_fields": {},
      "docvalue_fields": ["@timestamp",
        "http.response.headers.X-Api-Version",
        "tls.server_certificate.not_after",
        "tls.server_certificate.not_before",
        "tls.server_certificate_chain.not_after",
        "tls.server_certificate_chain.not_before"],
      "query": {
        "bool": {
          "must": [{
            "match_all": {}
          },
            {
              "range": {
                "@timestamp": {
                  "gte": 1521741129424,
                  "lte": 1521744729424,
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
  }
};

export const topNPatternDashBoard = () => {
  return {
    "body": {
      "size": 0,
      "_source": {
        "excludes": []
      },
      "aggs": {
        "email": {
          "stats": {
            "field": "detected_count.email"
          },
          "meta": {
            "name": "이메일"
          }
        },
        "jumin": {
          "stats": {
            "field": "detected_count.jumin"
          },
          "meta": {
            "name": "주민번호"
          }
        },
        "phone": {
          "stats": {
            "field": "detected_count.phone"
          },
          "meta": {
            "name": "전화번호"
          }
        }

      },
      "stored_fields": ["*"],
      "script_fields": {},
      "docvalue_fields": ["@timestamp",
        "http.response.headers.X-Api-Version",
        "tls.server_certificate.not_after",
        "tls.server_certificate.not_before",
        "tls.server_certificate_chain.not_after",
        "tls.server_certificate_chain.not_before"],
      "query": {
        "bool": {
          "must": [{
            "match_all": {}
          },
            {
              "range": {
                "@timestamp": {
                  "gte": 1521903600000,
                  "lte": 1521989999999,
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
  }
};

export const daySumDashBoard = () => {
  return {
    "body": {
      "size": 0,
      "_source": {
        "excludes": []
      },
      "aggs": {
        "total_sum": {
          "sum": {
            "field": "detected_count.total"
          }
        }
      },
      "stored_fields": ["*"],
      "script_fields": {},
      "query": {
        "bool": {
          "must": [{
            "match_all": {}
          },
            {
              "range": {
                "@timestamp": {
                  "gte": 1521385200000,
                  "lte": 1521471599999,
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
  }
};

export const totalSumDashBoard = () => {
  return {
    "body": {
      "size": 0,
      "_source": {
        "excludes": []
      },
      "aggs": {
        "total_sum": {
          "sum": {
            "field": "detected_count.total"
          }
        }
      },
      "stored_fields": ["*"],
      "script_fields": {},
      "query": {
        "bool": {
          "must": [
            {
              "match_all": {}
            }
          ],
          "filter": [],
          "should": [],
          "must_not": []
        }
      }
    }
  }
};
