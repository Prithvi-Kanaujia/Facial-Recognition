import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import Particle from './components/particle'
// import { AppState } from './state/store';
import  Store from './state/store';
import { Container } from 'react-bootstrap';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Container>
    <Provider store={Store}>
    <App />
  </Provider>
  <Particle></Particle>
  </Container>
  
  
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
