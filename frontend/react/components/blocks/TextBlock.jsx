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
            modalState: false,
            selectedText: '',
            focusPopup: false,
            containersGlossariesList: []
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/containers_glossaries/" + this.props.containerId +  ".json", function(result){
            this.setState({
                containersGlossariesList: result.containers_glossaries
            });
            
            if (result.containers_glossaries.length > 0){
                var that = this;

                for( var i in result.containers_glossaries ){
                    that.serverRequest = $.get("/glossaries/" + result.containers_glossaries[i]["glossary_id"] +  ".json", function(result){
                        that.setState({
                            termsList: result.terms,
                            blockContent: this.regexTerm(result.terms, this.props.block.content)
                        });
                    }.bind(that));
                }
            } else {
                this.setState({
                    blockContent: this.props.block.content
                });
            }
        }.bind(this));
        
        this._notificationSystem = this.refs.notificationSystem;

        /* Opens CKEditor if the block has no content */
        if (this.props.block.content == '') {
            this.unlockEditor();
        }
    },

    regexTerm: function(termsList, content){
        for ( var i in termsList) {
            var regex = new RegExp(termsList[i]["name"], "gi");
            if ( content.match(regex) ) {
                content = content.replace(regex, '<span style="background: red">'+termsList[i]["name"]+'</span>');
            }
        }
        return content;
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
            selectedText: document.getSelection().toString(),
            left: event.pageX-40,
            top: event.pageY -50
        });
        
        var txt = document.getSelection().toString();
        
        if ( (txt.length > 0) && (!txt.match(/^\s$/))) {
            this.setState({ focusPopup: true });
        } else {
            this.setState({ focusPopup: false });
        }
    },

    termOverlay: function(){
        this.setState({ modalState: true });
    },

    handleModalState: function(st){
        this.setState({ modalState: st });
    },

	render: function() {
		var block = this.props.block;
        var myStyle = {
            left: this.state.left + "px",
            top: this.state.top + "px",
            position: "absolute",
            clear: "both"
        };

		return (
            <div className="block-inner">
                <div className="content" key={block.id} onMouseUp={this.overTerm} onMouseDown={this.downTerm} >
                    { this.state.focusPopup
                        ? <div className="focus" style={myStyle}>
                            <a onClick={this.termOverlay}>
                                <i className="fa fa-book fa-fw" title="Glossary" aria-hidden="true"></i>
                            </a>
                        </div>
                        : null
                    }
                    
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
                        <TermOverlay select={this.state.selectedText} modalState={this.handleModalState}/>
                    </Modal>
                    : null
                }

                <NotificationSystem ref="notificationSystem"/>
            </div>
        );
	}
});

module.exports = TextBlock;
