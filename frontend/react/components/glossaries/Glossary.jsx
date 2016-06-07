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
            viewCreate: false
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

    deleteTerm: function(term_id, event){
        var that = this;
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Confirm delete',
            message: 'Are you sure you want to delete the glossary?',
            level: 'success',
            position: 'tr',
            timeout: '20000',
            action: {
                label: 'yes',
                callback: function() {
                    $.ajax({
                        type: "DELETE",
                        url: "/terms/"+ term_id,
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
    viewCreateTerm: function(){
        this.setState({viewCreate: true });
    },
    handleModalState: function(st) {
        this.setState({viewCreate: false });
    },

    _notificationSystem: null,

    render: function(){
        var terms = this.state.termsList;
        var that = this;
        return(
            <div id="terms">
            <NotificationSystem ref="notificationSystem" />
                <h1 className="page-header">Termes du glossaire {that.state.glossary.name}</h1>
                <div onClick={this.viewCreateTerm} id="btn-add-term">
                    <i className="fa fa-plus fa-fw" title="Ajouter un term" aria-hidden="true"></i>
                    <span className="sr-only">Ajouter un term</span>
                </div>

                <ul id="list-term">
                    {terms.map(function(term){
                        return(
                            <li key={term.id}>
                                <Link to={"/terms/"+term.id} className="name-term capitalize">
                                    {term.name} :
                                </Link>
                                <a href="#" onClick={that.deleteTerm.bind(that, term.id)} className="trash">
                                    <i className="fa fa-trash-o"></i>
                                </a>
                                <br/>
                                <p className="description-term capitalize">{term.description}</p>
                            </li>
                        )
                    })}
                </ul>
                
                { this.state.viewCreate
                    ? <Modal active={this.handleModalState} mystyle={""} title={"Créer une nouvelle ressource"}>
                        <div className="add_new_term">
                            <TermCreate glossary={this.state.glossary.id} addTerm={that.handleTermAdd}/>
                        </div>
                    </Modal>
                    : null
                }
            </div>
        );
    }
});

module.exports = Glossary;
