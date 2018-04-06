import React from 'react';
import {Header, Tab, Modal, Button} from 'semantic-ui-react';
import AbnormalUser from './abnormal_user';
import AbnormalInternalIP from './abnormal_internal_ip';
import AbnormalExternalIP from './abnormal_external_ip';
import {Line} from 'react-chartjs-2';

export default class ThxAbnormalHome extends React.Component {
  constructor(props) {
    super(props);
  };

  state = {
    showModal: false,
    dataId: null,
    dataType: null,
  };

  renderChangeChartByUser() {
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: '홍길동',
          fill: false,
          lineTension: 0.1,
          //backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: '#3cba9f',//'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [10, 59, 40, 81, 56, 55, 40]
        },
        {
          label: '손기철',
          fill: false,
          lineTension: 0.1,
          //backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: '#e8c3b9',//'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [20, 49, 70, 60, 36, 75, 40]
        }
      ]
    };

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
      <Line data={data} options={options} width={400} height={200}/>
    )
  }

  renderChangeChartByIP() {
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: '192.168.0.1',
          fill: false,
          lineTension: 0.1,
          //backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: '#3e95cd',//'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: '192.168.0.2',
          fill: false,
          lineTension: 0.1,
          //backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: '#8e5ea2',//'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [60, 70, 20, 10, 95, 55, 30]
        }
      ]
    };

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
      <Line data={data} options={options} width={400} height={200}/>
    )
  }

  panes = [
    {menuItem: '사용자', render: () => <AbnormalUser handleOpenModal={this.handleOpenModal}/>},
    {menuItem: '내부 IP', render: () => <AbnormalInternalIP handleOpenModal={this.handleOpenModal}/>},
    {menuItem: '외부 IP', render: () => <AbnormalExternalIP handleOpenModal={this.handleOpenModal}/>},
  ];

  handleSearchClick() {
    //alert('handleSearchClick');
  };

  handleCloseModal = () =>  this.setState({showModal: false});

  handleOpenModal = (dataId, dataType) => {
    console.log('handleOpenModal : ' + dataId);
    console.log('handleOpenModal : ' + dataType);
    this.setState({dataId: dataId});
    this.setState({dataType: dataType});

    this.setState({showModal: true});
  };

  renderChangeChart() {
    const {dataId,dataType} = this.state;
    if(dataType === 'user') {
      return this.renderChangeChartByUser();
    } else {
      return this.renderChangeChartByIP();
    }
  }

  renderModal() {
    const {showModal} = this.state;
    return (
      <Modal className='scrolling' open={showModal} onClose={this.handleCloseModal}>
        <Modal.Header>상세보기</Modal.Header>
        <Modal.Content>
          {this.renderChangeChart()}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleCloseModal}>확인</Button>
        </Modal.Actions>
      </Modal>
    )
  }


  render() {
    return (
      <div className='container'>
        <Header as='h3'>이상행동</Header>
        <Tab menu={{pointing: true}} style={{marginTop: '26px'}} panes={this.panes}/>
        {this.renderModal()}
      </div>
    )
  }
}

