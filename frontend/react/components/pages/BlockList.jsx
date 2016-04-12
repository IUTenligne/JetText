var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';

var BlockList = React.createClass({
    getInitialState: function() {
        return {
          blocks: []
        };
    },

    componentDidMount: function() {
        this.setState({ blocks: this.props.items });
    },

    render: function() {
        var blocks = this.state.blocks;
        return (
            <div className="row" key={Math.random()}>
                {blocks.forEach(function(block){
                    <p>{block.name}</p>
                })}
            </div>
        );
    }
});

module.exports = BlockList;