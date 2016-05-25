var React = require('react');
var ReactDOM = require('react-dom');
var Loader = require('../widgets/Loader.jsx');
var NotificationSystem = require('react-notification-system');
var Tooltip = require('../widgets/Tooltip.jsx');
var Modal = require('../widgets/Modal.jsx');
var ContainersList = require('./ContainersList.jsx');


var MathToolbox = React.createClass({
    addMath: function(fn) {
        this.props.interact("\\" + fn);
    },

    render: function() {
        return (
            <ul className="mathtoolbar">
                <li><button onClick={this.addMath.bind(this, ";")}>espace</button></li>
                <li><button onClick={this.addMath.bind(this, "frac")}>frac</button></li>
                <li><button onClick={this.addMath.bind(this, "sqrt{}")}>racine</button></li>
                <li><button onClick={this.addMath.bind(this, "int_")}>∫</button></li>
                <li><button onClick={this.addMath.bind(this, "infty")}>∞</button></li>
            </ul>
        );
    }
});


var MathBlock = React.createClass({
	getInitialState: function() {
        return {
            areaContent: '',
            value: '',
            tooltipState: false,
            modalState: false
        }
    },

    componentDidMount: function (root) {
        this.setState({
            areaContent: this.props.block.content,
            value: this.props.block.content
        });

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
    },

    saveBlock: function() {
        var block = this.props.block;
        
        $.ajax({
            type: "PUT",
            url: '/blocks/' + block.id,
            context: this,
            data: { 
                id: block.id,
                name: '',
                content: this.state.areaContent,
                classes: ''
            }
        });

        var editor = CKEDITOR.instances["note_block_"+this.props.block.id];
        if (editor) { editor.destroy(true); }
    },

    exportBlock: function() {
        this.setState({ 
            modalState: true,
            loading: true 
        });

        this.getContainers();
    },

    handleBlockAdd: function(data) {
        /* updates the block list after a duplication on the same page */
        this.props.addBlock(data);
    },

    handleModalState: function(st) {
        this.setState({ modalState: st });
    },

    closeModal: function() {
        this.setState({ modalState: false });
    },

    getContainers: function() {
        this.serverRequest = $.get("/containers.json", function(result) {
            this.setState({
                containersList: result.containers,
                loading: false
            });
        }.bind(this));
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
            value: this.refs.matharea.value
        });

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
    },

    handleRemoveBlock: function() {
        this.props.removeMe(this.props.block);
    },

    createMarkup: function(data) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
        return {__html: "$$" + data + "$$"};
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
                            <button className="btn-block" onClick={this.exportBlock}><i className="fa fa-share-square-o"></i> Export</button>
                            <br/>
                            <button className="btn-block" onClick={this.handleRemoveBlock}><i className="fa fa-remove"></i> Delete</button><br/>
                        </div>
                        : null
                    }   
                </Tooltip>

                { this.state.modalState
                    ? <Modal active={this.handleModalState} mystyle={""} title={"Export block"}>
                            <div className="modal-in">
                                { this.state.loading 
                                    ? <Loader />
                                    : <ContainersList 
                                            closeModal={this.closeModal} 
                                            containers={this.state.containersList} 
                                            block={block.id} 
                                            addBlock={this.handleBlockAdd} 
                                        />
                                }
                            </div>
                        </Modal>
                    : null
                }
                
                <NotificationSystem ref="notificationSystem"/>
            </div>
    	);
    }
});


module.exports = MathBlock;