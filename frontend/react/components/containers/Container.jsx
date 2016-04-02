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
        console.log(container);
        return (
            <div className="col-lg-12">
                <nav className="navbar navbar-default navbar-static-top" role="navigation">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                            <i className="fa fa-bars"></i>
                        </button>
                        <a className="navbar-brand" href={"/containers/"+container.id}>
                            <img src="/templates/iutenligne/img/cartable.png" border="0"/>
                            <h1>
                                {container.name} 
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
                        <Link to={"/containers/"+container.id}>Containers</Link>
                        <input type="button" onClick={this.generateContainer} value="Generate" />
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            Pas encore de contenu ici
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Container;