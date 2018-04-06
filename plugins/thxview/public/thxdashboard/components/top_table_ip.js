import React from 'react';
import {Card, Dropdown, Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

export default class TopTableByIP extends React.Component {
  constructor(props) {
    super(props);

    this.state = TopTableByIP.gState;
  }

  static gState = {
    topType: 'TOP5',
    rows: []
  };

  refreshTimer = null;

  componentDidMount() {
    this.fetchTopNdata();

    const refreshInterval = parseInt(this.props.refreshInterval) * 60 * 1000;
    this.refreshTimer = setInterval(() => {
      this.fetchTopNdata();
    }, refreshInterval);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.chartType !== this.props.chartType) {
      this.fetchTopNdata();
    }
    if (prevState.topType !== this.state.topType) {
      this.fetchTopNdata();
    }

  }

  componentWillUnmount() {
    TopTableByIP.gState = this.state;
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
    }
  }

  fetchTopNdata() {
    const currentDate = new Date();
    let fromDate = moment(currentDate).format('YYYY-MM-DD') + '||/d';
    let toDate = moment(currentDate).format('YYYY-MM-DD') + '||/d';
    let format = 'yyyy-MM-dd';

    switch (this.props.interval) {
      case '1':
        fromDate = moment(currentDate).format('YYYY-MM-DD HH:mm') + '||-30m/m';
        toDate = moment(currentDate).format('YYYY-MM-DD HH:mm') + '||/m';
        format = 'yyyy-MM-dd HH:mm';
        break;
      case '2':
        fromDate = moment(currentDate).format('YYYY-MM-DD HH:mm') + '||-60m/m';
        toDate = moment(currentDate).format('YYYY-MM-DD HH:mm') + '||/m';
        format = 'yyyy-MM-dd HH:mm';
        break;
      case '3':
        fromDate = moment(currentDate).format('YYYY-MM-DD HH:mm') + '||-6h/h';
        toDate = moment(currentDate).format('YYYY-MM-DD HH:mm') + '||/h';
        format = 'yyyy-MM-dd HH:mm';
        break;
      default:
    }

    let size = 5;
    if (this.state.topType === 'TOP5') {
      size = 5;
    } else {
      size = 10;
    }

    this.props.httpClient({
      method: 'POST',
      url: '../api/thxdashboard/topn',
      headers: {
        'x-custom-header': 'xxxxx'
      },
      data: {
        fromDate: fromDate,
        toDate: toDate,
        timeZone: moment.tz.guess(),
        chartType: this.props.chartType,
        format: format,
        size: size
      }
    }).then(
      (res) => {
        const rows = [];
        res.data.aggregations["2"].buckets.map((bucket, i) => {
          console.log(bucket);
          rows.push({
            ip: bucket.key,
            sum: bucket["1"].value,
            avg: bucket["5"].value.toFixed(2),
            min: bucket["4"].value,
            max: bucket["3"].value
          })
        });
        this.setState({rows: rows});
      },
      (err) => {
        console.log(err);
      }
    )
  }

  renderTopTable() {
    let headerResource = this.props.chartType;
    const tableStyle = {fontSize: '13px', border: 0};
    if (this.state.rows.length >= 5) {
      tableStyle.height = '100%';
    }
    const rowStyle = {};
    if (this.state.rows.length < 5) {
      rowStyle.height = '39px';
    }

    return (
      <Table padded={true} celled={false} striped={true} singleLine={true} style={tableStyle}>
        <Table.Header>
          <Table.Row style={{height: '30px'}}>
            <Table.HeaderCell style={{padding: 0}}>{headerResource}</Table.HeaderCell>
            <Table.HeaderCell style={{padding: 0}}>건수</Table.HeaderCell>
            <Table.HeaderCell style={{padding: 0}}>Avg</Table.HeaderCell>
            <Table.HeaderCell style={{padding: 0}}>Min</Table.HeaderCell>
            <Table.HeaderCell style={{padding: 0}}>Max</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.state.rows.map((row, i) =>
            <Table.Row key={i} style={rowStyle}>
              <Table.Cell verticalAlign='middle' style={{padding: 0}}>{row.ip}</Table.Cell>
              <Table.Cell verticalAlign='middle' style={{padding: 0}}>{row.sum}</Table.Cell>
              <Table.Cell verticalAlign='middle' style={{padding: 0}}>{row.avg}</Table.Cell>
              <Table.Cell verticalAlign='middle' style={{padding: 0}}>{row.min}</Table.Cell>
              <Table.Cell verticalAlign='middle' style={{padding: 0}}>{row.max}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    )
  }

  handleTypeChange(event, value) {
    this.props.handleAggrTypeChange(value);
  }

  handleTopChange(event, value) {
    this.setState({topType: value});
  }

  render() {
    const dangerOptions = [
      {text: 'IP', value: 'IP'},
      {text: '사용자', value: '사용자'}
    ];

    const topOptions = [
      {text: 'TOP5', value: 'TOP5'},
      {text: 'TOP10', value: 'TOP10'}
    ];

    return (
      <Card fluid style={{marginTop: '10px'}}>
        <Card.Content style={{overflow: 'visible'}}>
          <Card.Header style={{fontSize: '12px', width: '150px'}}>
            <Dropdown onChange={(event, {value}) => {
              this.handleTypeChange(event, value)
            }} upward={false} options={dangerOptions} value={this.props.chartType}/>

            <Card.Content style={{display: 'inline'}}>별 위험 </Card.Content>

            <Dropdown onChange={(event, {value}) => {
              this.handleTopChange(event, value)
            }} options={topOptions} defaultValue={this.state.topType}/>
          </Card.Header>
        </Card.Content>
        <Card.Content style={{height: '234px', padding: 0}}>
          {this.renderTopTable()}
        </Card.Content>
      </Card>
    )
  }
}

TopTableByIP.propTypes = {
  chartType: PropTypes.string.isRequired,
  handleAggrTypeChange: PropTypes.func.isRequired
};
