import React from 'react';
import ChangeChartByIP from './change_chart_ip';
import TopTableByIP from './top_table_ip';

export default class DataByIP extends React.Component {
  constructor(props) {
    super(props);

    this.state = DataByIP.gState;
  }

  static gState = {
    aggrType: 'IP'
  };

  componentWillUnmount() {
    DataByIP.gState = this.state;
  }

  handleAggrTypeChange = (value) => {
    this.setState({aggrType: value});
  };

  renderVisType() {
    const visTypes = [
      {key: 'a', Component: ChangeChartByIP},
      {key: 'c', Component: TopTableByIP}
    ];
    return visTypes.map((visType,index) => {
      const Component = visType.Component;
      return (
        <Component key={index}
                   httpClient={this.props.httpClient}
                   interval={this.props.interval}
                   handleAggrTypeChange={this.handleAggrTypeChange}
                   chartType={this.state.aggrType}
                   refreshInterval={this.props.refreshInterval}/>
      )
    })
  }

  render() {
    return (
      <div>
        {this.renderVisType()}
      </div>
    )
  };
}

