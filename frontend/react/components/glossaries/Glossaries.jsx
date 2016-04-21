var React = require('react');
var NotificationSystem = require('react-notification-system');


var Glossaries = React.createClass({

	getInitialState: function() {
	    return {
	        newGlossaryValue: '',
	        glossariesList: [], 
	        newDescriptionValue: '', 
	    };
	},

    handleChange: function(event) {
        this.setState({newGlossaryValue: event.target.value});
    },
	componentDidMount: function() {
	    this.serverRequest = $.get("/glossaries.json", function(result){
	      	this.setState({
	      		glossariesList: result.glossaries,
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
    		url:'/glossaries',
    		context: this,
    		data: { 
                glossary: {
                    name: this.state.newGlossaryValue, description: this.state.newDescriptionValue, user_id: ''
                } 
            },
    		success: function(){
    			console.log("ok");
    		}
    	})
    },

    _handleKeyPress: function(event) {
        if (event.key === 'Enter') {
            this.createGlossary(event);
        }
    },

    deleteGlossary: function(){

    },

    _notificationSystem: null,

    render: function(){
        var glossaries = this.state.glossariesList;
    	return(
    		<div className="glossary">
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="page-header">My Glossaries</h1>
                    </div>
                </div>
    			{glossaries.map(function(glossary){
    				return(
    					<div>
    						<p>{glossary.name}</p>
    						<p>{glossary.description}</p>
    					</div>
    				)
    			})}
    			<div className="add_new_glossary">
    				<div className="input-group input-group-lg">
    					<span className="input-group-addon">
                            <i className="fa fa-plus fa-fw"></i>
                        </span>
                        <input type="text" id="new_glossary" className="form-control" value={this.state.newGlossaryValue} onChange={this.handleChange} onKeyPress={this._handleKeyPress} autoComplet="off" placeholder="Create new glossary..." />
    				</div>
    			</div>
    		</div>
    	);
    }
});

module.exports = Glossaries;