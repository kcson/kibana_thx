import React from 'react';
import {Card} from 'semantic-ui-react';
import {Line} from 'react-chartjs-2';
import moment from 'moment';
import 'moment-timezone';
import 'twix';

export default class ChangeChartByPattern extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartDatas: {
        labels: [],
        datasets: []
      }
    }
  }

  refreshTimer = null;

  componentDidMount() {
    this.fetchChartData();

    const refreshInterval = parseInt(this.props.refreshInterval) * 60 * 1000;
    this.refreshTimer = setInterval(() => {
      this.fetchChartData();
    }, refreshInterval);
  }

  componentWillUnmount() {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
    }
  }

  getColor(i) {
    //const color = ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"];
    const color = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "a65628", "#f781bf", "#85144b", "#01FF70", "#39CCCC", "#001f3f", "#3D9970", "#111111", "#AAAAAA"];
    const index = i % 15;

    return color[index];
  }

  fetchChartData() {
    const chartDatas = {
      labels: [],
      datasets: []
    };

    const currentDate = new Date();
    let fromDate = moment(currentDate).format('YYYY-MM-DD') + '||/d';
    let toDate = moment(currentDate).format('YYYY-MM-DD') + '||/d';
    let format = 'yyyy-MM-dd';
    let keyFormat = "HH";
    let interval = '1h';

    let itr = moment(moment(currentDate).format('YYYY-MM-DD') + " 00:00").twix(moment(currentDate).format('YYYY-MM-DD HH:mm')).iterate("hours");

    switch (this.props.interval) {
      case '1': //30분
        chartDatas.labels = [];
        itr = moment(moment(currentDate).subtract(30, 'minutes').format('YYYY-MM-DD HH:mm')).twix(moment(currentDate).format('YYYY-MM-DD HH:mm')).iterate("minutes");

        fromDate = moment(currentDate).format('YYYY-MM-DD HH:mm') + '||-30m/m';
        toDate = moment(currentDate).format('YYYY-MM-DD HH:mm') + '||/m';
        format = 'yyyy-MM-dd HH:mm';
        keyFormat = "HH:mm";
        interval = '1m';
        break;
      case '2': //1시간
        chartDatas.labels = [];
        itr = moment(moment(currentDate).subtract(1, 'hours').format('YYYY-MM-DD HH:mm')).twix(moment(currentDate).format('YYYY-MM-DD HH:mm')).iterate("minutes");

        fromDate = moment(currentDate).format('YYYY-MM-DD HH:mm') + '||-60m/m';
        toDate = moment(currentDate).format('YYYY-MM-DD HH:mm') + '||/m';
        format = 'yyyy-MM-dd HH:mm';
        keyFormat = "HH:mm";
        interval = '1m';
        break;
      case '3': //6시간
        chartDatas.labels = [];
        itr = moment(moment(currentDate).subtract(6, 'hours').format('YYYY-MM-DD HH:mm')).twix(moment(currentDate).format('YYYY-MM-DD HH:mm')).iterate("hours");

        fromDate = moment(currentDate).format('YYYY-MM-DD HH:mm') + '||-6h/h';
        toDate = moment(currentDate).format('YYYY-MM-DD HH:mm') + '||/h';
        format = 'yyyy-MM-dd HH:mm';
        keyFormat = "HH";
        interval = '1h';
        break;
      default: //오늘
    }

    while (itr.hasNext()) {
      //console.log(itr.next().format(keyFormat));
      chartDatas.labels.push(itr.next().format(keyFormat));
    }

    this.props.httpClient({
      method: 'POST',
      url: '../api/thxdashboard/chart_pattern',
      headers: {
        'x-custom-header': 'xxxxx'
      },
      data: {
        fromDate: fromDate,
        toDate: toDate,
        timeZone: moment.tz.guess(),
        format: format,
        interval: interval
      }
    }).then(
      (res) => {
        const chartDataObj = {};
        res.data.aggregations["histogram_sum"].buckets.map((bucket, i) => {
          const key = moment(bucket.key).format(keyFormat);
          const keyIndex = chartDatas.labels.indexOf(key);
          bucket.nested_sum.total_sum.buckets.map((pBucket, j) => {
            const pKey = pBucket.key;
            const pChartData = chartDataObj[pKey];
            if(!pChartData) {
              chartDataObj[pKey] = [];
              for (let i = 0; i < chartDatas.labels.length; i++) {
                chartDataObj[pKey].push(0);
              }
            }
            chartDataObj[pKey][keyIndex] = pBucket.pattern_sum.value;
          });
        });

        const objKeys = Object.keys(chartDataObj);
        objKeys.map((objKey,index) => {
          chartDatas.datasets.push({
            label: objKey,
            fill: false,
            lineTension: 0.5,
            backgroundColor: this.getColor(10-index),//'rgba(75,192,192,0.4)',
            borderColor: this.getColor(10-index),//'#8e5ea2',//'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            borderWidth: 2,
            //pointBorderColor: this.getColor(index),
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 3,
            pointHoverBackgroundColor: this.getColor(10-index),
            //pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: chartDataObj[objKey]
          });
        });
        this.setState({chartDatas: chartDatas});
      },
      (err) => {
        console.log(err);
      }
    );
  }

  renderChangeChartByPattern() {
    const options = {
      maintainAspectRatio: false,
      /*scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: '검출 수'
          }
        }]
      }*/

    };

    return (
      <Line data={this.state.chartDatas} options={options} width={400} height={200}/>
    )
  }

  render() {
    return (
      <Card fluid style={{marginBottom: '10px'}}>
        <Card.Content>
          <Card.Header style={{fontSize: '12px'}}>
            <Card.Content style={{display: 'inline'}}>패턴 별 검출 추이</Card.Content>
          </Card.Header>

        </Card.Content>
        <Card.Content style={{height: '234px', padding: 0}}>
          {this.renderChangeChartByPattern()}
        </Card.Content>
      </Card>
    )
  }
}
