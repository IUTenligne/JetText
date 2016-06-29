var React = require('react');
var TermCreate = require('./TermCreate.jsx');
import { Router, Route, Link, hashHistory } from 'react-router';
var NotificationSystem = require('react-notification-system');


var GlossaryBox = React.createClass({
	getInitialState: function() {
	    return {
	    	glossary: '',
	        termsList: [],
            editTerm: false,
            termName: '',
            termDescription: ''
	    };
	},

	componentDidMount: function() {
	    this.serverRequest = $.get("/glossaries/"+this.props.glossary+".json", function(result){
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
            position: 'tc',
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

    _notificationSystem: null,

    render: function(){
        var terms = this.state.termsList;
        var that = this;

    	return(
            <div id="view-terms">
                <NotificationSystem ref="notificationSystem" />
                <div id="border">
                    <ul id="list-terms">
            			{ terms.map(function(term){
            				return(
        						<li key={term.id}>
        							{ that.state.editTerm
                                        ? <div>
                                            <p>
                                                <input type="text" onChange={that.changeName} value={that.state.termName} />
                                            </p>
                                            <p>
                                                <input type="text" onChange={that.changeDescription} value={that.state.termDescription} />
                                            </p>
                                            <p>
                                                <button onClick={that.saveTerm.bind(that, term.id)}>Ok <i className="fa fa-check"></i></button>
                                            </p>
                                        </div>
                                        : <div>
                                            <p className="title">{term.name} :
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
    				<div className="add_new_term">
        				<TermCreate glossary={this.state.glossary.id} addTerm={this.handleTermAdd}/>
        			</div>
                </div>
    		</div>

    	);
    }
});

module.exports = GlossaryBox;
