var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Editor = require('./Editor.jsx');

var Page = React.createClass({
  getInitialState: function() {
    return {
      page: '',
      pages: []
    };
  },
  
  componentDidMount: function() {
    this.serverRequest = $.get("/pages/"+this.props.params.id+".json", function (result) {
      this.setState({
        page: result.page,
        pages: result.pages
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
      <div>
        <div>
          {this.state.pages.map(function(page){
            return (
              <li key={page.id}>
                <Link to={"/pages/"+page.id}>{page.name}</Link>
              </li>
            );
          })}
        </div>
        <div className="col-lg-12">
          <Link to={"/containers/"+page.container_id}>Containers</Link>
          <input type="button" onClick={this.generateContainer} value="Generate" />
          <Editor key={Math.random()}>
            {this.props.params}
          </Editor>
        </div>
      </div>
    );
  }

});

module.exports = Page;