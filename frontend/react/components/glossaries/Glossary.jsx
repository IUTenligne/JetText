var React = require('react');
var TermCreate = require('./TermCreate.jsx');
import { Router, Route, Link, hashHistory } from 'react-router';
var NotificationSystem = require('react-notification-system');
var Modal = require('../widgets/Modal.jsx');


var Glossary = React.createClass({
    getInitialState: function() {
        return {
            glossary: '',
            termsList: [],
            viewCreate: false,
            editTerm: false,
            termName: '',
            termDescription: '',
            modal: false
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/glossaries/"+this.props.params.id+".json", function(result){
            this.setState({
                glossary: result.glossary,
                termsList: result.terms
            });
        }.bind(this));
        this._notificationSystem = this.refs.notificationSystem;
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    handleTermAdd: function(term){
        this.setState({
            termsList: this.state.termsList.concat([term]),
            viewCreate: false
        })
    },

    changeName: function(event) {
        this.setState({ termName: event.target.value });
    },

    changeDescription: function(event) {
        this.setState({ termDescription: event.target.value });
    },

    editTerm: function(name, description) {
        this.setState({ 
            editTerm: true,
            termName: name,
            termDescription: description
        });
    },

    saveTerm: function(term_id, event) {
        event.preventDefault();
        $.ajax({
            type: "PUT",
            url: "/terms/" + term_id,
            context: this,
            data: {
                name: this.state.termName,
                description: this.state.termDescription
            },
            success: function() {
                var that = this;
                var modifiedTerm = this.state.termsList.filter((i, _) => i["id"] === term_id);
                modifiedTerm.name = this.state.termName;
                modifiedTerm.description = this.state.termDescription;

                var newList = [];
                this.state.termsList.map(function(term) {
                    if (term.id === term_id) {
                        term.name = that.state.termName;
                        term.description = that.state.termDescription;
                    }
                    newList.push(term);
                });

                this.setState({
                    termsList: newList,
                    editTerm: false
                })
            }
        });
    },

    deleteTerm: function(term_id, term_name, event){
        var that = this;
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Confirmer la suppression',
            message: 'Voulez-vous supprimer le terme "' + term_name + '" ?',
            level: 'success',
            position: 'tr',
            timeout: '20000',
            action: {
                label: 'yes',
                callback: function() {
                    $.ajax({
                        type: "DELETE",
                        url: "/terms/" + term_id,
                        context: that,
                        success: function() {
                            that.setState({
                                termsList: that.state.termsList.filter((i, _) => i["id"] !== term_id)
                            })
                        }
                    });
                }
            }
        });
    },

    deleteGlossary: function() {
        var that = this;
        this._notificationSystem.addNotification({
            title: 'Confirmer la suppression',
            message: 'Voulez-vous supprimer le terme "' + that.state.glossary.name + '" ?',
            level: 'success',
            position: 'tr',
            timeout: '20000',
            action: {
                label: 'yes',
                callback: function() {
                    $.ajax({
                        type: "DELETE",
                        url: "/glossaries/" + that.state.glossary.id,
                        success: function() {
                            window.location = "/#/glossaries";
                        }
                    });
                }
            }
        });
    },

    closeModal: function(st) {
        this.setState({ 
            modal: st,
            editTerm: st 
        });
    },

    viewCreateTerm: function(){
        this.setState({ viewCreate: true });
    },
    
    handleModalState: function(st) {
        this.setState({ viewCreate: false });
    },

    _notificationSystem: null,

    render: function(){
        var terms = this.state.termsList;
        var that = this;

        return(
            <div id="terms">
                <h1 className="page-header">Termes du glossaire {that.state.glossary.name}</h1>

                <ul id="list-term">
                    {terms.map(function(term){
                        return(
                            <li key={term.id}>
                                { that.state.editTerm
                                    ? <Modal active={that.closeModal} mystyle={"create"} title={"Editer un terme"}>
                                        <div className="add_new">
                                            <p>
                                                <span className="input-group-addon">
                                                    <i className="fa fa-pencil fa-fw"></i>
                                                </span>
                                                <input type="text" onChange={that.changeName} value={that.state.termName} />
                                            </p>
                                            <p> 
                                                <span className="input-group-addon">
                                                    <i className="fa fa-pencil fa-fw"></i>
                                                </span>   
                                                <input type="text" onChange={that.changeDescription} value={that.state.termDescription} />
                                            </p>
                                            <p>
                                                <input type="submit" value='Créer' className="btn-success" onClick={that.saveTerm.bind(that, term.id)} />
                                            </p>
                                        </div>
                                    </Modal>
                                    : <div>
                                        <p className="title">
                                            {term.name} :
                                        </p>
                                        <p className="opt">
                                            <a href="javascript:;" onClick={that.editTerm.bind(that, term.name, term.description)}>
                                                <i className="fa fa-pencil"></i>
                                            </a>
                                            <a href="javascript:;" onClick={that.deleteTerm.bind(that, term.id, term.name)}>
                                                <i className="fa fa-trash-o"></i>
                                            </a>
                                        </p>
                                        <p className="desc">{term.description}</p>
                                    </div>
                                }
                            </li>
                        )
                    })}
                </ul>

                <div id="menu-option">
                    <div onClick={this.viewCreateTerm} className="btn-term add">
                        <i className="fa fa-plus fa-fw" title="Ajouter un term" aria-hidden="true"></i>
                        <span className="sr-only">Ajouter un term</span><br/>
                        Ajouter<br/> un term
                    </div> 

                    <div onClick={this.deleteGlossary} className="btn-term sup">
                        <i className="fa fa-trash fa-fw" title="Supprimer le glossaire" aria-hidden="true"></i>
                        <span className="sr-only">Supprimer le glossaire</span><br/>
                        Supprimer<br/> le glossaire
                    </div>
                </div>

                { this.state.viewCreate
                    ? <Modal active={this.handleModalState} mystyle={"createTerm"} title={"Créer une nouvelle ressource"}>
                        <div className="add_new">
                            <TermCreate glossary={this.state.glossary.id} addTerm={that.handleTermAdd}/>
                        </div>
                    </Modal>
                    : null
                }

                <NotificationSystem ref="notificationSystem" />
            </div>
        );
    }
});

module.exports = Glossary;
