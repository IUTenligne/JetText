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
        var that = this.props;
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
                        url: "/containers/"+that.item.id,
                        context: that,
                        success: function(data){
                           window.location.replace("/#");
                        }
                    });
                }
            }
        });
    },

    generateContainer: function(event){
       var that = this.props;
       console.log(that.item.id);
       $.ajax({
            type: "GET",
            url: '/generate_container/'+that.item.id,
        });
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Container generate !',
            level: 'success'
        });   
    },

    _notificationSystem: null, 

    render: function() {
        var result = this.props.item;
        return(

            <div className="col-lg-4 tags" >  
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
                                <a onClick={this.generateContainer}>
                                    <i className="fa fa-upload"></i>
                                </a>
                                <a onClick={this.deleteContainer}>
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
        this.serverRequest = $.get("/containers.json", function (result) {
            this.setState({
                containersList: result
            });
        }.bind(this));
        this._notificationSystem = this.refs.notificationSystem;
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },


    _notificationSystem: null,

    render: function() {

        var results = this.state.containersList;
        return (
            <div className="containers">

                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="page-header">My containers</h1>

                    </div>
                </div>

                <div className="row">
                    {results.map(function(result){
                        return (
                            <Result item={result} key={result.id}/>
                        );
                    })}
                </div>
            </div>
        );
    }
});

module.exports = Containers;