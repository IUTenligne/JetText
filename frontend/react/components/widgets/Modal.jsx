var React = require('react');
var ReactDOM = require('react-dom');


var Modal = React.createClass({
	closeModal: function(){
		this.props.active(false);
    },

	render: function(){
		return(
			<div className="modal" ref="mod">
				<div id="glossary">
					<button onClick={this.closeModal}>Close modal</button>
					{ this.props.children }
				</div>
			</div>
		);
	}
});

module.exports = Modal;