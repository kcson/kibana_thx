import React from 'react';
import PropTypes from "prop-types";
import {RIGHT_ALIGNMENT} from "ui_framework/services";
import {
  Table,
  Icon,
  Button,
  Form,
  Input,
  Radio,
  Header,
  Pagination,
  Modal,
  Label
} from 'semantic-ui-react';

import moment from 'moment';
import 'moment-timezone';
import {saveAs} from '@elastic/filesaver';

export default class ThxDiscoverHome extends React.Component {
  //let httpClient;
  constructor(props) {
    super(props);
    this.state = {
      system: "",
      policy: "",
      keyword: "",
      radioValue: '1',
      fromDate: moment(new Date()).format('YYYY-MM-DD'),
      toDate: moment(new Date()).format('YYYY-MM-DD'),
      rows: [],
      inputDisabled: true,
      totalPage: 0,
      activePage: 1,
      showModal: false,
      detectedDatas: []
    };

    this.header = [
      {
        content: '접속 일시',
        sorted: 'descending',
      },
      '사용자 ID',
      '이름',
      'IP',
      '시스템',
      '검출 정책',
      '접근 페이지',
      '검출 건수',
      '검출 데이터',
    ];
  }

  componentDidMount() {
    this.searchData();
  }

  componentWillUnmount() {
  }

  handleCloseModal = () => {
    this.setState({showModal: false})
  };

  showModal = () => {
    return (
      <Modal className='scrolling' open={this.state.showModal}>
        <Modal.Header>세부정보</Modal.Header>
        <Modal.Content scrolling>
          <Table basic='very' selectable>
            <Table.Body>
              {
                this.detectedDatas.map((detected, i) => {
                  return (
                    <Table.Row key={i}>
                      <Table.Cell verticalAlign='middle' width={1}><Label color='grey' horizontal>{detected.pattern}</Label></Table.Cell>
                      <Table.Cell textAlign='left' verticalAlign='middle'>
                        <Label.Group>
                          {
                            detected.data.map((d, k) => {
                              return (
                                <Label key={k} basic>{d}</Label>
                              )
                            })
                          }
                        </Label.Group>
                      </Table.Cell>
                    </Table.Row>
                  )
                })
              }
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleCloseModal}>확인</Button>
        </Modal.Actions>
      </Modal>
    )
  };

  detectedDatas = [];
  handleButtonClick = (props) => {
    console.log(props['data-detected']);
    this.detectedDatas = props['data-detected'];
    this.setState({showModal: true});
  };

  searchData() {
    //console.log(chrome.getInjected('thxdiscoverDefaultTitle'));
    let fromDate = moment(new Date()).format('YYYY-MM-DD');
    let toDate = moment(new Date()).format('YYYY-MM-DD') + '||/d';
    if (this.state.radioValue === '1') {
      fromDate = fromDate + '||/d';
    } else if (this.state.radioValue === '2') {
      fromDate = fromDate + '||-1w/d';
    } else if (this.state.radioValue === '3') {
      fromDate = fromDate + '||-2w/d';
    } else if (this.state.radioValue === '4') {
      fromDate = fromDate + '||-1M/d';
    } else if (this.state.radioValue === '5') {
      fromDate = this.state.fromDate + '||/d';
      toDate = this.state.toDate + '||/d';
    }

    this.props.httpClient(
      {
        method: 'POST',
        url: '../api/thxdiscover/search',
        headers: {
          'x-custom-header': 'xxxxx'
        },
        data: {
          system: this.state.system,
          policy: this.state.policy,
          keyword: this.state.keyword,
          fromDate: fromDate,
          toDate: toDate,
          timeZone: moment.tz.guess(),
          from: (this.state.activePage - 1) * 10
        }
      }
    ).then(
      (res) => {
        console.log(res);
        let totalPage = 0;
        if (res.data.hits.total > 0) {
          totalPage = Math.ceil(res.data.hits.total / 10);
        }
        this.setState({totalPage});

        const results = [];
        res.data.hits.hits.map((hit) => {
          const logDate = moment.tz(hit._source['@timestamp'], moment.tz.guess());
          let path = '-';
          if (hit._source.path) {
            path = hit._source.path;
          }
          if (!hit._source.detected) {
            hit._source.detected = []
          }

          results.push({
            id: hit._id,
            cells: [
              logDate.format('YYYY-MM-DD HH:mm:ss'),
              hit._source.client_ip,
              hit._source.client_ip,
              hit._source.client_ip,
              {
                content: hit._source.ip,
                title: hit._source.ip
              },
              '정책1',
              {
                content: path,
                title: path
              },
              {
                content: '1',
                textAlign: RIGHT_ALIGNMENT
              },
              {
                content: <Button size="small" data-detected={hit._source.detected} onClick={(event, data) => {
                  this.handleButtonClick(data)
                }}>상세 보기</Button>,
                textAlign: "center",
              }
            ]
          });
        });
        this.setState({rows: results});
      },
      (err) => {
        console.log(err);
        alert(err);
      }
    );
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
      return (
        <Table.Row>
          <td colSpan={9} className='center aligned'>검색 결과가 없습니다.</td>
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
        <col style={{width: '13%'}}/>
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

  handlePageChange = (e, {activePage}) => {
    this.setState({activePage}, () => {
      this.searchData();
    });
  };

  renderTablePage() {
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan='9'>
            <Pagination
              floated='right'
              activePage={this.state.activePage}
              boundaryRange={2}
              siblingRange={2}
              firstItem={null}
              lastItem={null}
              prevItem={{content: <Icon name='left chevron'/>, icon: true}}
              nextItem={{content: <Icon name='right chevron'/>, icon: true}}
              totalPages={this.state.totalPage}
              onPageChange={this.handlePageChange}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  handleRadioChange = (e, {value}) => {
    this.setState({radioValue: value});
    if (value === '5') {
      this.setState({inputDisabled: false})
    } else {
      this.setState({inputDisabled: true})
    }
  };

  handleSystemChange = (e, {value}) => {
    this.setState({system: value});
  };

  handlePolicyChange = (e, {value}) => {
    this.setState({policy: value});
  };

  handleKeywordChange = (e, {value}) => {
    this.setState({keyword: value});
  };

  handleSearchClick() {
    this.setState({activePage: 1}, () => {
      this.searchData();
    });
  };

  handleExport = () => {
    this.exportData();
  };

  exportData() {
    //console.log(chrome.getInjected('thxdiscoverDefaultTitle'));
    let fromDate = moment(new Date()).format('YYYY-MM-DD');
    let toDate = moment(new Date()).format('YYYY-MM-DD') + '||/d';
    if (this.state.radioValue === '1') {
      fromDate = fromDate + '||/d';
    } else if (this.state.radioValue === '2') {
      fromDate = fromDate + '||-1w/d';
    } else if (this.state.radioValue === '3') {
      fromDate = fromDate + '||-2w/d';
    } else if (this.state.radioValue === '4') {
      fromDate = fromDate + '||-1M/d';
    } else if (this.state.radioValue === '5') {
      fromDate = this.state.fromDate + '||/d';
      toDate = this.state.toDate + '||/d';
    }

    this.props.httpClient(
      {
        method: 'POST',
        url: '../api/thxdiscover/export',
        headers: {
          'x-custom-header': 'xxxxx'
        },
        data: {
          system: this.state.system,
          policy: this.state.policy,
          keyword: this.state.keyword,
          fromDate: fromDate,
          toDate: toDate,
          timeZone: moment.tz.guess(),
        }
      }
    ).then(
      (res) => {
        const currentDate = moment(new Date());
        const filename = `export.${currentDate.format('YYYY-MM-DD')}.csv`;
        let blob = new Blob([res.data], {
          type: 'text/csv;charset=utf-8'
        });
        saveAs(blob, filename);
      },
      (err) => {
        console.log(err);
        alert(err);
      }
    );
  }

  render() {
    const {radioValue, fromDate, toDate, inputDisabled, system, policy, keyword} = this.state;
    return (
      <div className="container">
        <Header as='h3'>통합 로그</Header>
        <Header block>
          <Form>
            <Form.Group widths='equal'>
              <Form.Field inline>
                <label style={{fontSize: '14px', width: '45px'}}>시스템</label>
                <Input style={{width: 'calc(100% - 65px)'}} placeholder='시스템' value={system} onChange={this.handleSystemChange}/>
              </Form.Field>
              <Form.Field inline>
                <label style={{fontSize: '14px', width: '65px'}}>검출 정책</label>
                <Input style={{width: 'calc(100% - 85px)'}} placeholder='검출 정책' value={policy} onChange={this.handlePolicyChange}/>
              </Form.Field>
              <Form.Field inline>
                <label style={{fontSize: '14px', width: '45px'}}>키워드</label>
                <Input style={{width: 'calc(100% - 65px)'}} placeholder='키워드' value={keyword} onChange={this.handleKeywordChange}/>
              </Form.Field>
            </Form.Group>
            <Form.Group style={{marginBottom: 0}} inline>
              <label style={{fontSize: '14px', width: '45px'}}>기 간</label>
              <Form.Field style={{marginTop: '5px'}} control={Radio} label='오늘' value='1' checked={radioValue === '1'} onChange={this.handleRadioChange}/>
              <Form.Field style={{marginTop: '5px'}} control={Radio} label='1주' value='2' checked={radioValue === '2'} onChange={this.handleRadioChange}/>
              <Form.Field style={{marginTop: '5px'}} control={Radio} label='2주' value='3' checked={radioValue === '3'} onChange={this.handleRadioChange}/>
              <Form.Field style={{marginTop: '5px'}} control={Radio} label='한달' value='4' checked={radioValue === '4'} onChange={this.handleRadioChange}/>
              <Form.Field style={{marginTop: '5px'}} control={Radio} label='기간 지정' value='5' checked={radioValue === '5'} onChange={this.handleRadioChange}/>
              <Input disabled={inputDisabled} value={fromDate} type='date' placeholder='From' size='mini' onChange={(event, {value}) => {
                this.setState({fromDate: value})
              }}/>
              {'   ~   '}
              <Input disabled={inputDisabled} value={toDate} type='date' placeholder='To' size='mini' onChange={(event, {value}) => {
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
        <Button onClick={this.handleExport} basic={true} as='div' color='blue' size='small' floated='right' style={{marginBottom: '5px'}}>
          <Icon fitted size='large' name='file excel outline'/>
          엑셀 저장
        </Button>
        <Table celled fixed={true} sortable={true}>
          {this.renderColGroup()}
          {this.renderHeader()}
          {this.renderBody()}
          {this.renderTablePage()}
        </Table>
        {this.showModal()}
      </div>
    )
  }
}

ThxDiscoverHome.propTypes = {
  addBasePath: PropTypes.func.isRequired,
  httpClient: PropTypes.func.isRequired
};
