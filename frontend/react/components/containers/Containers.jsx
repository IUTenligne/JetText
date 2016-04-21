var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
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

    _notificationSystem: null, 

    render: function() {
        var result = this.props.item;
        return(
            <div className="col-lg-6 tags" >  
                <li className="tag">
                    <div className="contenu">
                        <div className="elem">
                            <div className="name">
                                <Link to={"/containers/"+result.id}>
                                  {result.name}
                                 </Link>
                            </div>

                            <div className="option">
                                <Link to={"/containers/"+result.id}>
                                     <i className="fa fa-pencil"></i>
                                </Link>
                                <a href="#" onClick={this.generateContainer}>
                                    <i className="fa fa-upload"></i>
                                </a>
                                <a href="#" onClick={this.deleteContainer}>
                                    <i className="fa fa-trash-o"></i>
                                </a>
                            </div>
                        </div>
                    </div> 
                </li>
                <NotificationSystem ref="notificationSystem" style={style}/>
            </div>
        )
    }
});


var Containers = React.createClass({
    getInitialState: function() {
        return {
            containersList: []
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/containers.json", function(result) {
            this.setState({
                containersList: result
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
            <div className="containers">
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="page-header">My containers</h1>
                    </div>
                </div>
                <Link to={"/glossaries/"}>
                     blabla
                </Link>
                <div className="row">
                    {results.map(function(result){
                        return (
                            <Result item={result} key={result.id} removeContainer={that.handleContainerDeletion} />
                        );
                    })}
                </div>
            </div>
        );
    }
});

module.exports = Containers;