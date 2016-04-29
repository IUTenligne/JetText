var React = require('react');

var Loader = React.createClass({
    render: function(){
    	return(
			<i class="fa fa-spinner fa-pulse loader"></i>
    	);
    }
});

module.exports = Loader;
