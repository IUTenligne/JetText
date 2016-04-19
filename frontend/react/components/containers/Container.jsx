var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Page = require('./Page.jsx');
var Menu = require('./Menu.jsx');
var ReactDOM = require('react-dom');
var dragula = require('react-dragula');
var NotificationSystem = require('react-notification-system');


var Container = React.createClass({
    getInitialState: function() {
        return {
            container: '',
            pages: [],
            activePage: '',
            newPageValue: '',
            isNew: false
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
                    activePage: '',
                    isNew: true
                });
            }
        }.bind(this));

        this._notificationSystem = this.refs.notificationSystem;
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    deletePage: function(event){
        if (this.props.routeParams.pageId) {
            var pageId = this.props.routeParams.pageId;
        } else {
            var pageId = this.state.activePage.id;
        }

        var loc = this.props;
        var that = this;
        // NotificationSystem popup
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Confirm delete',
            message: 'Delete the page ?',
            level: 'success',
            position: 'tc',
            timeout: '10000',
            action: {
                label: 'yes',
                callback: function() {
                    if (loc.routeParams.pageId) {
                        var pageId = loc.routeParams.pageId;
                    } else {
                        var pageId = that.state.activePage.id;
                    }
                    $.ajax({
                        type: "DELETE",
                        url: "/pages/"+pageId,
                        context: that,
                        success: function(data){
                            that.setState({
                                pages: that.state.pages.filter((i, _) => i["id"] !== data.page)
                            });

                            window.location.replace("/#/containers/"+this.state.container.id+"/"+this.state.pages[0].id);
                        }
                    });
                }
            }
        });
    },

    dragPages: function(pageList) {
        /* updates this.state.pages from a drag and drop action into <Menu /> */
        this.setState({
            pages: pageList
        });
    },

    _notificationSystem: null,

    render: function() {
        var container = this.state.container;  
        var pages = this.state.pages;
        var isNew = this.state.isNew;
        return (
            <div className="col-lg-12">

                <NotificationSystem ref="notificationSystem" />

                <nav className="navbar navbar-default navbar-static-top" role="navigation">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                            <i className="fa fa-bars fa-fw"></i>
                        </button>
                        <a className="navbar-brand" href='#' key={container.id}>
                            <img src="/templates/iutenligne/assets/img/cartable.png" border="0"/>
                            <h1>
                                {container.name}
                            </h1>
                        </a>
                    </div>

                    <Menu key={Math.floor((Math.random() * 900))} pages={pages} container={container} dragAction={this.dragPages} />
                </nav>

                <div id="page-wrapper">
                    <div className="row">
                        { this.props.routeParams.pageId ? <Page key={this.props.routeParams.pageId} page={this.props.routeParams.pageId} /> : null }
                        { !this.props.routeParams.pageId && this.state.activePage ? <Page key={this.state.activePage.id} page={this.state.activePage.id} /> : null }
                        
                        <div className="bottom_bar">
                            { isNew ? null : <input type="button" onClick={this.deletePage} value="Delete page" className="btn btn-warning" /> }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Container;