var React = require('react');
var NotificationSystem = require('react-notification-system');


var Glossary = React.createClass({

	getInitialState: function() {
	    return {
	        newGlossaryValue: '',
	        glossariesList: '', 
	        newDescriptionValue: '', 
	    };
	},

	componentDidMount: function() {
	    this.serverRequest = $.get("/glossary.json", function(result){
	      	this.setState({
	      		glossariesList: result
	      	});
	    }.bind(this));
	    this._notificationSystem = this.refs.notificationSystem;
	},

	componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    createGlossary: function(event) {
    	$.ajax({
    		type: "POST",
    		url:'/glossary',
    		context: this,
    		data: { glossary: {name: this.state.newGlossaryValue, description: this.state.newDescriptionValue, user_id: this.props.user.id}}
    		success: function(){
    			console.log("ok");
    		}
    	})
    }

    deleteGlossary: function(){

    },

    _notificationSystem: null,

    render: function(){
    	return(
    		<div className="glossary">
    			{result.map(function(glossary){
    				return(
    					<div>
    						<p>{glossary.name}</p>
    						<p>{glossary.description}</p>
    					</div>
    				)
    			})};
    			<div className="add_new_glossary">
    				<div className="input-group input-group-lg">
    					<span className="input-group-addon">
                            <i className="fa fa-plus fa-fw"></i>
                        </span>
                        <input type="text" id="new_glossary" className="form-control" value={this.state.newGlossaryValue} onChange={this.handleChange} onKeyPress={this._handleKeyPress} autoComplet="off" placeholder="Create new glossary..." />
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
});