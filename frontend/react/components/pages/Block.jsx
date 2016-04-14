var React = require('react');
var AlloyEditor = require('alloyeditor');

var Block = React.createClass({
    getInitialState: function() {
        return {
          blockContent: '',
          editedBlock: ''
        };
    },

    handleClick: function(event) {
        var that = this;
        if (this._editor) {
            this._editor.destroy();
        }

        this.setState({ editedBlock: event.target });

        /*var editor = CKEDITOR.replace(event.target, {
            customConfig: '/assets/cke/custom_config.js'
        });
        editor.on('change', function( evt ) {
            // setState to allow changes to be saved on submit
            that.setState({ blockContent: evt.editor.getData() });
        });
        CKEDITOR.plugins.addExternal('uploader', '/assets/cke/plugins/uploader/', 'plugin.js');*/
        console.log(this.state.editedBlock);
        this._editor = AlloyEditor.editable(this.state.editedBlock);
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
                    <div id={this.dynamicId(block.id)} onClick={this.handleClick}>
                        <div ref="editableblock" dangerouslySetInnerHTML={this.createMarkup(block.content)} />
                    </div>
                </div>
                <input type="submit" value="Save" className="btn-success" onClick={this.saveBlock} />
            </div>
        );
    }
});

module.exports = Block;

