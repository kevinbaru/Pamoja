var React = require('react');
var ReactDOM = require('react-dom');
import {HashRouter as Router, Route, Switch, Link } from 'react-router-dom'
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { browserHistory} from 'react-router';

import HomePage from './components/homePage';
import History from './components/history';
import LoginPage from './containers/LoginPage';
import SignUpPage from './containers/SignUpPage';
import MyEditor from './components/document';
injectTapEventPlugin();

ReactDOM.render((
  <MuiThemeProvider muiTheme={getMuiTheme()}>
      <Router history={browserHistory}>
        <Switch>
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/history/:docId" component={History} />
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/document/:docId" component={MyEditor} />
          <Route path="/" component={LoginPage} />
        </Switch>
      </Router>
  </MuiThemeProvider>
 ), document.getElementById('root')
);
