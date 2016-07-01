var React = require('react');
var Containers = require('./containers/Containers.jsx');
import { Link } from 'react-router';

var App = React.createClass({
  	render: function() {
	    return (
	    	<div className="home">

          <Containers />

		    </div>
	    );
  	}
});

module.exports = App;


/*
*
*  			   			.------------.   .-----------.
*               |  Glossary  |-->|    term   |
*			   				'------------'   '-----------'
*					  					^
*                     |
*  .-------.   .------------.   .-----------.
*  |  App  +-->| Containers |-->| Container |
*  '-------'   '------------'   '-----+-----'
*                                     |
*                                     v
*  .--------.		.-----------.   .-----+-----.
*  | Blocks |<--|  Pages    |<--|   Menu    |
*  '--------'		'-----------'	  '-----------'
*
*/
