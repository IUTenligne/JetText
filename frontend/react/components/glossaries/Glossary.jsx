var React = require('react');
var glossaries = require('./Glossaries.jsx');
var TermCreate = require('./TermCreate.jsx');
import { Router, Route, Link, hashHistory } from 'react-router';
var NotificationSystem = require('react-notification-system');

var Glossary = React.createClass({
	getInitialState: function() {
	    return {
	    	glossary: '',
	        termsList: []
	    };
	},

	componentDidMount: function() {
	    this.serverRequest = $.get("/glossaries/"+this.props.params.id+".json", function(result){
	      	this.setState({
	      		termsList: result.terms
	      	});
	    }.bind(this));
	    this.setState({ glossary: this.props.params.id });
	    this._notificationSystem = this.refs.notificationSystem;
	},

	componentWillUnmount: function() {
        this.serverRequest.abort();
    },


    deleteTerm: function(){

    },

    _notificationSystem: null,

    render: function(){
        var terms = this.state.termsList;
        var that = this;
    	return(
    		<div className="terms">
				<div className="row">
					<div className="col-lg-12">
						<h1 className="page-header">My Terms</h1>
					</div>
				</div>
    			{terms.map(function(term){
    				return(
						<li key={term.id}>
							<Link to={"/glossaries/"+that.state.glossary+"/"+term.id}>
								{term.name}
							</Link>
							<br/>
							<a href="#" onClick={that.deleteTerm.bind(that, term.id)}>
								<i className="fa fa-trash-o"></i>
							</a>
						</li>
    				)
    			})}
				<div className="add_new_term">
    				<TermCreate glossary={this.state.glossary}/>
    			</div>
    		</div>
    	);
    }
});

module.exports = Glossary;
