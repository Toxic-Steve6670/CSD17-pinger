import React from 'react';
import ReactDOM from 'react-dom';
// import configureStore from './react/store/store';
// import Root from './react/components/root';

document.addEventListener('DOMContentLoaded', ()=>{
  // let store = configureStore();
  // const root = document.getElementById('root');

  ReactDOM.render(<Root store={store} />, root);
});
