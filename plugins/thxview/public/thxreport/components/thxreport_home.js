import React from 'react';
import PropTypes from "prop-types";
import {
  Table,
  Icon,
  Button,
  Form,
  Input,
  Radio,
  Header
} from 'semantic-ui-react';

import moment from 'moment';
import 'moment-timezone';
import {saveAs} from "@elastic/filesaver/file-saver";

export default class ThxDiscoverHome extends React.Component {
  //let httpClient;
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      selectedRowIds: [],
      radioValue: '1',
      fromDate: moment(new Date().toISOString()).format('YYYY-MM-DD'),
      toDate: moment(new Date().toISOString()).format('YYYY-MM-DD'),
    };

    this.header = [
      {
        content: '일자',
        sorted: 'descending',
      },
      '시스템',
      '합계',
      '이메일',
      '주민번호',
      '전화번호'
    ];

    this.rows = [
      {
        id: '1',
        cells: [
          '2017-11-30', '그룹웨어', 1, 0, 4, 5, 9, 10
        ]
      },
      {
        id: '2',
        cells: [
          '2018-01-01', '온나라', 0, 0, 4, 5, 9, 10
        ]
      },
      {
        id: '3',
        cells: [
          '2018-01-02', '지방세 시스템', 1, 0, 4, 5, 9, 10
        ]
      },
      {
        id: '4',
        cells: [
          '2018-01-03', '지방세 시스템', 100, 0, 2, 5, 9, 10
        ]
      }
    ];
  }

  componentDidMount() {
    this.searchData();
  }

  componentWillUnmount() {
  }

  searchData() {
    const currentDate = new Date();
    let fromDate = "";
    let toDate = moment(currentDate).format("YYYY-MM-DD") + '||/d';
    switch (this.state.radioValue) {
      case '1':
        fromDate = moment(currentDate).startOf('week').format('YYYY-MM-DD') + '||/d';
        break;
      case '2':
        fromDate = moment(currentDate).startOf('month').format('YYYY-MM-DD') + '||/d';
        break;
      case '3':
        fromDate = moment(currentDate).startOf('quarter').format('YYYY-MM-DD') + '||/d';
        break;
      case '4':
        fromDate = moment(currentDate).startOf('year').format('YYYY-MM-DD') + '||/d';
        break;
      case '5':
        fromDate = this.state.fromDate + '||/d';
        toDate = this.state.toDate + '||/d';
        break;
      default:
        fromDate = moment(currentDate).startOf('week').format('YYYY-MM-DD') + '||/d';

    }
    this.props.httpClient(
      {
        method: 'POST',
        url: '../api/thxreport/stat',
        data: {
          fromDate: fromDate,
          toDate: toDate,
          timeZone: moment.tz.guess(),
          format: 'yyyy-MM-dd',
          size: 50
        }
      }
    ).then(
      (res) => {
        const results = [];
        res.data.aggregations["6"].buckets.map((bucket, i) => {
          const date = moment(bucket.key).format('YYYY-MM-DD');
          bucket["7"].buckets.map((subBucket, j) => {
            const cells = [];
            cells.push(date);
            cells.push(subBucket.key);
            cells.push(subBucket["2"].value);
            cells.push(subBucket["3"].value);
            cells.push(subBucket["4"].value);
            cells.push(subBucket["5"].value);

            results.push({
              id: j,
              cells: cells
            })
          })
        });
        this.setState({rows: results});
      },
      (err) => {
        console.log(err);
        if(err.status === 403) {
          window.location.href = 'thxreport';
          //window.location.reload(true);
        }
      }
    )
  }

  renderHeaderCell() {
    return (
      this.header.map((cell, index) => {
        let {content, ...props} = cell;
        if (React.isValidElement(cell) || !_.isObject(cell)) {
          props = [];
          content = cell;
        }
        return (
          <Table.HeaderCell
            key={index}
            {...props}
          >
            {content}
          </Table.HeaderCell>
        )
      })
    )
  }

  renderHeader() {
    return (
      <Table.Header>
        <Table.Row>
          {this.renderHeaderCell()}
        </Table.Row>
      </Table.Header>
    )
  }

  renderBody() {
    return (
      <Table.Body>
        {this.renderTableRows()}
      </Table.Body>
    )
  }

  renderCells(cells) {
    return cells.map((cell, index) => {
      let {content, ...props} = cell;
      if (React.isValidElement(cell) || !_.isObject(cell)) {
        props = [];
        content = cell;
      }
      return (
        <Table.Cell
          key={index}
          {...props}
        >
          {content}
        </Table.Cell>
      );
    });
  }

  renderTableRows() {
    if (this.state.rows.length === 0) {
      const rowCount = this.header.length;
      return (
        <Table.Row>
          <td colSpan={rowCount} className='center aligned'>검색 결과가 없습니다.</td>
        </Table.Row>
      );
    } else {
      return this.state.rows.map((row, rowIndex) => {
        return (
          <Table.Row key={rowIndex}>
            {this.renderCells(row.cells)}
          </Table.Row>
        );
      });
    }
  }

  renderColGroup() {
    return (
      <colgroup>
        <col style={{width: '15%'}}/>
        <col/>
        <col/>
        <col/>
        <col/>
        <col/>
        <col style={{width: '15%'}}/>
        <col style={{width: '8%'}}/>
        <col/>
      </colgroup>
    )
  }

  radioChange = (e, {value}) => {
    this.setState({radioValue: value})
  };

  handleSearchClick() {
    this.searchData();
  }

  handleReportClick = () => {
    this.fetchReport();
  };

  fetchReport() {
    const currentDate = new Date();
    let fromDate = "";
    let toDate = moment(currentDate).format("YYYY-MM-DD") + '||/d';
    switch (this.state.radioValue) {
      case '1':
        fromDate = moment(currentDate).startOf('week').format('YYYY-MM-DD') + '||/d';
        break;
      case '2':
        fromDate = moment(currentDate).startOf('month').format('YYYY-MM-DD') + '||/d';
        break;
      case '3':
        fromDate = moment(currentDate).startOf('quarter').format('YYYY-MM-DD') + '||/d';
        break;
      case '4':
        fromDate = moment(currentDate).startOf('year').format('YYYY-MM-DD') + '||/d';
        break;
      case '5':
        fromDate = this.state.fromDate + '||/d';
        toDate = this.state.toDate + '||/d';
        break;
      default:
        fromDate = moment(currentDate).startOf('week').format('YYYY-MM-DD') + '||/d';
    }

    this.props.httpClient(
      {
        method: 'POST',
        url: '../api/thxreport/report',
        data: {
          fromDate: fromDate,
          toDate: toDate,
          timeZone: moment.tz.guess(),
          format: 'yyyy-MM-dd',
          size: 50
        },
        //transformResponse: this.transformResponse
      }
    ).then(
      (res) => {
        const currentDate = moment(new Date());
        const filename = `report.${currentDate.format('YYYY-MM-DD')}.xlsx`;
        let blob = new Blob([Buffer.from(res.data,'base64')], {
          type: 'application/octet-stream'
        });
        saveAs(blob, filename);
      },
      (err) => {
        console.log(err);
        if(err.status === 403) {
          window.location.href = 'thxreport';
          //window.location.reload(true);
        }
      }
    )
  }

  transformResponse = (response) => {
    //console.log(response);
    return response;
  };

  render() {
    const {radioValue, fromDate, toDate} = this.state;
    return (
      <div className="thxcontainer">
        <Header as='h3'>통계/리포트</Header>
        <Header block>
          <Form>
            <Form.Group style={{marginBottom: 0}} inline>
              <label style={{fontSize: '14px', width: '45px'}}>기 간</label>
              <Form.Field style={{marginTop: '5px'}} control={Radio} label='주간' value='1' checked={radioValue === '1'} onChange={this.radioChange}/>
              <Form.Field style={{marginTop: '5px'}} control={Radio} label='월간' value='2' checked={radioValue === '2'} onChange={this.radioChange}/>
              <Form.Field style={{marginTop: '5px'}} control={Radio} label='분기' value='3' checked={radioValue === '3'} onChange={this.radioChange}/>
              <Form.Field style={{marginTop: '5px'}} control={Radio} label='반기' value='4' checked={radioValue === '4'} onChange={this.radioChange}/>
              <Form.Field style={{marginTop: '5px'}} control={Radio} label='기간 지정' value='5' checked={radioValue === '5'} onChange={this.radioChange}/>
              <Input value={fromDate} type='date' placeholder='From' size='mini' onChange={(event, {value}) => {
                this.setState({fromDate: value})
              }}/>
              {'   ~   '}
              <Input value={toDate} type='date' placeholder='To' size='mini' onChange={(event, {value}) => {
                this.setState({toDate: value})
              }}/>
              <Form.Field style={{marginLeft: '10px'}}>
                <Icon link circular name='search' size='small' title='검색' onClick={() => {
                  this.handleSearchClick()
                }}/>
              </Form.Field>
            </Form.Group>
          </Form>
        </Header>
        <Button basic={true} as='div' color='blue' size='small' floated='right' style={{marginBottom: '5px'}} onClick={() => {
          this.handleReportClick()
        }}>
          <Icon link fitted size='large' name='file excel outline'/>
          리포트 생성
        </Button>
        <Table celled fixed={true} sortable={true}>

          {this.renderHeader()}

          {this.renderBody()}

        </Table>
      </div>
    )
  }
}

ThxDiscoverHome.propTypes = {
  addBasePath: PropTypes.func.isRequired,
  httpClient: PropTypes.func.isRequired
};
