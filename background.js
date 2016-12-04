/* global chrome */
function pinger(addresses, log){
  window.console.log(log);
  addresses['pinger-addresses'].forEach(add=>{
    $.ajax({
      method: 'GET',
      url: add,
      success: function(){

        window.console.log(`ping to ${add} : success!`);
      },
      error: function(){
        window.console.log(`ping to ${add} : failed.`);
      }
    });
  });
}

function timeChecker(range){
  let currentHour = new Date().getHours();
  let startHour = range['pinger-start-end-times'][0];
  let endHour = range['pinger-start-end-times'][1] + 12;
  if(currentHour >= startHour && currentHour < endHour){
    chrome.storage.sync.get('pinger-addresses', pinger);
  }
}

chrome.alarms.onAlarm.addListener(alarm=>{
  let log = [];
  chrome.storage.sync.get('pinger-log', data=>{
    if(data['pinger-log']){
      log = data['pinger-log'];
    }
    let innerLog = log;
    chrome.storage.sync.get('pinger-start-end-times', addresses=>{
      timeChecker(addresses, innerLog);
    });
  });
});
