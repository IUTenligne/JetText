var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, Link, hashHistory } from 'react-router';

var App = require('./components/App.jsx');
var Containers = require('./components/containers/Containers.jsx');
var Container = require('./components/containers/Container.jsx');
var Page = require('./components/pages/Page.jsx');
var Menu = require('./components/containers/Menu.jsx');

$(document).ready(function () {
  ReactDOM.render((
	  <Router history={hashHistory}>
	  	<Route path="/" component={App}/>	
	    <Route path="containers" component={Containers}/>
	    <Route path="containers/:id" component={Container}/>
	    <Route path="pages/:id/:pageId" component={Container}/>
	  </Router>
	), document.getElementById('appcontainer'))
});
