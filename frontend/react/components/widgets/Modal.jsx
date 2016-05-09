var React = require('react');
var ReactDOM = require('react-dom');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var Modal = React.createClass({
	closeModal: function(){
		this.props.active(false);
  },

	render: function(){
		return(
			<div className="modal">
				<ReactCSSTransitionGroup transitionName="modal-inner-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppear={true} transitionAppearTimeout={500}>
					<div className="modal-inner">
						<div id="glossary">
							<button onClick={this.closeModal}>Close modal</button>
							{ this.props.children }
						</div>
					</div>
				</ReactCSSTransitionGroup>
			</div>
		);
	}
});

module.exports = Modal;