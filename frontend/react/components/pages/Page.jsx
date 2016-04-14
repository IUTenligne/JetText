var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Editor = require('./Editor.jsx');
var Menu = require('../containers/Menu.jsx');
var Block = require('./Block.jsx');

var Page = React.createClass({
    getInitialState: function() {
        return {
          page: '',
          blocks: [],
          newBlockValue: ''
        };
    },
  
    componentDidMount: function() {
        this.serverRequest = $.get("/pages/"+this.props.page+".json", function (result) {
            this.setState({
                page: result.page,
                blocks: result.blocks
            });
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    handleChange: function(event) {
        this.setState({ newBlockValue: event.target.value });
    },

    createBlock: function(event) {
        $.ajax({
            type: "POST",
            url: '/blocks',
            context: this,
            data: { block: { name: this.state.newBlockValue, content: '', page_id: this.state.page.id } },
            success: function(data) {
                console.log("before:",this.state.blocks);
                this.setState({ 
                    blocks: this.state.blocks.concat([data]),
                    newBlockValue: ''
                });
                console.log("after:",this.state.blocks);
            }
        });

        event.target.value='';
    },

    render: function() {
        var page = this.state.page;
        return (
            <div className="row">
                {this.state.blocks.map(function(block){
                    return <Block key={Math.random()} item={block} />
                })}
                <form id="add_new_block">
                    <input type="text" id="new_block" className="form-control" value={this.state.newBlockValue} onChange={this.handleChange} autoComplete="off"/>
                    <input type="submit" value='Create' className="btn-success" onClick={this.createBlock}/>
                </form>
            </div>
        );
    }
});

module.exports = Page;