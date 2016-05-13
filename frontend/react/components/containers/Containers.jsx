var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Loader = require('../widgets/Loader.jsx');
var NotificationSystem = require('react-notification-system');

var style = {
    NotificationItem: { 
        DefaultStyle: { 
            margin: '50px 5px 2px 1px',
            background: " #eeeeee",
        },
    }
}

var Result = React.createClass({
    getInitialState: function() {
        return {
            option: false
        };
    },
    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },

    deleteContainer: function(event){
        var that = this;
        // NotificationSystem popup
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Confirm delete',
            message: 'Are you sure you want to delete the container?',
            level: 'success',
            position: 'tr',
            timeout: '20000',
            action: {
                label: 'yes',
                callback: function() {
                    $.ajax({
                        type: "DELETE",
                        url: "/containers/"+that.props.item.id,
                        context: that,
                        success: function(data) {
                            /* passes the container.id to the parent using removeContainer's props */
                            that.props.removeContainer(data.container)
                        }
                    });
                }
            }
        });
    },

    generateContainer: function(event){
        var that = this;
        $.ajax({
            type: "GET",
            url: '/generate_container/'+that.props.item.id,
        });
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Container successfully generated !',
            level: 'success'
        });   
    },

    optionContainer: function (){
        this.setState({
            option: true
        });
    },

    _notificationSystem: null, 

    render: function() {
        var result = this.props.item;
        return(
            <li className="container">
                <div className="header">
                    <i className="fa fa-ellipsis-v fa-fw " aria-hidden="true" onClick={this.optionContainer}></i>
                    {this.state.option
                        ?<div className="option">
                            <a href={"/containers/"+result.id}>
                                <i className="fa fa-pencil fa-fw " aria-hidden="true"></i>
                            </a>
                            <a  onClick={this.generateContainer}>
                                <i className="fa fa-upload fa-fw " aria-hidden="true"></i>
                            </a>
                            <a  onClick={this.deleteContainer}>
                                <i className="fa fa-trash-o fa-fw " aria-hidden="true"></i>
                            </a>
                        </div>
                        : null
                    }
                    
                </div>

                <Link className="contenu" to={"/containers/"+result.id}>
                    <p className="title">{result.name}</p>
                    <p className="content">{result.content}</p>
                </Link>

                <NotificationSystem ref="notificationSystem" style={style}/>
            </li>  
        )
    }
});


var Containers = React.createClass({
    getInitialState: function() {
        return {
            containersList: [],
            loading: true
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/containers.json", function(result) {
            this.setState({
                containersList: result.containers,
                loading: false
            });
        }.bind(this));
        this._notificationSystem = this.refs.notificationSystem;
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    handleContainerDeletion: function(containerId) {
        /* updates the containers list with the containerId returned by the prop this.props.deleteContainer of the child <Result /> */
        this.setState({
            containersList: this.state.containersList.filter((i, _) => i["id"] !== containerId)
        });
    },

    _notificationSystem: null,

    render: function() {
        var results = this.state.containersList;
        var that = this;
        return (
            <article id="containers">
                <h1 className="page-header">My containers <i class="fa fa-folder-open fa-fw "></i></h1>

                <ul>
                    { this.state.loading
                        ? <Loader />
                        : null
                    }
                    {results.map(function(result){
                        return (
                            <Result item={result} key={result.id} removeContainer={that.handleContainerDeletion} />
                        );
                    })}
                </ul>
            </article>
        );
    }
});

module.exports = Containers;