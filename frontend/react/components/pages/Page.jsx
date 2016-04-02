var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Editor = require('./Editor.jsx');
var Menu = require('../containers/Menu.jsx');

var Page = React.createClass({
    getInitialState: function() {
        return {
          page: ''
        };
    },
  
    componentDidMount: function() {
        this.serverRequest = $.get("/pages/"+this.props.page+".json", function (result) {
            this.setState({
                page: result.page,
            });
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    generateContainer: function() {
        this.serverRequest = $.get("/generate_container/"+this.state.page.container_id);
    },

    render: function() {
        var page = this.state.page;
        return (
            <div className="row">
                <Editor key={page.id} page={page} />
            </div>
        );
    }
});

module.exports = Page;