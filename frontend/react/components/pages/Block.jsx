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
          editButton: true
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

    unlock: function() {
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
        this.setState({ editButton: true });

        $.ajax({
            type: "PUT",
            url: '/blocks/'+block.id,
            context: this,
            data: { id: block.id, content: this.state.blockContent },
            success: function(data) {
                this.setState({ blockContent: data.content })
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

    createMarkup: function(data) {
        return {__html: data};
    },

    dynamicId: function(id){
        return "block_" + id;
    },

    _notificationSystem: null,

    render: function() {
        var block = this.props.item;
        return (
            <div className="block">
                <div key={block.id}>
                    <h3>{block.name}</h3>
                    <div id={this.dynamicId(block.id)} ref="editableblock" dangerouslySetInnerHTML={this.createMarkup(this.state.blockContent)} />
                </div>

                { this.state.editButton ? <input type="button" className="btn-success" onClick={this.unlock} value="Edit" /> : <input type="submit" value="Save" className="btn-success" onClick={this.saveBlock} /> }

                <NotificationSystem ref="notificationSystem" style={style}/>
            </div>
        );
    }
});

module.exports = Block;

