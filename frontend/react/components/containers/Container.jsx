var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Page = require('./Page.jsx');
var Menu = require('./Menu.jsx');
var ReactDOM = require('react-dom');
var dragula = require('react-dragula');
var Loader = require('../widgets/Loader.jsx');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var NotificationSystem = require('react-notification-system');
var Modal = require('../widgets/Modal.jsx');


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
        this.serverRequest = $.get("/containers/" + this.props.params.id + ".json", function (result) {
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

    deletePage: function(activePage, page){
        var that = this;
        // NotificationSystem popup

        this._notificationSystem.addNotification({
            title: 'Confirmer la suppression',
            message: 'Voulez-vous supprimer la page ' + page.name + ' ?',
            level: 'success',
            position: 'tc',
            timeout: '10000',
            action: {
                label: 'yes',
                callback: function() {
                    $.ajax({
                        type: "DELETE",
                        url: "/pages/" + page.id,
                        context: that,
                        success: function(data){
                            var pagesList = that.state.pages.filter((i, _) => i["id"] !== data.page);
                            that.setState({ pages: pagesList });

                            if ((pagesList.length == 0) || parseInt(activePage) == parseInt(page.id)) {
                                window.location = "/#/containers/" + this.state.container.id;
                            } else {
                                window.location = "/#/containers/" + this.state.container.id + "/" + pagesList[0]["id"];
                            }
                        }
                    });
                }
            }
        });
    },

    dragPages: function(pageList) {
        /* updates this.state.pages from a drag and drop action into <Menu /> */
        pageList[0]["level"] = 0;

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

    changePageName: function(pageName, pageId) {
        var pages = this.state.pages;
        for (var i in pages) {
            if (pages[i].id == pageId)
                pages[i].name = pageName;
        }
        this.setState({ pages: pages });
    },

    createPage: function() {
        $.ajax({
            type: "POST",
            url: '/pages',
            context: this,
            data: { 
                page: { 
                    name: this.state.newPageValue, 
                    content: '', 
                    sequence: 0,
                    level: 0, 
                    container_id: this.state.container.id 
                }
            },
            success: function(data) {
                this.setState({ pages: this.state.pages.concat([data]) });
                window.location = "/#/containers/"+this.state.container.id+"/"+data.id;
            }
        });
    },

    handlePageName: function(event) {
        this.setState({ newPageValue: event.target.value });
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
                                pages={pages} 
                                container={container} 
                                dragAction={this.dragPages} 
                                levelizeAction={this.levelizePages} 
                                pageDeletion={this.deletePage} 
                                activePage={this.props.routeParams.pageId ? this.props.routeParams.pageId : this.state.activePage.id} 
                            />
                        </aside>
                    </ReactCSSTransitionGroup>

                    <div id="container-wrapper">
                        { this.state.loading
                            ? null
                            : <div className="content">
                                { this.props.routeParams.pageId 
                                    ? <Page 
                                            key={this.props.routeParams.pageId} 
                                            container={this.state.container}
                                            page={this.props.routeParams.pageId} 
                                            types={this.state.types}
                                            changePageName={this.changePageName}
                                        /> 
                                    : null 
                                }

                                { !this.props.routeParams.pageId && this.state.activePage 
                                    ? <Page 
                                            key={this.state.activePage.id} 
                                            container={this.state.container}
                                            page={this.state.activePage.id} 
                                            types={this.state.types}
                                            changePageName={this.changePageName} 
                                        /> 
                                    : null 
                                }

                                { !this.props.routeParams.pageId && !this.state.activePage 
                                    ? <div id="create_new_page">
                                        <span className="input-group-addon">
                                            <i className="fa fa-plus fa-fw"></i>
                                        </span>
                                        <input type="text" value={this.state.newPageValue} placeholder="Titre de la page..." onChange={this.handlePageName}/><br/>
                                            { this.state.newPageValue ? <button onClick={this.createPage} className="btn-success"><i className="fa fa-check"></i></button> : null }
                                    </div>
                                    : null
                                }
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
