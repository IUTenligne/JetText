var React = require('react');
import { Link } from 'react-router';
var Containers = require('./containers/Containers.jsx');
var ErrorsHandler = require('./general/ErrorsHandler.jsx');

const ErrorHandling = {
	checkStatus: function(status) {
		if (status.state != 0)
			return ( <ErrorsHandler status={status} /> );
	}
};

var App = React.createClass({
  	render: function() {
	    return (
		    <Containers />
	    );
  	}
});

module.exports = App;


/*
*              
*  .-------.   .------------.   .-----------.  
*  |  App  +-->| Containers |-->| Container |
*  '-------'   '------------'   '-----+-----' 
*                                     |
*                                     v
*	 .--------.	  .-----------.   .-----+-----. 
*	 | Blocks |<--|  Pages    |<--|   Menu    |
*	 '--------'	  '-----------'	  '-----------'
*
*/