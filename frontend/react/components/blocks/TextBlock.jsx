var React = require('react');
var NotificationSystem = require('react-notification-system');
var Glossaries = require('../glossaries/Glossaries.jsx');
var Term = require('../glossaries/term.jsx');


var TextBlock = React.createClass({
	getInitialState: function() {
        return {
            blockContent: '',
            editButton: true,
            myStyle: '',
            left: '',
            top: '',
            termsList: [] 
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
            left: event.screenX,
            top: event.clientY - 60,
        });
        this.setState({ focusPopup: true });
        var select = document.getSelection().toString();
    },
    downTerm: function(event){
        this.setState({ focusPopup: false });
        this.setState({ overlayAdd: false });
        this.setState({ overlayTerm: false });
    },
    handleClickOutside: function(event){
        this.setState({ focusPopup: false });
        this.setState({ overlayAdd: false });
        this.setState({ overlayTerm: false });
    },
    addOverlay: function(){
        this.setState({ overlayAdd: true });
        this.setState({ overlayTerm: false });
    },
    termOverlay: function(){
        this.setState({ overlayTerm: true });
        this.setState({ overlayAdd: false });
    },

	render: function() {
		var block = this.props.block;
        var TextBlock = this.props.item;
        console.log(this.state.termsList); 
        var myStyle = "left : " + this.state.left + "px ; top: " + this.state.top + "px " ;
		return (
            <div className="block-inner">
                <div className="content" key={block.id} onMouseUp={this.overTerm} onMouseDown={this.downTerm} >
                    <div className="focus" style={{myStyle}} >
                        <a onClick={this.termOverlay}>
                            <i className="fa fa-book fa-fw" title="Glossary" aria-hidden="true"></i>
                        </a>
                        <a onClick={this.addOverlay}>
                            <i className="fa fa-plus fa-fw" title="Add" aria-hidden="true"></i>
                        </a>
                    </div>
                    <div className="block-title">
                        <i className="fa fa-pencil"></i>
                        <h3>{block.name}</h3>
                    </div>
                    <div id={this.dynamicId(block.id)} className="block-content" ref="editableblock" dangerouslySetInnerHTML={this.createMarkup(this.state.blockContent)} onClick={this.unlockEditor} />
                </div>

                { this.state.editButton ? <button className="btn-block" onClick={this.unlockEditor}><i className="fa fa-pencil"></i></button> : <button className="btn-block" onClick={this.saveBlock}><i className="fa fa-check"></i></button> }

                {this.state.overlayAdd ? 
                <div className="overlay">
                    <Glossaries/>
                </div>: null }

                {this.state.overlayTerm ? 
                <div className="overlay">
                    <ul>
                        {this.state.termsList.map(function(term){
                            return(
                                <li key={term.id}>
                                    <label for={term.id}> 
                                        <input type="checkbox"/>
                                        {term.name} 
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>: null }
                <NotificationSystem ref="notificationSystem"/>
            </div>
        );
	}
});

module.exports = TextBlock;
