var React = require('react');

var Block = React.createClass({
    getInitialState: function() {
        return {
          blockContent: ''
        };
    },

    handleClick: function(event) {
        var that = this;

        var editor = CKEDITOR.replace(event.target, {
            customConfig: '/assets/cke/custom_config.js'
        });
        editor.on('change', function( evt ) {
            // setState to allow changes to be saved on submit
            that.setState({ blockContent: evt.editor.getData() });
        });
        CKEDITOR.plugins.addExternal('uploader', '/assets/cke/plugins/uploader/', 'plugin.js');
    },

    componentWillUnmount: function() {
        var editor = CKEDITOR.instances['editor1'];
        if (editor) { editor.destroy(true); }
    },

    saveBlock: function(event) {
        var block = this.props.item;

        $.ajax({
            type: "PUT",
            url: '/blocks/'+block.id,
            data: { id: block.id, content: this.state.blockContent }
        });

        event.target.value='';
    },

    render: function() {
        var block = this.props.item;
        return (
            <div>
                <div className="row" key={block.id} ref="editableblock" onClick={this.handleClick} dangerouslySetInnerHTML={createMarkup(block.content)} />
                <input type="submit" value='Save' className="btn-success" onClick={this.saveBlock}/>
            </div>
        );
    }
});

function createMarkup(data) {
    return {__html: data};
};

module.exports = Block;

