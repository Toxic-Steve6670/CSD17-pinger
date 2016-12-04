/* global chrome */
function pinger(addresses, log){
  addresses['pinger-addresses'].forEach(add=>{
    $.ajax({
      method: 'GET',
      url: add,
      success: function(){
        let newLogs = log;
        if(newLogs.length > 145){
          newLogs.pop();
        }
        newLogs.unshift(`${getCurrentTime()} ping to ${add} : success!`);
        chrome.storage.sync.set({'pinger-log': newLogs});
      },
      error: function(err){
        let newLogs = log;
        if(newLogs.length > 145){
          newLogs.pop();
        }
        newLogs.unshift(`${getCurrentTime()} ping to ${add} : failed. Errors(${err})`);
        chrome.storage.sync.set({'pinger-log': newLogs});
      }
    });
  });
}

function pad(s) {
  return (s < 10) ? '0' + s : s;
}

function getCurrentTime(){
  let d = new Date();
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}_${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function getAddresses(logs){
  chrome.storage.sync.get('pinger-addresses', addresses=>{
    pinger(addresses, logs);
  });
}

function getLogs(){
  chrome.storage.sync.get('pinger-log', data=>{
    let logs = [];
    if(data['pinger-log']){
      logs = data['pinger-log'];
    }
    getAddresses(logs);
  });
}

function timeChecker(range){
  let currentHour = new Date().getHours();
  let startHour = range['pinger-start-end-times'][0];
  let endHour = range['pinger-start-end-times'][1] + 12;
  if(currentHour >= startHour && currentHour < endHour){
    getLogs();
  }
}

chrome.alarms.onAlarm.addListener(alarm=>{
  chrome.storage.sync.get('pinger-start-end-times', timeChecker);
});
