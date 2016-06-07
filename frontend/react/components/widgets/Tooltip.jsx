var React = require('react');
var ReactDOM = require('react-dom');
var NotificationSystem = require('react-notification-system');
var enhanceWithClickOutside = require('react-click-outside');


var Tooltip = React.createClass({
	componentDidMount: function() {
    this._notificationSystem = this.refs.notificationSystem;
  },

  handleClickOutside: function() {
    this.props.tooltipState(false);
  },


	render: function(){
		return(
			<div>
				{this.props.children}
			</div>
		);
	}

});

module.exports = enhanceWithClickOutside(Tooltip);