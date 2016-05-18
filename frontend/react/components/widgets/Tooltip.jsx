var React = require('react');
var ReactDOM = require('react-dom');


var Tooltip = React.createClass({
	
	render: function(){
		return(
			<div >
				{this.props.children}
			</div>
		);
	}

});

module.exports = Tooltip;