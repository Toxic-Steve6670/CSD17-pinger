/* global chrome */
function pinger(addresses){
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

chrome.alarms.onAlarm.addListener(function(alarm){
  chrome.storage.sync.get('pinger-start-end-times', timeChecker);
});
