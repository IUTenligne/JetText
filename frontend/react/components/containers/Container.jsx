var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Menu = require('./Menu.jsx');
var Page = require('../pages/Page.jsx');
var NotificationSystem = require('react-notification-system');


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
            if (result.pages[0]) {
                this.setState({
                    container: result.container,
                    pages: result.pages,
                    activePage: result.pages[0]
                });
            } else {
                this.setState({
                    container: result.container,
                    pages: [],
                    activePage: ''
                });
            }
        }.bind(this));

        this._notificationSystem = this.refs.notificationSystem;
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    handleChange: function(event) {
        this.setState({newPageValue: event.target.value});
    },

    createPage: function(event) {
        $.ajax({
            type: "POST",
            url: '/pages',
            context: this,
            data: { page: { name: this.state.newPageValue, content: '', container_id: this.state.container.id } },
            success: function(data) {
                this.setState({ 
                    pages: this.state.pages.concat([data]),
                    newPageValue: ''
                });
            }
        });

        event.target.value='';
    },

    deletePage: function(event){
        if (this.props.routeParams.pageId) {
            var pageId = this.props.routeParams.pageId;
        } else {
            var pageId = this.state.activePage.id;
        }

        $.ajax({
            type: "POST",
            url: "/pages/delete/"+pageId,
            context: this,
            success: function(data){
                // filter the pages state array to remove deleted page
                this.setState({
                    pages: this.state.pages.filter((i, _) => i["id"] !== data.page)
                });

                window.location.replace("/#/containers/"+this.state.container.id+"/"+this.state.pages[0].id);
            }
        });

        // NotificationSystem popup
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Container successfully deleted !',
            level: 'success'
        });
    },

    _notificationSystem: null,

    render: function() {
        var container = this.state.container;  
        var pages = this.state.pages;
        return (
            <div className="col-lg-12">

                <NotificationSystem ref="notificationSystem" />

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

                            <Menu key={Math.random()} className="menu" items={pages} container={container.id} ref="menuElm" />

                            <ul id="add_new_page">
                                <form>
                                <p>Create new page</p>
                                    <p>
                                        <input type="text" id="new_page" className="form-control" value={this.state.newPageValue} onChange={this.handleChange} autoComplete="off"/>
                                        <input type="submit" value='Save' className="btn-success" onClick={this.createPage}/>
                                    </p>
                                </form>
                            </ul>
                       </div>
                    </div>
                </nav>

                <div id="page-wrapper">
                    <div className="row">
                        <input type="button" onClick={this.deletePage} value="Delete"/>
                        { this.props.routeParams.pageId ? <Page key={this.props.routeParams.pageId} page={this.props.routeParams.pageId} /> : <Page key={this.state.activePage.id} page={this.state.activePage.id} /> }
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Container;