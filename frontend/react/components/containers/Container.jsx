var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Menu = require('./Menu.jsx');

var Container = React.createClass({
	getInitialState: function() {
    return {
      container: '',
      pages: [],
      newPageValue: ''
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

  handleChange: function(event) {
    this.setState({newPageValue: event.target.value});
  },

  postData: function(event) {
    $.ajax({
      type: "POST",
      url: '/pages',
      data: { page: { name: this.state.newPageValue, content: '', container_id: this.state.container.id } }
    });
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
        <div>
          <input
            type="text"
            id="new_container"
            value={this.state.newContainerValue}
            onChange={this.handleChange}
          />
          { this.state.newPageValue ? <input type="button" onClick={this.postData} value="Save" /> : null }
        </div>
	    </div>
    );
  }
});

module.exports = Container;