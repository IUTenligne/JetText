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
            newPageValue: ''
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
            data: { page: { name: this.state.newPageValue, content: '', container_id: this.state.container.id } }
        });
    },

    render: function() {
      var container = this.state.container;
      var pages = this.state.pages;
      return (
        <div className="containers">
              <div className="row">
                    <div className="col-lg-12">
                       <div className="tags">
                          <div className="tag tagWidth" key={container.id}>
                              <div className="triangle">
                              </div>
                              <div className="contenu">
                                  <div className="img">
                                      <i className="fa fa-folder-open-o"></i>
                                  </div>
                                  <div className="elem">
                                      <div className="name">
                                          {container.id}
                                      </div>
                                      <div className="option">
                                          {container.name} - {container.content}
                                      </div>
                                  </div>
                              </div>
                          </div>
                       </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <Menu key={Math.random()} className="menu" items={pages} container={container.id} />
                    </div>
                </div>
                <div className="col-lg-12">
                    <div id="page-wrapper">
                        { this.props.routeParams.pageId ? <Page key={this.props.routeParams.pageId} page={this.props.routeParams.pageId} /> : <Page key={this.state.activePage.id} page={this.state.activePage.id} /> }
                    </div>
                </div>
        </div>
      );
    }
});

module.exports = Container;