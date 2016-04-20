var React = require('react');
var TextBlock = require('./TextBlock.jsx');
var MediaBlock = require('./MediaBlock.jsx');
var NotificationSystem = require('react-notification-system');

var Block = React.createClass({
    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },

    removeBlock: function(event){
        var that = this;

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

    _notificationSystem: null,

    render: function() {
        var block = this.props.item;

        if (block.type_id === 1) {
            return (
                <div className="block block-text">
                    <TextBlock block={block} key={block.id} />
                    <input type="button" value="Delete Block" className="btn" onClick={this.removeBlock} />
                    <NotificationSystem ref="notificationSystem" />
                </div>
            );
        } else if (block.type_id === 2) {
            return (
                <div className="block block-media">
                    <MediaBlock block={block} key={block.id} />
                    <input type="button" value="Delete Block" className="btn" onClick={this.removeBlock} />
                    <NotificationSystem ref="notificationSystem" />
                </div>
            );
        } else {
            return null;
        }
    }
});

module.exports = Block;