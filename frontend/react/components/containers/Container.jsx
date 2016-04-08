var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Menu = require('./Menu.jsx');
var Page = require('../pages/Page.jsx');

var Container = React.createClass({
	getInitialState: function() {
        return {
            container: '',
            pages: [],
            activePage: '',
            newPageValue: '',
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/containers/"+this.props.params.id+".json", function (result) {
            this.setState({
                container: result.container,
                pages: result.pages,
                activePage: result.pages[0]
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
            context: this,
            data: { page: { name: this.state.newPageValue, content: '', container_id: this.state.container.id } },
            success: function(data) {
                this.setState({ pages: this.state.pages.concat([data]) });
            }
        });
    },

    render: function() {
      var container = this.state.container;
      var pages = this.state.pages;
      return (
        <div className="col-lg-12">
            <nav className="navbar navbar-default navbar-static-top" role="navigation">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <i className="fa fa-bars"></i>
                    </button>
                    <a className="navbar-brand" href='#' key={container.id}>
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

                        <Menu key={Math.random()} className="menu" items={pages} container={container.id} />
                        
                        <ul id="add_new_page">
                            <form >
                                <p>
                                    <input type="text" id="text" className="form-control" value={this.state.newPageValue} onChange={this.handleChange}/>
                                    <input type="submit" value='Save' className="btn-success" onClick={this.postData}/>
                                </p>
                            </form>
                        </ul>
                   </div>
                </div>
            </nav>
            <div id="page-wrapper">
                <div className="row">
                     { this.props.routeParams.pageId ? <Page key={this.props.routeParams.pageId} page={this.props.routeParams.pageId} /> : <Page key={this.state.activePage.id} page={this.state.activePage.id} /> }
                </div>
            </div>
        </div>
      );
    }
});

module.exports = Container;