var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var NotificationSystem = require('react-notification-system');


var Glossaries = React.createClass({

	getInitialState: function() {
	    return {
	        newGlossaryValue: '',
	        glossariesList: [] 
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
                    glossariesList: this.state.glossariesList.concat([data])
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

    _notificationSystem: null,

    render: function(){
        var that = this;
    	return(
    		<div className="glossary">
                <NotificationSystem ref="notificationSystem" />

                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="page-header">Mes glossaires</h1>
                    </div>
                </div>

    			{this.state.glossariesList.map(function(glossary){
    				return(
                        <li key={glossary.id} >
                            <Link to={"/glossaries/"+glossary.id}>
                                {glossary.name}
                            </Link>
                            <br/>
                            <a href="#" onClick={that.deleteGlossary.bind(that, glossary)} >
                                <i className="fa fa-trash-o" ></i>
                            </a>
                        </li>
    				);
    			})}

    			<div className="add_new_glossary">
    				<div className="input-group input-group-lg">
    					<span className="input-group-addon">
                            <i className="fa fa-plus fa-fw"></i>
                        </span>
                        <input type="text" id="new_glossary" className="form-control" value={this.state.newGlossaryValue} onChange={this.handleChange} onKeyPress={this._handleKeyPress} autoComplet="off" placeholder="Créer un nouveau glossaire..." />
    				</div>
    			</div>
    		</div>
    	);
    }
});

module.exports = Glossaries;