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
                <li><button onClick={this.addMath.bind(this, "\\int_")}>∫</button></li>
                <li><button onClick={this.addMath.bind(this, "\\infty")}>∞</button></li>
            </ul>
        );
    }
});


var MathBlock = React.createClass({
	getInitialState: function() {
        return {
            areaContent: '',
            value: '',
            tooltipState: false
        }
    },

    componentDidMount: function (root) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
    },

    saveBlock: function() {
        var block = this.props.block;
        
        $.ajax({
            type: "PUT",
            url: '/blocks/'+block.id,
            context: this,
            data: { 
                id: block.id,
                name: '',
                content: "$$"+this.state.areaContent+"$$",
                classes: ''
            }
        });

        var editor = CKEDITOR.instances["note_block_"+this.props.block.id];
        if (editor) { editor.destroy(true); }
    },

    viewBlockAction: function() {
        this.setState({ tooltipState: !this.state.tooltipState });
    },

    handleTooltipState: function(st) {
        this.setState({ tooltipState: st });
    },

    handleInteraction: function(fn) {
        this.setState({
            areaContent: this.refs.matharea.value + fn
        });

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
    },

    handleChange: function(event) {
        this.setState({
            areaContent: event.target.value,
            value: "$$"+this.refs.matharea.value+"$$"
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

                <div className="action">
                    <i className="fa fa-cog" onClick={this.viewBlockAction} ></i>
                    <button className="handle"></button>
                </div>

                <Tooltip tooltipState={this.handleTooltipState}>
                    { this.state.tooltipState
                        ? <div className="block-actions">
                            <button className="text-block-save" onClick={this.saveBlock}><i className="fa fa-check"></i> Save</button>
                            <br/>
                            <button className="btn-block" onClick={this.handleRemoveBlock}><i className="fa fa-remove"></i> Delete</button><br/>
                        </div>
                        : null
                    }   
                </Tooltip>
                
                <NotificationSystem ref="notificationSystem"/>
            </div>
    	);
    }
});


module.exports = MathBlock;