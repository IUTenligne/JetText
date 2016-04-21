var React = require('react');
var Term= require('./Glossaries.jsx');
var NotificationSystem = require('react-notification-system');

var Glossary = React.createClass({
	getInitialState: function() {
	    return {
	        newTermValue: '',
	        termsList: [], 
	        newDescriptionValue: ''
	    };
	},

    handleChange: function(event) {
        this.setState({newGlossaryValue: event.target.value});
    },

	componentDidMount: function() {
	    this.serverRequest = $.get("/glossary.json", function(result){
	      	this.setState({
	      		termsList: result.terms
	      	});
	    }.bind(this));
	    this._notificationSystem = this.refs.notificationSystem;
	},

	componentWillUnmount: function() {
        this.serverRequest.abort();
    },
	
	createTerm: function(event) {
    	$.ajax({
    		type: "POST",
    		url:'/glossary',
    		context: this,
    		data: { 
                term: {
                    name: this.state.newTermValue, description: this.state.newDescriptionValue, glossary_id: this.props.glossary.id
                }
            },
    		success: function(){
    			console.log("ok");
    		}
    	})
    },

    _handleKeyPress: function(event) {
        if (event.key === 'Enter') {
            this.createTerm(event);
        }
    },

    deleteTerm: function(){

    },

    _notificationSystem: null,

    render: function(){
        var terms = this.state.termsList;
    	return(
    		<div className="term">
    			{terms.map(function(term){
    				return(
    					<div>
    						<p>{term.name}</p>
    						<p>{term.description}</p>
    					</div>
    				)
    			})}
    			<div className="add_new_term">
    				<div className="input-group input-group-lg">
    					<span className="input-group-addon">
                            <i className="fa fa-plus fa-fw"></i>
                        </span>
                        <input type="text" id="new_term" className="form-control" value={this.state.newTermValue} onChange={this.handleChange} onKeyPress={this._handleKeyPress} autoComplet="off" placeholder="Create new term..." />
    				</div>
    				<div className="input-group input-group-lg">
    					<span className="input-group-addon">
                            <i className="fa fa-plus fa-fw"></i>
                        </span>
                        <input type="text" id="new_term_desc" className="form-control" value={this.state.newDescriptionValue} onChange={this.handleChange} onKeyPress={this._handleKeyPress} autoComplet="off" placeholder="Create new decrition..." />
    				</div>
    			</div>
    		</div>
    	);
    }
});

module.exports = Glossary;
