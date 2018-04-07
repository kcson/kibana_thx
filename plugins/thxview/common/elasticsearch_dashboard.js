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
        "histogram_sum": {
          "date_histogram": {
            "field": "@timestamp",
            "interval": "1h",
            "time_zone": "Asia/Seoul",
            "min_doc_count": 1
          },
          "aggs": {
            "nested_sum": {
              "nested": {
                "path": "detected"
              },
              "aggs": {
                "total_sum": {
                  "terms": {
                    "field": "detected.pattern.keyword",
                    "size": 5,
                    "order": {
                      "pattern_sum": "desc"
                    }
                  },
                  "aggs": {
                    "pattern_sum": {
                      "sum": {
                        "field": "detected.count"
                      }
                    }
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
      "query": {
        "bool": {
          "must": [{
            "match_all": {
            }
          },
            {
              "range": {
                "@timestamp": {
                  "gte": "2018-04-07||/d",
                  "lte": "2018-04-07||/d",
                  "format": "yyyy-MM-dd",
                  "time_zone": "Asia/Seoul"
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
        "nested_sum": {
          "nested": {
            "path": "detected"
          },
          "aggs": {
            "total_sum": {
              "terms": {
                "field": "detected.pattern.keyword",
                "size": 5,
                "order": {
                  "pattern_sum.sum": "desc"
                }
              },
              "aggs": {
                "pattern_sum": {
                  "stats": {
                    "field": "detected.count"
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
                  "gte": "2018-04-07||/d",
                  "lte": "2018-04-07||/d",
                  "format": "yyyy-MM-dd",
                  "time_zone": "Asia/Seoul"
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
