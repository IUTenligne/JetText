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
            status: 0,
            container: '',
            pages: [],
            activePage: '',
            newPageValue: '',
            isNew: false
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/containers/"+this.props.params.id+".json", function (result) {
            if (result.pages && result.pages[0]) {
                this.setState({
                    status: result.status,
                    container: result.container,
                    pages: result.pages,
                    activePage: result.pages[0]
                });
            } else if (result.container) {
                this.setState({
                    status: result.status,
                    container: result.container,
                    isNew: true
                });
            } else {
                this.setState({
                    status: result.status,
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

    levelizePages: function(pageList, trick) {
        /* updates this.state.pages from the levelize action into <Menu /> */
        this.setState({
            pages: pageList
        });
    },

    _notificationSystem: null,

    render: function() {
        var container = this.state.container;
        var pages = this.state.pages;
        var isNew = this.state.isNew;
        try {
            return (
                <div id="container">

                    <NotificationSystem ref="notificationSystem" />

                    <aside id="sidebar-wrapper">
                        <Menu key={Math.floor((Math.random() * 900))} pages={pages} container={container} dragAction={this.dragPages} activePage={this.props.routeParams.pageId ? this.props.routeParams.pageId : this.state.activePage.id} />
                    </aside>

                    <div id="container-wrapper">
                        <div className="header">
                            <a href={"/#/containers/"+container.id} key={container.id}>
                                <h1>
                                    {container.name}
                                </h1>
                            </a>
                        </div>

                        <div className="content">
                            { this.props.routeParams.pageId ? <Page key={this.props.routeParams.pageId} page={this.props.routeParams.pageId} /> : null }
                            { !this.props.routeParams.pageId && this.state.activePage ? <Page key={this.state.activePage.id} page={this.state.activePage.id} /> : null }

                            <div className="bottom_bar">
                                { isNew ? null : <input type="button" onClick={this.deletePage} value="Delete page" className="btn btn-warning" /> }
                            </div>
                        </div>
                    </div>

                </div>
            );
        } catch(err) {
            console.log(err);
        }
    }
});

module.exports = Container;
