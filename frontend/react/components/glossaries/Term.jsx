var React = require('react');
var Term= require('./Glossary.jsx');
var NotificationSystem = require('react-notification-system');

var Term = React.createClass({
	getInitialState: function() {
	    return {
	        TermValue: ''
	    };
	},

	componentDidMount: function() {
	    this.serverRequest = $.get("/glossary.json", function(result){
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
                {terms.map(function(term){
                    return(
                        <li key={term.id}>
                            {term.name}
                            <br/>
                            {term.description}
                        </li>
                    )
                })}
    		</div>
    	);
    }
});

module.exports = Term;
