var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Page = require('./Page.jsx');
var Menu = require('./Menu.jsx');
var ReactDOM = require('react-dom');
var dragula = require('react-dragula');
var Loader = require('../widgets/Loader.jsx');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var NotificationSystem = require('react-notification-system');


var Container = React.createClass({
    getInitialState: function() {
        return {
            status: 0,
            container: '',
            containerName: '',
            changeContainerName: false,
            pages: [],
            types: [],
            activePage: '',
            newPageValue: '',
            loading: true
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/containers/"+this.props.params.id+".json", function (result) {
            if (result.pages && result.pages[0]) {
                this.setState({
                    status: result.status,
                    container: result.container,
                    containerName: result.container.name,
                    pages: result.pages,
                    activePage: result.pages[0],
                    loading: false
                });
            } else if (result.container) {
                this.setState({
                    status: result.status,
                    container: result.container,
                    containerName: result.container.name,
                    loading: false
                });
            } else {
                this.setState({
                    containerName: result.container.name,
                    status: result.status,
                    loading: false
                });
            }
        }.bind(this));

        this.serverRequest = $.get("/types.json", function (result) {
            this.setState({
                types: result.types
            });
        }.bind(this));

        this._notificationSystem = this.refs.notificationSystem;
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    deletePage: function(activePage, pageId){
        var that = this;
        // NotificationSystem popup

        this._notificationSystem.addNotification({
            title: 'Confirm delete',
            message: 'Delete the page ?',
            level: 'success',
            position: 'tc',
            timeout: '10000',
            action: {
                label: 'yes',
                callback: function() {
                    $.ajax({
                        type: "DELETE",
                        url: "/pages/"+pageId,
                        context: that,
                        success: function(data){
                            var pagesList = that.state.pages.filter((i, _) => i["id"] !== data.page);
                            that.setState({ pages: pagesList });

                            if ((pagesList.length == 0) || parseInt(activePage) == parseInt(pageId)) {
                                window.location.replace("/#/containers/"+this.state.container.id);
                            }
                        }
                    });
                }
            }
        });
    },

    dragPages: function(pageList) {
        /* updates this.state.pages from a drag and drop action into <Menu /> */
        if (pageList.length == 0) {
            this.setState({
                pages: pageList,
                activePage: ''
            });
        } else {
            this.setState({
                pages: pageList
            });
        }
    },

    levelizePages: function(pageList, trick) {
        /* updates this.state.pages from the levelize action into <Menu /> */
        this.setState({
            pages: pageList
        });
    },

    handleContainerName: function(event) {
        this.setState({
            containerName: event.target.value,
            changeContainerName: true
        });
    },

    saveContainerName: function() {
        $.ajax({
            type: "PUT",
            url: '/containers/'+this.state.container.id,
            context: this,
            data: { 
                name: this.state.containerName
            },
            success: function(data) {
                this.setState({
                    changeContainerName: false
                });
            }
        });
    },

    _notificationSystem: null,

    render: function() {
        var container = this.state.container;
        var pages = this.state.pages;
        try {
            return (
                <div id="container">

                    <NotificationSystem ref="notificationSystem" />

                    <ReactCSSTransitionGroup transitionName="menu-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppear={true} transitionAppearTimeout={500}>
                        <aside id="sidebar-wrapper">
                            <Menu 
                                key={Math.floor((Math.random() * 900))} 
                                pages={pages} container={container} 
                                dragAction={this.dragPages} 
                                levelizeAction={this.levelizePages} 
                                pageDeletion={this.deletePage} 
                                activePage={this.props.routeParams.pageId ? this.props.routeParams.pageId : this.state.activePage.id} 
                            />
                        </aside>
                    </ReactCSSTransitionGroup>

                    <div id="container-wrapper">
                        { this.state.loading
                            ? <Loader />
                            : <div className="header">
                                <a href={"/#/containers/"+container.id} key={container.id}>
                                    <h1>
                                        <input ref="containername" type="text" value={this.state.containerName} placeholder="Container's name..." onChange={this.handleContainerName}/>
                                        { this.state.changeContainerName ? <button onClick={this.saveContainerName}><i className="fa fa-check"></i></button> : null }
                                    </h1>
                                </a>
                            </div>
                        }
                        { this.state.loading
                            ? null
                            : <div className="content">
                                { this.props.routeParams.pageId ? <Page key={this.props.routeParams.pageId} page={this.props.routeParams.pageId} types={this.state.types} /> : null }
                                { !this.props.routeParams.pageId && this.state.activePage ? <Page key={this.state.activePage.id} page={this.state.activePage.id} types={this.state.types} /> : null }
                            </div>
                        }
                    </div>

                </div>
            );
        } catch(err) {
            console.log(err);
        }
    }
});

module.exports = Container;
