var React = require('react');
var Term= require('./Glossary.jsx');
var NotificationSystem = require('react-notification-system');

var TermCreate = React.createClass({
	getInitialState: function() {
	    return {
	        newTermValue: '',
	        newDescriptionValue: ''
	    };
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
    		type: "PUT",
    		url:'/glossary',
    		context: this,
    		data: {
                term: {
                    name: this.state.newTermValue,
										description: this.state.newDescriptionValue,
										glossary_id: this.props.glossary.id
                }
            },
    		success: function(){
    			console.log("ok");
    		}
    	})
    },

    deleteTerm: function(){

    },

    _notificationSystem: null,

    render: function(){
        var terms = this.state.termsList;
    	return(
					<form className="add_new_term" action="" method="post">
    				<div className="input-group input-group-lg">
    					<span className="input-group-addon">
                            <i className="fa fa-plus fa-fw"></i>
                        </span>
                        <input type="text" id="new_term" className="form-control" value={this.state.newTermValue}   autoComplet="off" placeholder="Create new term..." />
    				</div>
    				<div className="input-group input-group-lg">
    					<span className="input-group-addon">
                            <i className="fa fa-plus fa-fw"></i>
                        </span>
                        <input type="text" id="new_term_desc" className="form-control" value={this.state.newDescriptionValue}  autoComplet="off" placeholder="Create new decription..." />
    				</div>
						<input type="submit" value='Create' className="btn-success" onClick={this.createTerm}/>
    			</form>
    		</div>
    	);
    }
});

module.exports = TermCreate;
