var React = require('react');

var Loader = React.createClass({
    render: function(){
    	return(
				<i className={"fa fa-cog fa-spin loader " + this.props.color}></i>
    	);
    }
});

module.exports = Loader;
