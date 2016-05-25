var React = require('react');
var NotificationSystem = require('react-notification-system');

var TermCreate = React.createClass({
	getInitialState: function() {
	    return {
	        newTermValue: '',
	        newDescriptionValue: ''
	    };
	},

    handleChange: function(input, event) {
        if (input == "new_term")
            this.setState({newTermValue: event.target.value});
        if (input == "new_term_desc")
            this.setState({newDescriptionValue: event.target.value});
    },

	componentDidMount: function() {
	    this._notificationSystem = this.refs.notificationSystem;
	},

	createTerm: function(event) {
        event.preventDefault();
    	$.ajax({
    		type: "POST",
    		url: '/terms',
    		context: this,
    		data: {
                term: {
                    name: this.state.newTermValue,
					description: this.state.newDescriptionValue,
					glossary_id: this.props.glossary
                }
            },
    		success: function(data){
    			this.props.addTerm(data)
    		}
    	})
    },

    deleteTerm: function(){

    },

    _notificationSystem: null,

    render: function(){
    	return(
			<form className="add_new_term">
				<div className="input-group input-group-lg">
					<span className="input-group-addon">
                        <i className="fa fa-plus fa-fw"></i>
                    </span>
                    <input type="text" id="new_term" className="form-control" value={this.state.newTermValue}  onChange={this.handleChange.bind(this, "new_term")} autoComplet="off" placeholder="Créer un nouveau terme..." />
				</div>
				<div className="input-group input-group-lg">
					<span className="input-group-addon">
                        <i className="fa fa-plus fa-fw"></i>
                    </span>
                    <input type="text" id="new_term_desc" className="form-control" value={this.state.newDescriptionValue} onChange={this.handleChange.bind(this, "new_term_desc")} autoComplet="off" placeholder="Ajouter une description..." />
				</div>
				<input type="submit" value='Créer' className="btn-success" onClick={this.createTerm}/>
    		</form>

    	);
    }
});

module.exports = TermCreate;
