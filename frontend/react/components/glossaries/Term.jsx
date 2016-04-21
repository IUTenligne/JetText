var React = require('react');
var Term= require('./Glossary.jsx');
var NotificationSystem = require('react-notification-system');

var Term = React.createClass({
	getInitialState: function() {
	    return {
	        newTermValue: '',
	        termsList: '', 
	        newDescriptionValue: '', 
	    };
	},

	componentDidMount: function() {
	    this.serverRequest = $.get("/terms.json", function(result){
	      	this.setState({
	      		termsList: result
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
    		url:'/term',
    		context: this,
    		data: { term: {name: this.state.newTermValue, description: this.state.newDescriptionValue, glossary_id: this.props.glossary.id}}
    		success: function(){
    			console.log("ok");
    		}
    	})
    }

    deleteTerm: function(){

    },

    _notificationSystem: null,

    render: function(){
    	return(
    		<div className="term">
    			{result.map(function(term){
    				return(
    					<div>
    						<p>{term.name}</p>
    						<p>{term.description}</p>
    					</div>
    				)
    			})};
    			<div className="add_new_term">
    				<div className="input-group input-group-lg">
    					<span className="input-group-addon">
                            <i className="fa fa-plus fa-fw"></i>
                        </span>
                        <input type="text" id="new_glossary" className="form-control" value={this.state.newTermValue} onChange={this.handleChange} onKeyPress={this._handleKeyPress} autoComplet="off" placeholder="Create new glossary..." />
    				</div>
    				<div className="input-group input-group-lg">
    					<span className="input-group-addon">
                            <i className="fa fa-plus fa-fw"></i>
                        </span>
                        <input type="text" id="new_glossary_desc" className="form-control" value={this.state.newDescriptionValue} onChange={this.handleChange} onKeyPress={this._handleKeyPress} autoComplet="off" placeholder="Create new decrition..." />
    				</div>
    			</div>
    		</div>
    	);
    }
})