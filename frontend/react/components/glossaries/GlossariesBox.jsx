var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, Link, hashHistory } from 'react-router';
var NotificationSystem = require('react-notification-system');
var GlossaryBox = require('./GlossaryBox.jsx');
var Modal = require('../widgets/Modal.jsx');

var GlossaryItem = React.createClass({
    getInitialState: function() {
        return {
            isChecked: false,
            active: false
        };
    },

    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
        var containers_glossaries = this.props.containersGlossaries;
        for (var i in containers_glossaries) {
            if (this.props.glossary.id == containers_glossaries[i].glossary_id)
                this.setState({isChecked: true});
        }
    },

    deleteGlossary: function(glossary_id, event){
        var that = this;
        event.preventDefault();
        this._notificationSystem = this.refs.notificationSystem;
        
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
                        url: "/glossaries/"+ glossary_id,
                        context: that,
                        success: function(data) {
                            that.props.removeGlossary(data.glossary)
                        }
                    });
                }
            }
        });
    },

    onChange: function() {
        this.setState({isChecked: !this.state.isChecked});
        if (this.state.isChecked = true){
            $.ajax({
                type: "POST",
                url: "/containers_glossaries",
                data: {
                    container_id: this.props.containerId, glossary_id: this.props.glossary.id
                }
            });
        };
    },

    showTerms: function (){
        this.setState({
            active: !this.state.active
        })
    },

    render: function(){
        var glossary = this.props.glossary;
        
        return(
            <li>
                <NotificationSystem ref="notificationSystem"/>
 
                    <input 
                        type="checkbox" 
                        checked={this.state.isChecked} 
                        onChange={this.onChange}/>
                       
                    <h3 id="appElement" onClick={this.showTerms}>
                         {glossary.name}
                    </h3>
                    <a href="#" onClick={this.deleteGlossary.bind(this, glossary.id)} >
                        <i className="fa fa-trash-o" ></i>
                    </a>
        

                { this.state.active ? <GlossaryBox glossary={glossary.id} /> : null }
            </li>
        );
    }
});

var GlossariesBox = React.createClass({
	getInitialState: function() {
	    return {
	        newGlossaryValue: '',
	        glossariesList: [],
            containersGlossaries: [],
            active: true
	    };
	},

    handleChange: function(event) {
        this.setState({newGlossaryValue: event.target.value});
    },

	componentDidMount: function() {
	    this.serverRequest = $.get("/glossaries/box/"+this.props.containerId+".json", function(result){
	      	this.setState({
	      		glossariesList: result.glossaries,
                containersGlossaries: result.containers_glossaries
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
         event.target.value='';
    },

    _handleKeyPress: function(event) {
        if (event.key === 'Enter') {
            this.createGlossary(event);
        }
    },

    handleGlossaryDeletion: function(glossaryId) {
        this.setState({
            glossariesList: this.state.glossariesList.filter((i, _) => i["id"] !== glossaryId)
        });
    },

    _notificationSystem: null,

    changeEtat: function(etat) {
        this.setState({ active: false });
        this.props.handleModalState(false);
    },

    render: function(){
        var that = this;
        var containerId= this.props.containerId;
    	return(
            <Modal active={this.changeEtat}>
        		<div className="glossary">
                    <NotificationSystem ref="notificationSystem" />
                    <div className="row">
                        <div className="col-lg-12">
                            <h1 className="page-header">My Glossaries</h1>
                        </div>
                    </div>
                    <ul>
            			{this.state.glossariesList.map(function(glossary){
                            return(<GlossaryItem glossary={glossary} containerId={containerId} containersGlossaries={that.state.containersGlossaries} removeGlossary={that.handleGlossaryDeletion} key={glossary.id}/>);
            			})}
                    </ul>
        			<div className="add_new_glossary">
        				<div className="input-group input-group-lg">
        					<span className="input-group-addon">
                                <i className="fa fa-plus fa-fw"></i>
                            </span>
                            <input type="text" id="new_glossary" className="form-control" value={this.state.newGlossaryValue} onChange={this.handleChange} onKeyPress={this._handleKeyPress} autoComplet="off" placeholder="Create new glossary..." />
        				</div>
        			</div>
        		</div>
            </Modal>
    	);
    }
});



module.exports = GlossariesBox;