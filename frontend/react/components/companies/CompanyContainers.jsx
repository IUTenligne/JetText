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
        event.preventDefault();
        var that = this;

        $.ajax({
            type: "GET",
            url: '/generator/save/'+that.props.item.id,
            success: function(data) {
                window.location = data.url
            }
        });

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
                <td onClick={this.handleModalState} className="capitalize">
                     <a href="javascript:;">{result.name}</a>
                </td>
                <td>
                    {this.props.user}
                </td>
                <td>
                    {result.created_at.split("T")[0].split("-").reverse().join("/")}
                </td>
                <td>
                    {result.updated_at.split("T")[0].split("-").reverse().join("/")}
                </td>
                <td>
                    <a href="javascript:;" onClick={this.generateContainer}>Télécharger</a>
                </td>
                <td>
                    <a href="javascript:;" onClick={this.handleModalState}>Visualiser</a>
                </td>
                <td>
                    <a href={"/generator/overview/"+result.id} target="_blank">Pleine page</a>
                </td>
                <td>
                    { this.state.overview 
                        ? <Modal active={this.handleModalState} mystyle={"view"} title={"Aperçu"}> 
                            <iframe src={"/generator/overview/"+this.props.item.id} width="100%" height="100%" scrolling="auto" frameborder="0"></iframe>
                        </Modal> 
                        : null
                    }
                    <NotificationSystem ref="notificationSystem"/>
                </td>
            </tr> 
        );
    }
});


var Containers = React.createClass({
    getInitialState: function() {
        return {
            company: '',
            containersList: [],
            usersList: [],
            sorter: '',
            icon: '',
            loading: true
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/companies/1.json", function(result) {
            this.setState({
                company: result.company,
                containersList: result.containers,
                usersList: result.users,
                loading: false
            });
        }.bind(this));
        this._notificationSystem = this.refs.notificationSystem;
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    handleModalState: function(st) {
        this.setState({ viewCreate: false });
    },

    sort: function(elem) {
        if ((this.state.icon === "down") || (this.state.icon === ""))
            this.setState({ icon: "up" });
        else
            this.setState({ icon: "down" });

        this.setState({
            containersList: this.state.containersList.sort().reverse(),
            sorter: elem
        });
    },

    _notificationSystem: null,

    render: function() {
        var that = this;

        return (
            <article id="company">
                <h1 className="page-header" key={this.state.company.id}>Les ressources {this.state.company.name} <i class="fa fa-folder-open fa-fw "></i></h1>

                <ul className="align">
                    { this.state.loading
                        ? <Loader />
                        : null
                    }

                    <table>
                        <thead>
                            <tr>
                                <th onClick={this.sort.bind(this, "container")}>
                                    Ressource {this.state.sorter === "container" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, "author")}>
                                    Auteur {this.state.sorter === "author" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, "creation")}>
                                    Création {this.state.sorter === "creation" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, "update")}>
                                    Mise à jour {this.state.sorter === "update" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th>
                                    Téléchargement
                                </th>
                                <th colspan="2">
                                    Visualisation
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.state.containersList.map(function(result, index){
                                return (
                                    <Result 
                                        item={result}
                                        user={that.state.usersList[index]} 
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