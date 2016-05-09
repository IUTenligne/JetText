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
						<div id="modal-content">
							<div id="modal-header">
								<h3>{ this.props.title ? this.props.title : null }</h3>
								<a onClick={this.closeModal} className="close"><i className="fa fa-remove"></i></a>
							</div>
							<div id="modal-body">
								{ this.props.children }
							</div>
						</div>
					</div>
				</ReactCSSTransitionGroup>
			</div>
		);
	}
});

module.exports = Modal;