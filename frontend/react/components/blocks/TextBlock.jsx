var React = require('react');
var NotificationSystem = require('react-notification-system');


var TextBlock = React.createClass({
	getInitialState: function() {
        return {
            blockContent: '',
            editButton: true
        };
    },

    componentDidMount: function() {
        this.setState({ 
            blockContent: this.props.block.content
        });
        this._notificationSystem = this.refs.notificationSystem;
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

	render: function() {
		var block = this.props.block;
		return (
            <div className="block">
                <div key={block.id}>
                    <h3>{block.name}</h3>
                    <div id={this.dynamicId(block.id)} ref="editableblock" dangerouslySetInnerHTML={this.createMarkup(this.state.blockContent)} />
                </div>
                { this.state.editButton ? <input type="button" className="btn-success" onClick={this.unlockEditor} value="Edit" /> : <input type="submit" value="Save" className="btn-success" onClick={this.saveBlock} /> }
                <NotificationSystem ref="notificationSystem"/>     
            </div>
        );
	}
});

module.exports = TextBlock;