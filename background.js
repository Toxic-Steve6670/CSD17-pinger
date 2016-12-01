function showNotification(rem) {
  let startTime, endTime, currentTime = new Time();
  if(currentTime >= startTime && currentTime <= endTime){
       $.ajax({});
  }
}

chrome.alarms.onAlarm.addListener(function(alarm){
  chrome.storage.sync.get('sssf-reminders', showNotification);
});
