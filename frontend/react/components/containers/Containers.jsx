var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Constants = require('../constants');
var Loader = require('../widgets/Loader.jsx');
var Modal = require('../widgets/Modal.jsx');
var NotificationSystem = require('react-notification-system');


var Result = React.createClass({
    getInitialState: function() {
        return {
            option: false,
            overview: false,
            coverBackground: {}
        };
    },
    
    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
        this.generateGradient();
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
                        type: "PUT",
                        url: "/containers/delete/" + that.props.item.id,
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

    validateContainer: function(event){
        var that = this;
        // NotificationSystem popup
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Confirmer la suppression',
            message: 'Voulez-vous envoyer la ressource ' + this.props.item.name + ' pour évaluation ?',
            level: 'success',
            position: 'tr',
            timeout: '20000',
            action: {
                label: 'yes',
                callback: function() {
                    $.ajax({
                        type: "PUT",
                        url: "/containers/validate/" + that.props.item.id,
                        context: that,
                        success: function(data) {
                            that.props.validateContainer(data.containers)
                        }
                    });
                }
            }
        });
    },

    updateContainer: function(event){
        var that = this;
        $.ajax({
            type: "POST",
            url: "/containers/send_update/" + that.props.item.id
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

    generateGradient: function() {
        var i = Math.floor(Math.random() * (3 - 1 + 1) + 1);
        var bg = {
            background: Constants.gradient+i[0],
            background: "-webkit-linear-gradient(to left, "+Constants.gradient+i[0]+" , "+Constants.gradient+i[1]+")",
            background: "linear-gradient(to left, "+Constants.gradient+i[0]+" , "+Constants.gradient+i[1]+")"
        };

        this.setState({ coverBackground: bg });
    },

    _notificationSystem: null, 

    render: function() {
        var result = this.props.item;

        return(
            <li className="container">
                <figure className='book'>
                    <ul className='hardcover_front'>
                        <li>
                            <div className="coverDesign capitalize" style={this.state.coverBackground} >
                                <span className="ribbon">{JSON.parse(currentUser).firstname}</span>
                                <p>{result.name}</p>
                            </div>
                        </li>
                        <li></li>
                    </ul>

                    <ul className='sheet'>
                        <li></li>
                        <li className="option">
                            <a className="btn list-group-item" href={"/#/containers/"+result.id}>
                                <span className="fa-stack fa-lg">
                                    <i className="fa fa-square fa-stack-2x"></i>
                                    <i className="fa fa-pencil fa-stack-1x fa-inverse"></i> 
                                </span>
                                Editer
                            </a>

                            <a className="btn list-group-item" onClick={this.handleModalState}>
                                <span className="fa-stack fa-lg">
                                    <i className="fa fa-square fa-stack-2x"></i>
                                    <i className="fa fa-eye fa-stack-1x fa-inverse"></i> 
                                </span>
                                Aperçu
                            </a>

                            { result.status
                                ? <a className="btn list-group-item" onClick={this.updateContainer}>
                                        <span className="fa-stack fa-lg">
                                            <i className="fa fa-square fa-stack-2x"></i>
                                            <i className="fa fa-check fa-stack-1x fa-inverse"></i> 
                                        </span>
                                        Actualiser
                                    </a>
                                : <a className="btn list-group-item" onClick={this.validateContainer}>
                                        <span className="fa-stack fa-lg">
                                            <i className="fa fa-square fa-stack-2x"></i>
                                            <i className="fa fa-check fa-stack-1x fa-inverse"></i> 
                                        </span>
                                        Valider
                                    </a>
                            }

                            <a className="btn list-group-item" onClick={this.generateContainer}>
                                <span className="fa-stack fa-lg">
                                    <i className="fa fa-square fa-stack-2x"></i>
                                    <i className="fa fa-download fa-stack-1x fa-inverse"></i> 
                                </span>
                                Telecharger
                            </a>

                            { result.status
                                ? null
                                : <a className="btn list-group-item" onClick={this.deleteContainer}>
                                        <span className="fa-stack fa-lg">
                                            <i className="fa fa-trash-o fa-stack-1x "></i> 
                                            <i className="fa fa-ban fa-stack-2x"></i>
                                        </span>
                                        Supprimer
                                    </a>
                            }
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

                { this.state.overview 
                    ? <Modal active={this.handleModalState} mystyle={"view"} title={"Aperçu"}> 
                        <iframe src={"/generator/overview/"+this.props.item.id} width="100%" height="100%" scrolling="auto" frameborder="0"></iframe>
                    </Modal> 
                    : null 
                }

                <NotificationSystem ref="notificationSystem" />
            </li> 
        );
    }
});


var Containers = React.createClass({
    getInitialState: function() {
        return {
            containersList: [],
            loading: true,
            viewCreate: false,
            newContainerValue: '',
            inputCreate: false
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

    handleContainerValidation: function(containersList) {
        this.setState({
            containersList: containersList
        });
    },

    viewCreateContainers: function(){
        this.setState({viewCreate: true });
    },

    createContainer: function(){
        $.ajax({
            type: "POST",
            url: "/containers",
            context: this,
            data: {
                container: {
                    name: this.state.newContainerValue,
                    content: "",
                    url: JSON.parse(currentUser).email
                }
            },
            success: function(data){
                this.setState({
                    viewCreate: false,
                    containersList: this.state.containersList.concat([data]),
                });
                window.location = "/#/containers/" + data.id;
            }
        });
    },

    handleModalState: function(st) {
        this.setState({viewCreate: false });
    },

    handleChange: function(myparam, event) {
        if (myparam == "newContainerValue") {
            this.setState({
                newContainerValue: event.target.value,
                inputCreate: true
            })
        }    
    },

    _handleKeyPress: function(event) {
        if (event.key === 'Enter') {
            this.createContainer(event);
        }
    },

    _notificationSystem: null,

    render: function() {
        var results = this.state.containersList;
        var that = this;
        return (
            <article id="containers">
                <h1 className="page-header">Mes ressources <i class="fa fa-folder-open fa-fw "></i></h1>

                <ul className="align">
                    { this.state.loading
                        ? <Loader />
                        : null
                    }

                    { results.map(function(result){
                        return (
                            <Result 
                                item={result} 
                                key={result.id} 
                                removeContainer={that.handleContainerDeletion} 
                                validateContainer={that.handleContainerValidation}
                            />
                        );
                    })}
                    <li id="addContainer" onClick={this.viewCreateContainers}>
                        <i className="fa fa-plus fa-fw "></i>
                    </li>
                </ul>

                { this.state.viewCreate
                    ? <Modal active={this.handleModalState} mystyle={""} title={"Créer une nouvelle ressource"}>
                        <div id="add_new_container">
                            <span className="input-group-addon">
                                <i className="fa fa-plus fa-fw"></i>
                            </span>
                            <input 
                                type="text"
                                ref="new_container" 
                                id="new_container" 
                                className="form-control" 
                                autoComplet="off" 
                                onKeyPress={this._handleKeyPress} 
                                onChange={this.handleChange.bind(this, "newContainerValue")} 
                                value={this.state.newContainerValue}  
                                placeholder="Titre de la ressource..." 
                            />
                            <br/>
                            { this.state.inputCreate 
                                ?<input type="submit" value='Créer' className="btn-success" onClick={this.createContainer}/>
                                : null
                            }
                        </div>
                    </Modal>
                    : null
                }
            </article>
        );
    }
});

module.exports = Containers;