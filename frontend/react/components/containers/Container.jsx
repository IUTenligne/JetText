var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Menu = require('./Menu.jsx');

var Container = React.createClass({
	getInitialState: function() {
    return {
      container: "",
      pages: []
    };
  },
  
  componentDidMount: function() {
    this.serverRequest = $.get("/containers/"+this.props.params.id+".json", function (result) {
      this.setState({
        container: result.container,
        pages: result.pages
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
  	var container = this.state.container;
  	var pages = this.state.pages;
    return (
    	<div>
	      <div key={container.id}>
	        {container.id} - {container.name} - {container.content}
	      </div>
        <Menu items={pages}/>
	    </div>
    );
  }
});

module.exports = Container;