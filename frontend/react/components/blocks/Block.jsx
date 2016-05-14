var React = require('react');
var TextBlock = require('./TextBlock.jsx');
var MediaBlock = require('./MediaBlock.jsx');
var NoteBlock = require('./NoteBlock.jsx');
var NotificationSystem = require('react-notification-system');

var Block = React.createClass({
    getInitialState: function() {
        return {
            editBlock: true
        };
    },

    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },

    removeBlock: function(event){
        var that = this;

        for (name in CKEDITOR.instances) {
            CKEDITOR.instances[name].destroy(true);
        }

        // NotificationSystem popup
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Confirm delete',
            message: 'Delete the block ?',
            level: 'success',
            position: 'tc',
            timeout: '10000',
            action: {
                label: 'yes',
                callback: function() {
                    $.ajax({
                        type: "DELETE",
                        url: "/blocks/" + that.props.item.id,
                        context: that,
                        success: function(data){
                            /* passes the deleted block_id to the parent (Page) to handle the DOM rerendering */
                            that.props.removeBlock(data.block);
                        }
                    });
                }
            }
        });
    },

    editBlock: function() {
        this.setState({ editBlock: !this.state.editBlock });
    },

    handleBlockEditState: function(st) {
        this.setState({ editBlock: st });
    },

    _notificationSystem: null,

    render: function() {
        var block = this.props.item;

        if (block.type_id === 1) {
            return (
                <div className="block block-text" data-id={block.id}>
                    <TextBlock block={block} key={block.id} containerId={this.props.containerId} editBlockAction={this.handleBlockEditState} editBlock={this.state.editBlock} />
                    <div className="block-actions">
                        { this.state.editBlock
                            ? <button className="text-block-edit" onClick={this.editBlock}><i className="fa fa-pencil"></i> Edit</button>
                            : <button className="text-block-save" onClick={this.editBlock}><i className="fa fa-check"></i> Save</button>
                        }
                        <button className="btn-block" onClick={this.removeBlock}><i className="fa fa-remove"></i> Delete</button>
                        <button className="handle">+ Drag</button>
                        <NotificationSystem ref="notificationSystem" />
                    </div>
                </div>
            );
        } else if (block.type_id === 2) {
            return (
                <div className="block block-media" data-id={block.id}>
                    <MediaBlock block={block} key={block.id} />
                    <div className="block-actions">
                        <button className="btn-block" onClick={this.removeBlock}><i className="fa fa-remove"></i> Delete</button>
                        <button className="handle">+ Drag</button>
                        <NotificationSystem ref="notificationSystem" />
                    </div>
                </div>
            );
        } if (block.type_id === 3) {
            return (
                <div className="block block-note" data-id={block.id}>
                    <NoteBlock block={block} key={block.id} containerId={this.props.containerId} editBlockAction={this.handleBlockEditState} editBlock={this.state.editBlock} />
                    <div className="block-actions">
                        { this.state.editBlock
                            ? <button className="note-block-edit" onClick={this.editBlock}><i className="fa fa-pencil"></i> Edit</button>
                            : <button className="note-block-save" onClick={this.editBlock}><i className="fa fa-check"></i> Save</button>
                        }
                        <button className="btn-block" onClick={this.removeBlock}><i className="fa fa-remove"></i> Delete</button>
                        <button className="handle">+ Drag</button>
                        <NotificationSystem ref="notificationSystem" />
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
});

module.exports = Block;
