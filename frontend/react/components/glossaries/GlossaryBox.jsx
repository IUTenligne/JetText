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
        var that = this;
        console.log(this.state.termsList);
    	return(
    		<div className="terms">
    		<NotificationSystem ref="notificationSystem" />
				<div className="row">
					<div className="col-lg-12">
						<h1 className="page-header">My Terms in glossary {that.state.glossary.name}</h1>
					</div>
				</div>
    			{terms.map(function(term){
    				return(
						<li key={term.id}>
							{term.name} : {term.description}
						</li>
    				)
    			})}
				<div className="add_new_term">
    				<TermCreate glossary={this.state.glossary.id} addTerm={that.handleTermAdd}/>
    			</div>
    		</div>
    	);
    }
});

module.exports = GlossaryBox;
