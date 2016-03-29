var React = require('react');
import { Link } from 'react-router';
var Containers = require('./containers/Containers.jsx');

var App = React.createClass({

  	render: function() {
	    return (
		     
		     <div className="col-lg-12">
	            <nav className="navbar navbar-default navbar-static-top" role="navigation">
	                <div className="navbar-header">
                        <img src="/templates/iutenligne/img/cartable.png" border="0"/>
                        <h1>
                            Ton titre pour etre sympa avec les gens
                        </h1>
	                </div> 
	                <div className="navbar-default sidebar menu" role="navigation">
	                    <div className="sidebar-nav navbar-collapse">
	                        <a href="http://www.iutenligne.net/resources.html">
	                            <img src="/templates/iutenligne/img/iutenligne.png" border="0"/>
	                        </a>

	                            <Containers />

	                    </div>
	                </div>
	            </nav>
	            <div id="page-wrapper">
	                <div className="row">
	                    bouya
	                </div>
	            </div>
	        </div>
	    );
  	}
});

module.exports = App;