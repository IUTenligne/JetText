var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, Link, hashHistory } from 'react-router';

var App = require('./components/App.jsx');
var Containers = require('./components/containers/Containers.jsx');
var Container = require('./components/containers/Container.jsx');
var Glossaries = require('./components/glossaries/Glossaries.jsx');
var Glossary = require('./components/glossaries/Glossary.jsx');
var Term = require('./components/glossaries/Term.jsx');

$(document).ready(function () {
	if (document.getElementById('appcontainer')) {
	  ReactDOM.render((
		  <Router history={hashHistory}>
		  	<Route path="/" component={App}/>	
		    <Route path="containers" component={Containers}/>
		    <Route path="containers/:id" component={Container}/>
		    <Route path="containers/:id/:pageId" component={Container}/>
		    <Route path="glossaries" component={Glossaries}/>
		    <Route path="glossaries/:id" component={Glossary}/>
			<Route path="glossaries/:id/:termId" component={Glossary}/>
			<Route path="terms/:id" component={Term}/>
		  </Router>
		), document.getElementById('appcontainer'));
	} else if (document.getElementById('testcontainer')) {
	}
}); 