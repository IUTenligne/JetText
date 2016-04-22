var React = require('react');

var ErrorsHandler = React.createClass({
	getInitialState: function() {
        return {
            status: 0,
            message: ''
        }
    },

    componentDidMount: function() {
    	this.setState({ 
    		status: this.props.status.state,
    		message: this.props.status.message
    	});
    },

    render: function() {
    	if (this.state.status != 0) {
	    	return (<div className="alert alert-danger">{this.state.message}</div>);
	    } else {
	    	return null;
	    }
    }
});

module.exports = ErrorsHandler;