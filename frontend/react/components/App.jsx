var React = require('react');
import { Link } from 'react-router';
var Containers = require('./containers/Containers.jsx');

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
*  			   .------------.   .-----------.           
*              |  Glossary  |-->|    term   |
*			   '------------'   '-----------' 
*					  ^
*                     |
*  .-------.   .------------.   .-----------.  
*  |  App  +-->| Containers |-->| Container |
*  '-------'   '------------'   '-----+-----' 
*                                     |
*                                     v
*  .--------.	.-----------.   .-----+-----. 
*  | Blocks |<--|  Pages    |<--|   Menu    |
*  '--------'	'-----------'	'-----------'
*
*/