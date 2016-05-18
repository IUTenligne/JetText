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
            url: '/generator/save/'+that.props.item.id,
            success: function(data) {
                window.location = data.url
            }
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
                <figure className='book'>
                    <ul className='hardcover_front'>
                        <li>
                            <div className="coverDesign capitalize">
                                <span className="ribbon">{JSON.parse(currentUser).firstname}</span>
                                <p>{result.name}</p>
                            </div>
                        </li>
                        <li></li>
                    </ul>

                    <ul className='sheet'>
                        <li></li>
                        <li className="option">
                            <a className="btn" href={"/#/containers/"+result.id}>
                                <span className="fa-stack fa-lg">
                                    <i className="fa fa-square fa-stack-2x"></i>
                                    <i className="fa fa-pencil fa-stack-1x fa-inverse"></i> 
                                </span>
                                Edit
                            </a>

                            <a className="btn list-group-item" onClick={this.generateContainer}>
                                <span className="fa-stack fa-lg">
                                    <i className="fa fa-square fa-stack-2x"></i>
                                    <i className="fa fa-download fa-stack-1x fa-inverse"></i> 
                                </span>
                                Download
                            </a>

                            <a className="btn" onClick={this.deleteContainer}>
                                <span className="fa-stack fa-lg">
                                    <i className="fa fa-trash-o fa-stack-1x "></i> 
                                    <i className="fa fa-ban fa-stack-2x"></i>
                                </span>
                                Delete
                            </a>
                        </li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>

                    <ul className='hardcover_back'>
                        <li></li>
                        <li></li>
                    </ul>
                </figure>

                <NotificationSystem ref="notificationSystem" style={style}/>
            </li> 
        );
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

                <ul className="align">
                    { this.state.loading
                        ? <Loader />
                        : null
                    }

                    { results.map(function(result){
                        return (
                            <Result 
                                item={result} 
                                key={result.id} 
                                removeContainer={that.handleContainerDeletion} 
                            />
                        );
                    })}
                </ul>
            </article>
        );
    }
});

module.exports = Containers;