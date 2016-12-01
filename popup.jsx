import React from 'react';
import ReactDOM from 'react-dom';

class Popup extends React.Component {
  render(){
    return(
      <div>
        Popup
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const root = document.getElementById('root');
  ReactDOM.render(<Popup />, root);
});
