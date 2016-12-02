/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';

class Popup extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      address: [],
      transferProtocol: 'http://',
      startTime: '5am',
      endTime: '5pm',
      inputAddress: '',
      warning: false,
      newLabel: 'Activate!',
      alarmName: 'auto-url-pinger'
    };
    this.submitAddress = this.submitAddress.bind(this);
    this.toggleAlarm = this.toggleAlarm.bind(this);
  }

  componentDidMount(){
    chrome.storage.sync.get('pinger-addresses', (data)=>{
      let response = data['pinger-addresses'];
      if(response){
        if(response.length > 0){
          let address = response.concat(this.state.address);
          this.setState({address: address});
        }
      }
    });
    chrome.alarms.getAll(alarms=>{
      let has = alarms.some(a=>{
        return a.name === this.state.alarmName;
      });
      if(has){
        this.setState({newLabel: 'Cancel'});
      }
    });
  }

  submitAddress(e){
    e.preventDefault();
    if(!this.state.inputAddress){
      this.setState({warning: true});
    } else {
      let address = this.state.address.concat(
        [this.state.transferProtocol + this.state.inputAddress + '/']
      );
      chrome.storage.sync.set({'pinger-addresses': address});
      this.setState({
        address: address,
        inputAddress: '',
        warning: false
      });
    }
  }

  showAddressList(){
    if(!this.state.address.length){
      return(<div>No address saved</div>);
    } else {
      return (
        this.state.address.map((add, i)=>{
          return(
            <li type='1' key={`address-${i}`}>{add}</li>
          );
        })
      );
    }
  }

  showAddressInput(){
    let http = 'http://', https = 'https://';
    return(
      <form onSubmit={this.submitAddress} autoComplete='off'>
        <select id="transfer-protocol"
                onChange={this.update('transferProtocol')}>
                <option>{http}</option>
                <option>{https}</option>
        </select>
          <input type='text'
                 placeholder='address'
                 value={this.state.inputAddress}
                 onChange={this.update('inputAddress')}
                 id='address-input'/>
          <input type='submit' value=""/>
          <div className='address-input-buttons'>
            <div className='address-input-box-submit'
              onClick={this.submitAddress}>
              <img src='../../../assets/icon/plus.png'
                width='10'
                height='10'/>
            </div>
          </div>
        </form>
    );
  }

  showWarning(){
    if(this.state.warning){
      return(
        <span>Please put in an address!</span>
      );
    }
  }

  toggleAlarm(){
    chrome.alarms.getAll(alarms=>{
      let hasAlarm = alarms.some(a=>{
        return a.name === this.state.alarmName;
      });
      if (hasAlarm) {
        this.setState({newLabel: 'Activate!'});
        chrome.alarms.clear(this.state.alarmName);
      } else {
        this.setState({newLabel: 'Cancel'});
        chrome.alarms.create(
          this.state.alarmName,
          {delayInMinutes: 0.1, periodInMinutes: 0.1}
        );
        let start = parseInt(this.state.startTime.split('am').join(''));
        let end = parseInt(this.state.endTime.split('pm').join(''));
        chrome.storage.sync.set(
          {'pinger-start-end-times': [start, end]}
        );
      }
    });
  }

  showAlarm(){
    if(this.state.address.length > 0){
      return (
        <div onClick={this.toggleAlarm}>
          {this.state.newLabel}
        </div>
      );
    }
  }

  update(field){
    return e => { this.setState({[field]: e.currentTarget.value }); };
  }

  render(){
    return(
      <div id='container'>
        <div id='address-list'>
          <ol>
            {this.showAddressList()}
          </ol>
        </div>
        <div id='add-address'>
          {this.showAddressInput()}
          {this.showWarning()}
        </div>
        <div id='time-range'>
          <span>From</span>
          <select id="hours"
                  onChange={this.update('startTime')}>
                  <option>5am</option>
                  <option>6am</option>
                  <option>7am</option>
                  <option>8am</option>
                  <option>9am</option>
                  <option>10am</option>
          </select>
          <span>To</span>
          <select id="hours"
                  onChange={this.update('endTime')}>
                  <option>5pm</option>
                  <option>6pm</option>
                  <option>7pm</option>
                  <option>8pm</option>
                  <option>9pm</option>
                  <option>10pm</option>
          </select>
        </div>
        <div id='start'>
          {this.showAlarm()}
        </div>
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const root = document.getElementById('root');
  ReactDOM.render(<Popup />, root);
});
