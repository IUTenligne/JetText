var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var NotificationSystem = require('react-notification-system');
var Modal = require('../widgets/Modal.jsx');


var Glossaries = React.createClass({

	getInitialState: function() {
	    return {
	        newGlossaryValue: '',
	        glossariesList: [] ,
            viewCreate: false,
	    };
	},

    handleChange: function(event) {
        this.setState({newGlossaryValue: event.target.value});
    },

	componentDidMount: function() {
	    this.serverRequest = $.get("/glossaries.json", function(result){
	      	this.setState({
	      		glossariesList: result.glossaries
	      	});
	    }.bind(this));
	    this._notificationSystem = this.refs.notificationSystem;
	},

	componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    createGlossary: function(event) {
         event.preventDefault();
    	$.ajax({
    		type: "POST",
    		url:'/glossaries',
    		context: this,
    		data: { 
                glossary: {
                    name: this.state.newGlossaryValue
                } 
            },
    		success: function(data){
    			this.setState({
                    newGlossaryValue: '',
                    glossariesList: this.state.glossariesList.concat([data]),
                    viewCreate: false 
                }); 
    		}
    	})
         event.target.value = '';
    },

    _handleKeyPress: function(event) {
        if (event.key === 'Enter') {
            this.createGlossary(event);
        }
    },

    deleteGlossary: function(glossary, event){
        var that = this;
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Confirmer la suppression',
            message: 'Voulez-vous supprimer le glossaire ' + glossary.name + ' ?',
            level: 'success',
            position: 'tr',
            timeout: '20000',
            action: {
                label: 'yes',
                callback: function() {
                    $.ajax({
                        type: "DELETE",
                        url: "/glossaries/"+ glossary.id,
                        context: that,
                        success: function() {
                            that.setState({
                                glossariesList: that.state.glossariesList.filter((i, _) => i["id"] !== glossary.id)
                            })
                        }
                    });
                }
            }
        });
    },

    viewCreateGlossaries: function(){
        this.setState({viewCreate: true });
    },
    handleModalState: function(st) {
        this.setState({viewCreate: false });
    },

    _notificationSystem: null,

    render: function(){
        var that = this;
    	return(
    		<article id="glossary">
                <NotificationSystem ref="notificationSystem" />

                <h1 className="page-header">Mes glossaires</h1>

                <ul className="cotent-glossary">
        			{this.state.glossariesList.map(function(glossary){
        				return(
                            <li key={glossary.id} className="option">
                                <Link to={"/glossaries/"+glossary.id}>
                                    {glossary.name}
                                </Link>
                                <br/>
                                <a href="#" onClick={that.deleteGlossary.bind(that, glossary)} >
                                    <span className="fa-stack fa-lg">
                                        <i className="fa fa-trash-o fa-stack-1x "></i> 
                                        <i className="fa fa-ban fa-stack-2x"></i>
                                    </span>
                                    Supprimer
                                </a>

                                <a className="btn list-group-item" href={"/#/containers/"+glossary.id}>
                                    <span className="fa-stack fa-lg">
                                        <i className="fa fa-square fa-stack-2x"></i>
                                        <i className="fa fa-pencil fa-stack-1x fa-inverse"></i> 
                                    </span>
                                    Editer
                                </a>                      
                            </li>
        				);
        			})}
                    <li id="addGlossary" onClick={this.viewCreateGlossaries}>
                        <i className="fa fa-plus fa-fw "></i>
                    </li>
                </ul>
                { this.state.viewCreate
                    ? <Modal active={this.handleModalState} mystyle={""} title={"Créer une nouvelle ressource"}>
                        <div className="add_new_glossary">
                            <div className="input-group input-group-lg">
                                <span className="input-group-addon">
                                    <i className="fa fa-plus fa-fw"></i>
                                </span>
                                <input type="text" id="new_glossary" className="form-control" value={this.state.newGlossaryValue} onChange={this.handleChange} onKeyPress={this._handleKeyPress} autoComplet="off" placeholder="Créer un nouveau glossaire..." />
                            </div>
                        </div>
                    </Modal>
                    : null
                }
    			
    		</article>
    	);
    }
});

module.exports = Glossaries;