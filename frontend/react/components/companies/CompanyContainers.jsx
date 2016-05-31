var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Loader = require('../widgets/Loader.jsx');
var Modal = require('../widgets/Modal.jsx');
var ContainerPanel = require('./ContainerPanel.jsx');
var NotificationSystem = require('react-notification-system');


var Result = React.createClass({
    getInitialState: function() {
        return {
            option: false,
            overview: false,
            infos: false
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

    handleInfosModalState: function(st) {
        this.setState({ infos: st });
    },

    _notificationSystem: null, 

    render: function() {
        var result = this.props.item;

        return(
            <tr className="container">
                <td onClick={this.handleModalState} className="capitalize">
                    <a href="javascript:;">{ result.visible ? result.name : <span className="striked">{result.name}</span> }</a>
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
                    <a href="javascript:;" onClick={this.handleInfosModalState}><i className="fa fa-user"></i></a>
                </td>
                <td>
                    <a href="javascript:;" onClick={this.generateContainer}>Télécharger</a>
                </td>
                <td>
                    <a href="javascript:;" onClick={this.handleModalState}><i className="fa fa-eye"></i></a>
                </td>
                <td>
                    <a href={"/generator/overview/"+result.id} target="_blank"><i className="fa fa-expand"></i></a>
                </td>
                <td>
                    { this.state.infos 
                        ? <Modal active={this.handleInfosModalState} mystyle={"view"} title={"Informations"}> 
                            <div className="modal-in">
                                <ContainerPanel container={this.props.item} author={this.props.user} />
                            </div>
                        </Modal> 
                        : null
                    }
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
            incContainersList: [],
            validatedContainersList: [],
            incUsersList: [],
            validatedUsersList: [],
            deletedContainersList: [],
            deletedUsersList: [],
            sorter: '',
            icon: '',
            loading: true
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/companies/1.json", function(result) {
            this.setState({
                company: result.company,
                incContainersList: result.inc_containers,
                incUsersList: result.inc_users,
                validatedContainersList: result.validated_containers,
                validatedUsersList: result.validated_users,
                deletedContainersList: result.deleted_containers,
                deletedUsersList: result.deleted_users,
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

    sort: function(list, elem) {
        if ((this.state.icon === "down") || (this.state.icon === ""))
            this.setState({ icon: "up" });
        else
            this.setState({ icon: "down" });

        this.setState({
            containersList: list.sort().reverse(),
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

                    <h2>Ressources validées :</h2>

                    <table>
                        <thead>
                            <tr>
                                <th onClick={this.sort.bind(this, this.state.validatedContainersList, "container")}>
                                    Ressource {this.state.sorter === "container" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.validatedContainersList, "author")}>
                                    Auteur {this.state.sorter === "author" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.validatedContainersList, "creation")}>
                                    Création {this.state.sorter === "creation" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.validatedContainersList, "update")}>
                                    Mise à jour {this.state.sorter === "update" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th>
                                    Informations
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
                            { this.state.validatedContainersList.map(function(result, index){
                                return (
                                    <Result 
                                        item={result}
                                        user={that.state.validatedUsersList[index]} 
                                        key={result.id} 
                                    />
                                );
                            })}
                        </tbody>
                    </table>

                    <h2>Ressources en cours de conception :</h2>

                    <table>
                        <thead>
                            <tr>
                                <th onClick={this.sort.bind(this, this.state.incContainersList, "inccontainer")}>
                                    Ressource {this.state.sorter === "inccontainer" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.incContainersList, "incauthor")}>
                                    Auteur {this.state.sorter === "incauthor" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.incContainersList, "inccreation")}>
                                    Création {this.state.sorter === "inccreation" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.incContainersList, "incupdate")}>
                                    Mise à jour {this.state.sorter === "incupdate" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th>
                                    Informations
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
                            { this.state.incContainersList.map(function(result, index){
                                return (
                                    <Result 
                                        item={result}
                                        user={that.state.incUsersList[index]} 
                                        key={result.id} 
                                    />
                                );
                            })}
                        </tbody>
                    </table>

                    <h2>Ressources supprimées :</h2>

                    <table>
                        <thead>
                            <tr>
                                <th onClick={this.sort.bind(this, this.state.deletedContainersList, "deletedcontainer")}>
                                    Ressource {this.state.sorter === "deletedcontainer" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.deletedContainersList, "deletedauthor")}>
                                    Auteur {this.state.sorter === "deletedauthor" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.deletedContainersList, "deletedcreation")}>
                                    Création {this.state.sorter === "deletedcreation" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.deletedContainersList, "deletedupdate")}>
                                    Mise à jour {this.state.sorter === "deletedupdate" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th>
                                    Informations
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
                            { this.state.deletedContainersList.map(function(result, index){
                                return (
                                    <Result 
                                        item={result}
                                        user={that.state.deletedUsersList[index]} 
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