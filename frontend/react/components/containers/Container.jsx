var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Page = require('../pages/Page.jsx');
var ReactDOM = require('react-dom');
var dragula = require('react-dragula');
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
            var container = ReactDOM.findDOMNode(this.refs.dragulable);
            var drake = dragula([container]);
            this.moveItems(drake, result.pages);
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

    generateContainer: function(event){
       console.log(this.state.container.id);
       $.ajax({
            type: "GET",
            url: '/generate_container/'+this.state.container.id,
        });
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Container generate !',
            level: 'success'
        });   
    },

    moveItems: function(drake, pages) {
        drake.on('drag', function(element, source) {
          var index = [].indexOf.call(element.parentNode.children, element);
        });

        var that = this;

        drake.on('drop', function(element, target, source, sibling) {
            var index = [].indexOf.call(element.parentNode.children, element)
            var updated_order = [];

            $(source).children().each(function(i) {
                updated_order.push({ id: $(this).data('id'), weight: i });
            });

            $.ajax({
                type: "PUT",
                url: '/pages/sort',
                context: that,
                data: { order: updated_order },
                success: function(data) {
                    /* necessary to reorder the pages correctly 
                    sortedPages is filled with this.state.pages values following updated_order's new order */
                    var sortedPages = [];
                    for (var i in updated_order) {
                        var o = updated_order[i];
                        var page = $.grep(pages, function(e){ 
                        if (e.id == o.id)
                            return e; 
                        });
                        sortedPages.push(page[0]);
                    }

                    that.setState({
                        pages: sortedPages
                    });           
                }
            });
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

                            <div>
                                <ul className="menu-container nav" id="side-menu" ref="dragulable">
                                  {pages.map((page, i) => {
                                    return (
                                      <li key={ Math.floor((Math.random() * 900)) } data-pos={i} data-id={page.id}>
                                        <Link to={"/containers/"+this.props.container+"/"+page.id} onClick={this._updateMenuKey}>{page.name}</Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                            </div>
                            
                            <div>
                                <input type="text" id="new_page" className="form-control" value={this.state.newPageValue} onChange={this.handleChange} autoComplet="off" placeholder="Create new page..."/>
                                <input type="submit" value='Save' className="btn-success" onClick={this.createPage}/>
                            </div>
                       </div>
                    </div>
                </nav>

                <div id="page-wrapper">
                    <div className="row">
                        <input type="button" onClick={this.deletePage} value="Delete"/>
                        <a onClick={this.generateContainer}>
                            <i className="fa fa-upload"></i>
                        </a>
                        { this.props.routeParams.pageId ? <Page key={this.props.routeParams.pageId} page={this.props.routeParams.pageId} /> : <Page key={this.state.activePage.id} page={this.state.activePage.id} /> }
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Container;