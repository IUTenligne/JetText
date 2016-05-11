var React = require('react');
var NotificationSystem = require('react-notification-system');


var TermOverlay = React.createClass({

	getInitialState: function() {
	    return {
	        glossarriesList: [] ,
            glossariesEmpty: false,
            term: "",
            selectedGlossary: "", 
            newGlossaryValue: "",
            inputCreate: false
	    };
	},

	componentDidMount: function() {
	    this.serverRequest = $.get("/glossaries.json", function(result){
            if (result.glossaries.length > 0 ){
                this.setState({
                    glossarriesList: result.glossaries,
                    selectedGlossary: result.glossaries[0]["id"]
                });
            }else{
                this.setState({
                    glossariesEmpty: true
                });
            }
	    }.bind(this));

        this.setState({
            term: this.props.select.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/,/, '')
        });

	    this._notificationSystem = this.refs.notificationSystem;
	},

	componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    handleChange: function(elem, event) {
        if (elem == "term") {
            this.setState({
                term: event.target.value
            })
        } else if (elem == "newGlossaryValue") {
            this.setState({
                newGlossaryValue: event.target.value
            })
        } else if (elem == "newDescriptionValue") {
            this.setState({
                newDescriptionValue: event.target.value,
                inputCreate: true
            })
        }
    },

    createTerm: function(){
        if(this.state.glossariesEmpty == false){
            $.ajax ({
                type: "POST",
                url: '/terms',
                context: this,
                data: {
                    term: {
                        name: this.state.term,
                        description: this.state.newDescriptionValue,
                        glossary_id: this.state.selectedGlossary
                    }
                },
                success: function(){
                    this.props.modalState(false)
                },
            });
        }else {
            $.ajax ({
                type: "POST",
                url: '/glossaries',
                context: this,
                data: {
                    glossary: {
                        name: this.state.newGlossaryValue
                    }
                },
                success: function(data){
                    $.ajax ({
                        type: "POST",
                        url: '/terms',
                        context: this,
                        data: {
                            term: {
                                name: this.state.term,
                                description: this.state.newDescriptionValue,
                                glossary_id: data.id
                            }
                        },
                        success: function(){
                            this.props.modalState(false)
                        },
                    })
                },
            });
        }
    },

    selectGlossary: function(event) {
        this.setState({ selectedGlossary: event.target.value });
    },


    _notificationSystem: null,

    render: function(){

    	return(
    		<form>
                <NotificationSystem ref="notificationSystem" />

                { !this.state.glossariesEmpty ?
                    <select value={this.state.selectedGlossary} onChange={this.selectGlossary}>
            			{this.state.glossarriesList.map(function(glossary){
            				return(
                                <option value={glossary.id} key={glossary.id}>{glossary.name}</option>
            				);
            			})}
                    </select>
                :  <div className="add_new_glossary">
                        <div className="input-group input-group-lg">
                            <input type="text" id="new_glossary" value={this.state.newGlossaryValue}  onChange={this.handleChange.bind(this, "newGlossaryValue")} placeholder="Create new glossary..." />
                        </div>
                    </div>
                }
                <br/>
                <input type="text" value={this.state.term} onChange={this.handleChange.bind(this, "term")}  /><br/>
    			<textarea  type="text" value={this.state.newDescriptionValue} onChange={this.handleChange.bind(this, "newDescriptionValue")} placeholder="Create new definition..." />
                { this.state.inputCreate 
                    ? <input type="submit" value='Create' className="btn-success" onClick={this.createTerm}/>
                    : null
                }
                
    		</form>  
    	);
    }
});

module.exports = TermOverlay;