var React = require('react');

var Block = React.createClass({
    getInitialState: function() {
        return {
          blockContent: ''
        };
    },

    componentDidMount: function() {
        var that = this;

        var editor = CKEDITOR.replace("block_"+this.props.item.id, {
            customConfig: '/assets/cke/custom_config.js'
        });
        editor.on('change', function( evt ) {
            // setState to allow changes to be saved on submit
            that.setState({ blockContent: evt.editor.getData() });
        });
        CKEDITOR.plugins.addExternal('uploader', '/assets/cke/plugins/uploader/', 'plugin.js');
    },

    componentWillUnmount: function() {
        var editor = CKEDITOR.instances["block_"+this.props.item.id];
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

    createMarkup: function(data) {
        return {__html: data};
    },

    dynamicId: function(id){
        return "block_" + id
    },

    render: function() {
        var block = this.props.item;
        return (
            <div>
                <div className="row" key={block.id}>
                    <h3>{block.name}</h3>
                    <div id={this.dynamicId(block.id)} ref="editableblock" dangerouslySetInnerHTML={this.createMarkup(block.content)} />
                </div>
                <input type="submit" value="Save" className="btn-success" onClick={this.saveBlock} />
            </div>
        );
    }
});

module.exports = Block;

