var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Loader = require('../widgets/Loader.jsx');
var Modal = require('../widgets/Modal.jsx');
var NotificationSystem = require('react-notification-system');


var Result = React.createClass({
    getInitialState: function() {
        return {
            option: false,
            overview: false
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
            title: 'Confirmer la suppression',
            message: 'Voulez-vous supprimer la ressource ' + this.props.item.name + ' ?',
            level: 'success',
            position: 'tr',
            timeout: '20000',
            action: {
                label: 'yes',
                callback: function() {
                    $.ajax({
                        type: "DELETE",
                        url: "/containers/" + that.props.item.id,
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

    generateContainer: function(event) {
        /* allow a container to be generated and downloaded */
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
            title: 'Ressource générée !',
            level: 'success'
        });   
    },

    optionContainer: function (){
        this.setState({
            option: true
        });
    },

    handleModalState: function(st) {
        this.setState({ overview: st });
    },

    _notificationSystem: null, 

    render: function() {
        var result = this.props.item;

        return(
            <tr className="container">
                <td>
                    {result.name}
                </td>

                { this.state.overview 
                    ? <Modal active={this.handleModalState} mystyle={""} title={"Aperçu"}> 
                        <iframe src={"/generator/overview/"+this.props.item.id} width="100%" height="100%" scrolling="auto" frameborder="0"></iframe>
                    </Modal> 
                    : null 
                }

                <td>
                    <NotificationSystem ref="notificationSystem"/>
                </td>
            </tr> 
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
        this.serverRequest = $.get("/companies/1.json", function(result) {
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

    handleModalState: function(st) {
        this.setState({viewCreate: false });
    },

    _notificationSystem: null,

    render: function() {
        var results = this.state.containersList;
        var that = this;
        return (
            <article id="containers">
                <h1 className="page-header">Les ressources <i class="fa fa-folder-open fa-fw "></i></h1>

                <ul className="align">
                    { this.state.loading
                        ? <Loader />
                        : null
                    }

                    <table>
                        <thead>
                            <tr>
                                <th>Ressource</th>
                                <th>Auteur</th>
                            </tr>
                        </thead>
                        <tbody>
                            { results.map(function(result){
                                return (
                                    <Result 
                                        item={result} 
                                        key={result.id} 
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </ul>
            </article>
        );
    }
});

module.exports = Containers;