import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Profile from './Profile'
import Home from './Home';
import "bootstrap/dist/css/bootstrap.css";
import Heart from './Heart'

const renderGlobalAppBackground = () => {
document.body.style = "background: #fafafa;"
}


ReactDOM.render(
  <React.StrictMode>
    <Router>
      {renderGlobalAppBackground()}
      {/* {(document.body.style = "background: #fafafa;")} */}
      <Route path="/" component={App} />
      {/* <Route path="/Home" component={Home} />
      <Route path="/profile" component={Profile} />
      <Route path="/heart" component={Heart} /> */}
    </Router>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
