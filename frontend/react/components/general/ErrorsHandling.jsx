var React = require('react');

var ErrorHandling = {
	checkStatus: function(status) {
		if (status.state != 0)
			return ( <ErrorsHandler status={status} /> );
	}
};

module.exports = ErrorHandling;
