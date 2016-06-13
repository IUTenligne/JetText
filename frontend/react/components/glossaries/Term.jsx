var React = require('react');
var Term = require('./Glossary.jsx');
var NotificationSystem = require('react-notification-system');

var Term = React.createClass({
    getInitialState: function() {
        return {
            TermValue: ''
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/terms/"+this.props.params.id+".json", function(result){
            this.setState({
                TermValue: result.term 
            });
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },


    render: function(){
        var term = this.state.TermValue;
        return(
            <div className="term">
                <h2>{term.name}</h2>
                <p>{term.description}</p>
                <a href={"/#/glossaries/"+ term.glossary_id} className="btn-success">retour</a>
            </div>
        );
    }
});

module.exports = Term;