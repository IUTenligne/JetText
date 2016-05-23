var React = require('react');
var ReactDOM = require('react-dom');
var Loader = require('../widgets/Loader.jsx');
var NotificationSystem = require('react-notification-system');
var Tooltip = require('../widgets/Tooltip.jsx');


var MathToolbox = React.createClass({
    addMath: function(fn) {
        this.props.interact(fn);
    },

    render: function() {
        return (
            <ul>
                <li><button onClick={this.addMath.bind(this, "ab")}>ab</button></li>
                <li><button onClick={this.addMath.bind(this, "x")}>ab</button></li>
            </ul>
        );
    }
});


var MathBlock = React.createClass({
	getInitialState: function() {
        return {
            areaContent: '$$Gamma(z) = \\int_0^\\infty t^{z-1}e^{-t}dt\\,$$',
            value: '$$Gamma(z) = \\int_0^\\infty t^{z-1}e^{-t}dt\\,$$'
        }
    },

    componentDidMount: function (root) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
    },

    handleInteraction: function(fn) {
        this.setState({
            areaContent: fn
        });

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
    },

    handleChange: function(event) {
        this.setState({
            areaContent: event.target.value,
            value: this.refs.matharea.value
        });

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
    },

    handleRemoveBlock: function() {
        this.props.removeMe(this.props.block);
    },

    createMarkup: function(data) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
        return {__html: data};
    },

    render: function() {
    	var block = this.props.block;

    	return (
    		<div className="block-inner">

                <div className="content" key={block.id}>
                    <div className="block-title">
                        <i className="fa fa-superscript"></i>
                        <h3></h3>
                    </div>

                    <div className="block-content">
                        <MathToolbox interact={this.handleInteraction} />

                        <textarea ref="matharea" type="text" value={this.state.areaContent} onChange={this.handleChange} rows="5" cols="50" />

                        <div
                          className="content"
                          id="output"
                          ref="output"
                          dangerouslySetInnerHTML={this.createMarkup(this.state.value)}
                        />
                    </div>
                </div>

                <button className="btn-block" onClick={this.handleRemoveBlock}><i className="fa fa-remove"></i> Delete</button><br/>
                
                <NotificationSystem ref="notificationSystem"/>
            </div>
    	);
    }
});


module.exports = MathBlock;