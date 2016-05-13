var React = require('react');
import { Link } from 'react-router';

var App = React.createClass({
  	render: function() {
	    return (
	    	<div className="home">
		    	<h1>Welcome in JetText, <span className="capitalize">{JSON.parse(currentUser).firstname}</span> !</h1>

		    	<div id="homeBtn">
		    		<a  href={"/#/containers/"} className="btn-success" >My Containers</a>
		    		<a  href={"/#/glossaries/"} className="btn-success" >My Glossaries</a>
		    	</div>

		    </div>
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