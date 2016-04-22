var React = require('react');

var ErrorsHandler = React.createClass({
    render: function() {
    	if (this.props.status.state != 0) {
	    	return (<div className="alert alert-danger">{this.props.status.message}</div>);
	    } else {
	    	return null;
	    }
    }
});

module.exports = ErrorsHandler;