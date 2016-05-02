var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var NotificationSystem = require('react-notification-system');


var GlossaryItem = React.createClass({
    getInitialState: function() {
        return {
            isChecked: false
        };
    },

    deleteGlossary: function(glossary_id, event){
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
                        url: "/glossaries/"+ glossary_id,
                        context: that,
                        success: function() {
                            that.setState({
                                glossariesList: that.state.glossariesList.filter((i, _) => i["id"] !== glossary_id)
                            })
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

    render: function(){
        var glossary = this.props.glossary;
        return(
            <li  >
                <label for={glossary.id}> 
                    <input 
                        type="checkbox" 
                        checked={this.state.isChecked} 
                        onChange={this.onChange}
                    />
                    <Link to={"/glossaries/"+glossary.id}>
                        {glossary.name}
                    </Link>
                    <a href="#" onClick={this.deleteGlossary.bind(this, glossary.id)} >
                        <i className="fa fa-trash-o" ></i>
                    </a>
                </label>   
            </li>
        );
    }
});

var GlossariesBox = React.createClass({
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
         event.target.value='';
    },

    _handleKeyPress: function(event) {
        if (event.key === 'Enter') {
            this.createGlossary(event);
        }
    },

    

    _notificationSystem: null,

    render: function(){
        var that = this;
        var containerId= this.props.containerId;
        
    	return(
    		<div className="glossary">
                <NotificationSystem ref="notificationSystem" />
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="page-header">My Glossaries</h1>
                    </div>
                </div>
                <ul>
    			{this.state.glossariesList.map(function(glossary){
                    return(<GlossaryItem glossary={glossary} containerId={containerId} key={glossary.id}/>);
    				
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
    	);
    }
});



module.exports = GlossariesBox;