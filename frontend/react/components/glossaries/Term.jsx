var React = require('react');
var Term = require('./Glossary.jsx');
var NotificationSystem = require('react-notification-system');

var Term = React.createClass({
	getInitialState: function() {
	    return {
	        TermValue: ''
	    };
	},

	componentDidMount: function() {
	    this.serverRequest = $.get("/glossary/"+this.props.term+".json", function(result){
	      	this.setState({
	      		TermValue: result.terms
	      	});
	    }.bind(this));
	},

	componentWillUnmount: function() {
        this.serverRequest.abort();
    },


    render: function(){
        var terms = this.state.termsList;
    	return(
			<div className="term">
                <h2>term.name}</h2>
                <p>{term.description}</p>
    		</div>
    	);
    }
});

module.exports = Term;
