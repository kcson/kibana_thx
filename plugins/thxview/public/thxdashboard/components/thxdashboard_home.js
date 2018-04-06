import React from 'react';
import {Header, Segment, Divider, Form, Radio, Input, Select} from 'semantic-ui-react'
import ReactGridLayout from 'react-grid-layout';
import {Measured} from 'remeasure';
import ChangeCharByPattern from './change_chart_pattern';
import TopTableByPattern from './top_table_pattern';
import DataByIP from './data_ip';
import TotalSum from './total_sum';

export default class ThxDashboardHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      radioValue: '1',
      refreshInterval: '1'
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.radioValue !== nextState.radioValue) {
      return true;
    }
    if (this.state.refreshInterval !== nextState.refreshInterval) {
      return true;
    }
    return false;
  }


  radioChange = (e, {value}) => {
    this.setState({radioValue: value})
  };

  selectChange = (e, {value}) => {
    this.setState({refreshInterval: value});
  };

  render() {
    const layout = [
      {i: 'a', x: 0, y: 0, w: 5, h: 38, isResizable: false}, {i: 'b', x: 5, y: 0, w: 5, h: 14, isResizable: false},
    ];
    const {radioValue, refreshInterval} = this.state;
    const selectOption = [{key: 1, value: '1', text: '1분'}, {key: 5, value: '5', text: '5분'}, {key: 10, value: '10', text: '10분'}, {key: 30, value: '30', text: '30분'}, {key: 0, value: '0', text: '사용안함'}];

    return (
      <div className='container'>
        <Header as='h3'>대시보드</Header>
        <Segment padded={true} style={{marginTop: '26px', marginBottom: '7px'}}>
          <TotalSum httpClient={this.props.httpClient} refreshInterval={refreshInterval}/>
        </Segment>
        <Segment style={{padding: 0}}>
          <Form style={{display: 'flex', paddingLeft: '10px', paddingTop: '12px'}}>
            <Form.Group inline>
              <label style={{fontSize: '14px'}}>최 근</label>
              <Form.Field control={Radio} label='30분' value='1' checked={radioValue === '1'} onChange={this.radioChange}/>
              <Form.Field control={Radio} label='1시간' value='2' checked={radioValue === '2'} onChange={this.radioChange}/>
              <Form.Field control={Radio} label='6시간' value='3' checked={radioValue === '3'} onChange={this.radioChange}/>
              <Form.Field control={Radio} label='오늘' value='4' checked={radioValue === '4'} onChange={this.radioChange}/>
            </Form.Group>
            <Form.Group inline>
              <Form.Field>
                <label style={{fontSize: '14px'}}>시스템</label>
                <Input placeholder='시스템'/>
              </Form.Field>
              <Form.Field>
                <label style={{fontSize: '14px'}}>갱신 주기</label>
                <Select style={{width: '100px'}} options={selectOption} value={refreshInterval} onChange={this.selectChange}/>
              </Form.Field>
            </Form.Group>
          </Form>
          <Divider style={{marginTop: 0, marginBottom: 0}}/>
          <Measured>
            {({height, width}) => {
              return (
                <ReactGridLayout layout={layout} cols={10} rowHeight={5} width={width}>
                  <div key="a">
                    <DataByIP httpClient={this.props.httpClient} interval={this.state.radioValue} refreshInterval={refreshInterval}/>
                  </div>
                  <div key="b">
                    <ChangeCharByPattern httpClient={this.props.httpClient} interval={this.state.radioValue} refreshInterval={refreshInterval}/>
                    <TopTableByPattern httpClient={this.props.httpClient} interval={this.state.radioValue} refreshInterval={refreshInterval}/>
                  </div>
                </ReactGridLayout>
              )
            }}
          </Measured>
        </Segment>
      </div>
    )
  }
}
