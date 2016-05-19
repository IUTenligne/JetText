var React = require('react');
var TextBlock = require('./TextBlock.jsx');
var MediaBlock = require('./MediaBlock.jsx');
var NoteBlock = require('./NoteBlock.jsx');
var Tooltip = require('../widgets/Tooltip.jsx');
var NotificationSystem = require('react-notification-system');


var Block = React.createClass({
    getInitialState: function() {
        return {
            editBlock: true,
            tooltipState: false
        };
    },

    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },

    removeBlock: function(event){
        var that = this;
        this._notificationSystem = this.refs.notificationSystem;

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

    handleRemoveBlock: function(block){
        /* removes a block from the children (TextBlock, NoteBlock) */
        var that = this;
        this._notificationSystem = this.refs.notificationSystem;

        for (name in CKEDITOR.instances) {
            CKEDITOR.instances[name].destroy(true);
        }

        // NotificationSystem popup
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
                        url: "/blocks/" + block.id,
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

    viewBlockAction: function() {
        this.setState({ tooltipState: !this.state.tooltipState });
    },

    handleTooltipState: function(st) {
        this.setState({ tooltipState: st });
    },

    _notificationSystem: null,

    render: function() {
        var block = this.props.item;

        if (block.type_id === 1) {
            return (
                <div className="block block-text" data-id={block.id}>
                    <TextBlock 
                        block={block} 
                        key={block.id} 
                        containerId={this.props.containerId}
                        removeMe={this.handleRemoveBlock}
                    />

                    <NotificationSystem ref="notificationSystem" />
                </div>
            );
        } else if (block.type_id === 2) {
            return (
                <div className="block block-media" data-id={block.id}>
                    <MediaBlock 
                        block={block} 
                        key={block.id} 
                    />

                    <div className="action">
                        <i className="fa fa-cog" onClick={this.viewBlockAction} ></i>
                        <button className="handle"></button>
                    </div>

                    <Tooltip tooltipState={this.handleTooltipState}>
                        { this.state.tooltipState
                            ? <div className="block-actions">
                                <button className="btn-block" onClick={this.removeBlock}><i className="fa fa-remove"></i> Delete</button><br/>
                                
                                <NotificationSystem ref="notificationSystem" />
                            </div>
                            : null
                        }   
                    </Tooltip>
                </div>
            );
        } if (block.type_id === 3) {
            return (
                <div className="block block-note" data-id={block.id}>
                    <NoteBlock 
                        block={block} 
                        key={block.id} 
                        containerId={this.props.containerId} 
                        removeMe={this.handleRemoveBlock}
                    />
                    
                    <NotificationSystem ref="notificationSystem" />
                </div>
            );
        } else {
            return null;
        }
    }
});

module.exports = Block;
