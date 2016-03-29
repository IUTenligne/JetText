var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Editor = require('./Editor.jsx');
var Menu = require('../containers/Menu.jsx');

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
        <div className="col-lg-12">
            <nav className="navbar navbar-default navbar-static-top" role="navigation">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <i className="fa fa-bars"></i>
                    </button>
                    <a className="navbar-brand" href={"/containers/"+page.container_id}>
                        <img src="/templates/iutenligne/img/cartable.png" border="0"/>
                        <h1>
                            Le super truc
                        </h1>
                    </a>
                </div> 
                <div className="navbar-default sidebar menu" role="navigation">
                    <div className="sidebar-nav navbar-collapse">
                        <a href="http://www.iutenligne.net/resources.html">
                            <img src="/templates/iutenligne/img/iutenligne.png" border="0"/>
                        </a>
                        <ul className="nav pages-panel sortable" id="side-menu">
                            <Menu items={this.state.pages}/>
                        </ul>
                    </div>
                </div>
            </nav>
            <div id="page-wrapper">
                <div className="row">
                    <Link to={"/containers/"+page.container_id}>Containers</Link>
                    <input type="button" onClick={this.generateContainer} value="Generate" />
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <Editor key={Math.random()}>
                            {this.props.params}
                        </Editor>
                    </div>
                </div>
            </div>
        </div>
    );
  }
});

module.exports = Page;