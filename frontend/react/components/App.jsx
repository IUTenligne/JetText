var React = require('react');
import { Link } from 'react-router';

var App = React.createClass({
  	render: function() {
	    return (
	    	<div className="home">
		    	<h1>Welcome <span className="capitalize">{JSON.parse(currentUser).firstname}</span> !</h1>

		    	<div id="homeBtn">
		    		<a id="btntest" ref="btntest" href={"/#/containers/"} className="btn-success">Mes ressources</a>
		    		<a href={"/#/glossaries/"} className="btn-success">Mes glossaires</a>
		    	</div>

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