var React = require('react');
var TermCreate = require('./TermCreate.jsx');
import { Router, Route, Link, hashHistory } from 'react-router';
var NotificationSystem = require('react-notification-system');


var GlossaryBox = React.createClass({
	getInitialState: function() {
	    return {
	    	glossary: '',
	        termsList: []
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

    _notificationSystem: null,

    render: function(){
        var terms = this.state.termsList;
        var that = this;
    	return(
    		
            <div id="view-terms">
    		    <NotificationSystem ref="notificationSystem" />
                <ul>
        			{terms.map(function(term){
        				return(
    						<li key={term.id}>
    							{term.name} : {term.description}
                                <a href="#" onClick={that.deleteTerm.bind(that, term.id)}>
                                    <i className="fa fa-trash-o"></i>
                                </a>
    						</li>
        				)
        			})}
                </ul>
				<div className="add_new_term">
    				<TermCreate glossary={this.state.glossary.id} addTerm={this.handleTermAdd}/>
    			</div>
    		</div>
            
    	);
    }
});

module.exports = GlossaryBox;
