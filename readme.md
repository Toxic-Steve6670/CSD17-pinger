<h1>Pinger</h1>
<p>Prevents your free dyno from falling asleep.</p>
<p>Check it out on the <a href='https://chrome.google.com/webstore/detail/pinger/egbpibkpckbdhmacfijknpecliodfcgh'>
Chrome Store</a></p>
<h1>Features</h1>
<p>Pinger will ping any websites on demand. Some site hosting services, such as Heroku, have a timer (e.g. 30 minutes) for their free acounts, such that after a certain amount of inactivity they will go to sleep and can take up to 10 or 20 seconds to wake up. Pinger will ping your websites every 20 minutes to make sure they will never go to sleep which ensures instantaneous page load.</p>
<p>Pinger allows you to ping multiple sites at once. Pinger also allows you to select the time range of the day that you want to be pinging your sites. Logs are provided in the extension to keep track of successful pings and any error reports. Pinger stores your sites in Chrome's synchronous storage so you will always have access to your stored sites.</p>
<img src='https://res.cloudinary.com/cloudlicious/image/upload/v1481006631/pingertwo_e1nhww.png'/>
<img src='https://res.cloudinary.com/cloudlicious/image/upload/v1481003068/pinger3_chmkk4.png'/>
<h1>Implementations</h1>
<p>background.js manages the pinging of sites using ajax. A listener on Chrome alarms is set on every alarm trigger. Then a sequence of events fire in sequence to ensure the correct pinging environment.</p>
<ol>
  <li type='1'>timeChecker checks if the current time falls within range of the set time range.</li>
  <li type='1'>getLogs fetches stored logs and pass them along.</li>
  <li type='1'>getAddresses fetches stored web addresses and also pass them along.</li>
  <li type='1'>pinger receives logs and addresses, call GET request on each address, and saves success/error logs upon server response.</li>
</ol>
<p>On each instantiation of Pinger, stored settings (i.e. time range, web addresses) are fetched from Chrome's synchronous storage and displayed. Since the background page's timeChecker only fires every 20 minutes, another version of timeChecker is used to ensure the correct colors and statuses (e.g. pinging, waiting) are displayed.</p>

```javascript
timeChecker(startHour, endHour){
  let currentHour = new Date().getHours();
  if(currentHour >= startHour && currentHour < endHour){
    return 'inTime';
  } else {
    return 'outTime';
  }
}
```

<p>Each change to the time range while Pinger is active will trigger the deletion of the old alarm and creation of a new alarm. timeChecker will be called again immediately, time ranges are then saved, and the new alarm re-fires.</p>

```javascript
updateTime(field){
  return e => {
    this.setState({[field]: e.currentTarget.value }, ()=>{
      let start = parseInt(this.state.startTime.split('am').join(''));
      let end = parseInt(this.state.endTime.split('pm').join(''));
      let time = this.timeChecker(start, end + 12);
      this.setState({inOutTime: time}, this.setPingerTimes());
    });
  };
}
```

<h1>Future Improvements</h1>
<p>A mobile version of Pinger will ensure uninterrupted pinging (when Chrome will be inactive).</p>
