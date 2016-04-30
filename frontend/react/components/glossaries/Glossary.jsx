var React = require('react');
var TermCreate = require('./TermCreate.jsx');
import { Router, Route, Link, hashHistory } from 'react-router';
var NotificationSystem = require('react-notification-system');

var Glossary = React.createClass({
	getInitialState: function() {
	    return {
	    	glossary: '',
	        termsList: []
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
    		<div className="terms">
    		<NotificationSystem ref="notificationSystem" />
				<div className="row">
					<div className="col-lg-12">
						<h1 className="page-header">My Terms in glossary {that.state.glossary.name}</h1>
					</div>
				</div>
    			{terms.map(function(term){
    				return(
						<li key={term.id}>
							<Link to={"/terms/"+term.id}>
								{term.name}
							</Link>
							<br/>
							<a href="#" onClick={that.deleteTerm.bind(that, term.id)}>
								<i className="fa fa-trash-o"></i>
							</a>
						</li>
    				)
    			})}
				<div className="add_new_term">
    				<TermCreate glossary={this.state.glossary.id} addTerm={that.handleTermAdd}/>
    			</div>
    		</div>
    	);
    }
});

module.exports = Glossary;
