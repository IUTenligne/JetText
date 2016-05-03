var React = require('react');
var TermCreate = require('./TermCreate.jsx');
import { Router, Route, Link, hashHistory } from 'react-router';
var NotificationSystem = require('react-notification-system');


var GlossaryBox = React.createClass({
	getInitialState: function() {
	    return {
	    	glossary: '',
	        termsList: []
	    };
	},

	componentDidMount: function() {
	    this.serverRequest = $.get("/glossaries/"+this.props.glossary+".json", function(result){
	      	this.setState({
	      		glossary: result.glossary,
	      		termsList: result.terms
	      	});
	    }.bind(this));
	    this._notificationSystem = this.refs.notificationSystem;
	},

	componentWillUnmount: function() {
        this.serverRequest.abort();
    },


    _notificationSystem: null,

    render: function(){
        var terms = this.state.termsList;
    	return(
    		
            <div className="terms">
    		    <NotificationSystem ref="notificationSystem" />
                <ul>
        			{terms.map(function(term){
        				return(
    						<li key={term.id}>
    							{term.name} : {term.description}
    						</li>
        				)
        			})}
                </ul>
				<div className="add_new_term">
    				<TermCreate glossary={this.state.glossary.id} addTerm={this.handleTermAdd}/>
    			</div>
    		</div>
            
    	);
    }
});

module.exports = GlossaryBox;
