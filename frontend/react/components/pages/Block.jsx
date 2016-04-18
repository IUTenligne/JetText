var React = require('react');
var NotificationSystem = require('react-notification-system');

var style = {
    NotificationItem: { 
        DefaultStyle: { 
            margin: '50px 5px 2px 1px',
            background: " #eeeeee",
        },
    }
}

var Block = React.createClass({
    getInitialState: function() {
        return {
          blockContent: '',
          editButton: true,
          fileValue: ''
        };
    },

    componentDidMount: function() {
        this.setState({ 
            blockContent: this.props.item.content
        });
        this._notificationSystem = this.refs.notificationSystem;
    },


    componentWillUnmount: function() {
        var editor = CKEDITOR.instances["block_"+this.props.item.id];
        if (editor) { editor.destroy(true); }
    },

    unlockEditor: function() {
        var that = this;
        this.setState({ editButton: false });

        var editor = CKEDITOR.replace("block_"+this.props.item.id, {
            customConfig: '/assets/cke/custom_config.js'
        });
        editor.on('change', function( evt ) {
            // setState to allow changes to be saved on submit
            that.setState({ blockContent: evt.editor.getData() });
        });
        CKEDITOR.plugins.addExternal('uploader', '/assets/cke/plugins/uploader/', 'plugin.js');
    },

    saveBlock: function(event) {
        var block = this.props.item;

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

        var editor = CKEDITOR.instances["block_"+this.props.item.id];
        if (editor) { editor.destroy(true); }

        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Block saved !',
            level: 'success'
        }); 
    },

    addFile: function(event) {
        this.setState({ fileValue: event.target.files[0] });
    },

    submitMedia: function(event) {
        event.preventDefault();
        console.log($(this.refs.mediaFile.files[0])[0]);
        var formData = new FormData();
        formData.append("tempfile", $(this.refs.mediaFile.files[0])[0]);

        $.ajax({
            url: '/uploads',
            type: "POST",
            contentType: false,
            cache: false,
            processData: false,
            data: formData
        });
    },

    createMarkup: function(data) {
        return {__html: data};
    },

    dynamicId: function(id){
        return "block_" + id;
    },

    _notificationSystem: null,

    render: function() {
        var block = this.props.item;

        /* Text block */
        if (block.type_id === 1) {
            return (
                <div className="block">
                    <div key={block.id}>
                        <h3>{block.name}</h3>
                        <div id={this.dynamicId(block.id)} ref="editableblock" dangerouslySetInnerHTML={this.createMarkup(this.state.blockContent)} />
                    </div>
                    { this.state.editButton ? <input type="button" className="btn-success" onClick={this.unlockEditor} value="Edit" /> : <input type="submit" value="Save" className="btn-success" onClick={this.saveBlock} /> }     
                </div>
            );

        /* Media block */    
        } else if (block.type_id === 2) {
            return (
                <div className="block">
                    <div key={block.id}>
                        <h3>{block.name}</h3>
                        <form className="new_upload" id="new_upload" ref="mediaForm" encType="multipart/form-data" onSubmit={this.submitMedia} action="/uploads" method="post">
                            <input className="uploader" name="upload[file]" ref="mediaFile" id="upload_file" type="file" />
                            <input type="submit" value="Save" className="btn-success" />
                        </form>
                        
                        <div id={this.dynamicId(block.id)} dangerouslySetInnerHTML={this.createMarkup(this.state.blockContent)} />
                    </div>
                    { this.state.editButton ? <input type="button" className="btn-success" onClick={this.unlock} value="Edit" /> : <input type="submit" value="Save" className="btn-success" onClick={this.saveBlock} /> }     
                </div>
            );

        } else {
            return null;
        }

        <NotificationSystem ref="notificationSystem" style={style}/>
    }
});

module.exports = Block;

