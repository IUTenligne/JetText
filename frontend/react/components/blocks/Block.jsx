var React = require('react');
var TextBlock = require('./TextBlock.jsx');
var MediaBlock = require('./MediaBlock.jsx');

var Block = React.createClass({
    render: function() {
        var block = this.props.item;

        if (block.type_id === 1) {
            return <TextBlock block={block} key={block.id} />;
        } else if (block.type_id === 2) {
            return <MediaBlock block={block} key={block.id} />;
        } else {
            return null;
        }
    }
});

module.exports = Block;