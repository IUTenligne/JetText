var React = require('react');
var Loader = require('../widgets/Loader.jsx');
var NotificationSystem = require('react-notification-system');
var TermOverlay = require('../glossaries/termOverlay.jsx');
var Modal = require('../widgets/Modal.jsx');


var TextBlock = React.createClass({
	getInitialState: function() {
        return {
            blockContent: '',
            editButton: true,
            loading: false,
            myStyle: '',
            left: '',
            top: '',
            termsList: [],
            modalState: false
        };
    },

    componentDidMount: function() {
        this.setState({
            blockContent: this.props.block.content
        });
        this.serverRequest = $.get("/terms.json", function(result){
            this.setState({
                termsList: result.terms
            });
        }.bind(this));

        this._notificationSystem = this.refs.notificationSystem;

        /* Opens CKEditor if the block has no content */
        if (this.props.block.content == '') {
            this.unlockEditor();
        }
    },

    componentWillUnmount: function() {
        var editor = CKEDITOR.instances["text_block_"+this.props.block.id];
        
        /* Saves the block's content if before leaving the page */
        var block = this.props.block;
        $.ajax({
            type: "PUT",
            url: '/blocks/'+block.id,
            context: this,
            data: { id: block.id, content: this.state.blockContent }
        });

        if (editor) { editor.destroy(true); }
    },

    saveBlock: function(event) {
        var block = this.props.block;

        $.ajax({
            type: "PUT",
            url: '/blocks/'+block.id,
            context: this,
            data: { id: block.id, content: this.state.blockContent },
            success: function(data) {
                this.setState({
                    blockContent: data.content,
                    editButton: true
                })
            }
        });

        event.target.value = '';

        var editor = CKEDITOR.instances["text_block_"+this.props.block.id];
        if (editor) { editor.destroy(true); }

        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Block saved !',
            level: 'success'
        });
    },

    unlockEditor: function() {
        var that = this;
        this.setState({ editButton: false });

        var editor = CKEDITOR.replace("text_block_"+this.props.block.id, {
            customConfig: '/assets/cke/custom_config.js'
        });

        editor.on('change', function( evt ) {
            // setState to allow changes to be saved on submit
            that.setState({ blockContent: evt.editor.getData() });
        });
        CKEDITOR.plugins.addExternal('uploader', '/assets/cke/plugins/uploader/', 'plugin.js');
    },

    _notificationSystem: null,

    dynamicId: function(id){
        return "text_block_" + id;
    },

    createMarkup: function(data) {
        return {__html: data};
    },

    overTerm: function(event){
        this.setState({
            left: event.pageX-40,
            top: event.pageY -50,
            focusPopup: true
        });
    },

    termOverlay: function(){
        this.setState({ modalState: true });
    },

    handleModalState: function(st){
        this.setState({ modalState: st });
    },

	render: function() {
		var block = this.props.block;
        var TextBlock = this.props.item;
        var select = document.getSelection().toString();
        var myStyle = {
            left: this.state.left + "px",
            top: this.state.top + "px",
            position: "absolute",
            clear: "both"
        };

		return (
            <div className="block-inner">
                <div className="content" key={block.id} onMouseUp={this.overTerm} onMouseDown={this.downTerm} >
                    <div className="focus" style={myStyle}>
                        <a onClick={this.termOverlay}>
                            <i className="fa fa-book fa-fw" title="Glossary" aria-hidden="true"></i>
                        </a>
                    </div>
                    <div className="block-title">
                        <i className="fa fa-pencil"></i>
                        <h3>{block.name}</h3>
                    </div>

                    { this.state.loading
                        ? <Loader />
                        : <div id={this.dynamicId(block.id)} className="block-content" ref="editableblock" dangerouslySetInnerHTML={this.createMarkup(this.state.blockContent)} onDoubleClick={this.unlockEditor} />
                    }
                </div>

                { this.state.editButton 
                    ? <button className="btn-block" onClick={this.unlockEditor}><i className="fa fa-pencil"></i></button>
                    : <button className="btn-block" onClick={this.saveBlock}><i className="fa fa-check"></i></button>
                }

                { this.state.modalState
                    ? <Modal active={this.handleModalState} title={"Create new definition"}>
                        <TermOverlay select={select} />
                        <span className="bold"> {select} </span>
                    </Modal>
                    : null
                }



                <NotificationSystem ref="notificationSystem"/>
            </div>
        );
	}
});

module.exports = TextBlock;
