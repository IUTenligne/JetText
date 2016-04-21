var React = require('react');
var Term= require('./Glossaries.jsx');
var NotificationSystem = require('react-notification-system');

var Glossary = React.createClass({
	getInitialState: function() {
	    return {
	        termsList: []
	    };
	},

	componentDidMount: function() {
	    this.serverRequest = $.get("/glossary.json", function(result){
	      	this.setState({
	      		termsList: result.terms
	      	});
	    }.bind(this));
	    this._notificationSystem = this.refs.notificationSystem;
	},

	componentWillUnmount: function() {
        this.serverRequest.abort();
    },


    deleteTerm: function(){

    },

    _notificationSystem: null,

    render: function(){
        var terms = this.state.termsList;
    	return(
    		<div className="terms">
					<div className="row">
							<div className="col-lg-12">
									<h1 className="page-header">My Terms</h1>
							</div>
					</div>
    			{terms.map(function(term){
    				return(
						<li key={term.id}>
								<Link to={"/glossaries/"+glossary.id +"/"+term.id}>
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
    					<TermCreate term={term}/>
    			</div>
    		</div>
    	);
    }
});

module.exports = Glossary;
