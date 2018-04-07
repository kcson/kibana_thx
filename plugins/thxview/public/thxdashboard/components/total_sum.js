import React from 'react';
import PropTypes from "prop-types";
import {Statistic, Label} from 'semantic-ui-react'
import moment from 'moment';
import 'moment-timezone';
import 'twix';

export default class TotalSum extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todaySum: 0,
      totalSum: 0
    };
  }

  refreshTimer = null;

  componentDidMount() {
    this.fetchData();

    const refreshInterval = parseInt(this.props.refreshInterval) * 60 * 1000;
    this.refreshTimer = setInterval(() => {
      this.fetchData();
    }, refreshInterval);
  }

  componentWillUnmount() {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
    }
  }

  fetchData() {
    const currentDate = new Date();
    let fromDate = moment(currentDate).format('YYYY-MM-DD') + '||/d';
    let toDate = moment(currentDate).format('YYYY-MM-DD') + '||/d';
    let format = 'yyyy-MM-dd';

    this.props.httpClient({
      method: 'POST',
      url: '../api/thxdashboard/sum',
      data: {
        fromDate: fromDate,
        toDate: toDate,
        timeZone: moment.tz.guess(),
        format: format,
      }
    }).then(
      (res) => {
        console.log(res);
        this.setState({todaySum: this.numberWithCommas(res.data.todaySum), totalSum: this.numberWithCommas(res.data.totalSum)})
      },
      (err) => {
        console.log(err);
        if (err.status === 403) {
          window.location.href = 'thxdashboard';
        }
      }
    )
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    const {todaySum, totalSum} = this.state;
    return (
      <Statistic.Group widths='four'>
        <Statistic>
          <Statistic.Value text style={{paddingTop: '5px'}}>
            <Label circular={true} color='blue' size='massive'>정상</Label>
          </Statistic.Value>
          <Statistic.Label>위험도</Statistic.Label>
        </Statistic>
        <Statistic color='orange'>
          <Statistic.Value>{todaySum}</Statistic.Value>
          <Statistic.Label>금일 검출</Statistic.Label>
        </Statistic>
        <Statistic color='orange'>
          <Statistic.Value>{totalSum}</Statistic.Value>
          <Statistic.Label>누적 검출</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value text style={{paddingTop: '5px'}}>
            <Label circular={true} color='red' size='massive'>위험</Label>
          </Statistic.Value>
          <Statistic.Label>시스템</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    )
  }
}

TotalSum.propTypes = {
  httpClient: PropTypes.func.isRequired,
  refreshInterval: PropTypes.string.isRequired
};
