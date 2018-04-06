import React from 'react';
import {Header, Form, Input, Tab, Icon, Table, Button, Menu, Select} from 'semantic-ui-react';
import {RIGHT_ALIGNMENT} from "ui_framework/services";
import moment from 'moment';

export default class AbnormalUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fromDate: moment(new Date()).format('YYYY-MM-DD'),
      toDate: moment(new Date()).format('YYYY-MM-DD'),
    };
  }

  state = {
    userId: null,
    showModal: false
  };

  header = [
    {
      content: '접속 일시',
      sorted: 'descending',
    },
    '사용자 ID',
    '이름',
    'IP',
    '시스템',
    '검출 정책',
    '검출 건수',
    '위험도',
    '추이 분석',
  ];

  rows = [
    {
      id: '1',
      cells: [
        {
          content: "2017-11-25 12:56:15",
        },
        'admin',
        '홍길동',
        '192.168.0.1',
        '홈페이지',
        '정책1',
        {
          content: '1',
          textAlign: RIGHT_ALIGNMENT,
        },
        '정상',
        {
          content: <Button size="small" onClick={(event, props) => {
            this.handleButtonClick(event, props);
          }}>상세 보기1</Button>,
          textAlign: "center",
        }
      ]
    },
    {
      id: '2',
      cells: [
        '2016-11-30 12:56:15',
        'user1',
        '박보검',
        '192.168.0.1',
        '홈페이지',
        '정책2',
        {
          content: '10',
          textAlign: RIGHT_ALIGNMENT
        },
        '관심',
        {
          content: <Button size="small">상세 보기</Button>,
          textAlign: "center",
        }
      ]
    },
    {
      id: '3',
      cells: [
        '2016-11-30 12:56:15',
        'admin',
        '홍길동',
        '192.168.0.1',
        '홈페이지',
        '정책2',
        {
          content: '20',
          textAlign: RIGHT_ALIGNMENT
        },
        '심각',
        {
          content: <Button size="small">상세 보기</Button>,
          textAlign: "center",
        }
      ]
    },
    {
      id: '4',
      cells: [
        '2016-11-30 12:56:15',
        'admin',
        '홍길동',
        '192.168.0.1',
        '홈페이지',
        '정책1',
        {
          content: '1',
          textAlign: RIGHT_ALIGNMENT
        },
        '정상',
        {
          content: <Button size="small">상세 보기</Button>,
          textAlign: "center",
        }
      ]
    }
  ];

  handleButtonClick = (props) => {
    //const {data-userId, data-type} = props;
    //console.log(userId);
    const dataId = props['data-userId'];
    const dataType = props['data-type'];

    this.props.handleOpenModal(dataId, dataType);
  };

  renderCells(cells) {
    return cells.map((cell, index) => {
      let {content, ...props} = cell;
      if (index === 8) {
        content = <Button size="small" data-userId={cells[1]} data-type='user' onClick={(event, data) => this.handleButtonClick(data)}>상세 보기</Button>;
      } else {
        if (React.isValidElement(cell) || !_.isObject(cell)) {
          props = [];
          content = cell;
        }
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

  renderColGroup() {
    return (
      <colgroup>
        <col style={{width: '15%'}}/>
        <col/>
        <col/>
        <col/>
        <col/>
        <col/>
        <col/>
        <col style={{width: '8%'}}/>
        <col/>
      </colgroup>
    )
  }

  render() {
    const selectOption = [{value: '0', text: '-'},{value: '1', text: '정상'}, {value: '2', text: '관심'}, {value: '3', text: '주의'}, {value: '4', text: '경계'}, {value: '5', text: '심각'}];
    const {fromDate, toDate} = this.state;
    return (
      <div>
        <Tab.Pane style={{border: 0, padding: 0}} attached={false}>
          <Header style={{paddingTop: '18px'}} block={true}>
            <Form>
              <Form.Group inline>
                <Form.Field>
                  <label style={{fontSize: '14px', width: '40px'}}>기 간</label>
                  <Input value={fromDate} type='date' placeholder='From' size='mini' onChange={(event, {value}) => {
                    this.setState({fromDate: value});
                  }}/>
                  {'  ~  '}
                  <Input value={toDate} type='date' placeholder='To' size='mini' onChange={(event, {value}) => {
                    this.setState({toDate: value});
                  }}/>
                </Form.Field>
                <Form.Field>
                  <label style={{fontSize: '14px', width: '45px'}}>위험도</label>
                  <Select style={{width: 'calc(100% - 65px)'}} options={selectOption} defaultValue={selectOption[0].value}/>
                </Form.Field>
                <Form.Field>
                  <label style={{fontSize: '14px', width: '65px'}}>사용자 ID</label>
                  <Input style={{width: 'calc(100% - 85px)'}} placeholder='내부 IP'/>
                </Form.Field>
                <Form.Field>
                  <label style={{fontSize: '14px', width: '45px'}}>시스템</label>
                  <Input style={{width: 'calc(100% - 65px)'}} placeholder='시스템'/>
                </Form.Field>
                <Icon link circular name='search' size='small' title='검색' onClick={() => {
                  this.handleSearchClick()
                }}/>
              </Form.Group>
            </Form>
          </Header>
          <Table celled={true} fixed={true} sortable={true}>
            {this.renderColGroup()}
            <Table.Header>
              <Table.Row>
                {
                  this.header.map((cell, index) => {
                    let {content, ...props} = cell;
                    if (React.isValidElement(cell) || !_.isObject(cell)) {
                      props = [];
                      content = cell;
                    }
                    return (
                      <Table.HeaderCell key={index} {...props}>
                        {content}
                      </Table.HeaderCell>
                    )
                  })
                }
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                this.rows.map((row, index) => {
                  return (
                    <Table.Row key={index}>
                      {this.renderCells(row.cells)}
                    </Table.Row>
                  )
                })
              }
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan='9'>
                  <Menu floated='right' pagination>
                    <Menu.Item as='a' icon>
                      <Icon name='left chevron'/>
                    </Menu.Item>
                    <Menu.Item as='a'>1</Menu.Item>
                    <Menu.Item as='a'>2</Menu.Item>
                    <Menu.Item as='a'>3</Menu.Item>
                    <Menu.Item as='a'>4</Menu.Item>
                    <Menu.Item as='a' icon>
                      <Icon name='right chevron'/>
                    </Menu.Item>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Tab.Pane>
      </div>
    )
  }
}
