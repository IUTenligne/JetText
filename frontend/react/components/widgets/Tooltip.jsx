var React = require('react');
var ReactDOM = require('react-dom');
var NotificationSystem = require('react-notification-system');


var Tooltip = React.createClass({
	componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },
	render: function(){
		return(
			<div >
				{this.props.children}
			</div>
		);
	}

});

module.exports = Tooltip;