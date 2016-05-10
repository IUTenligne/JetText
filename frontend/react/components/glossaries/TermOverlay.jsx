var React = require('react');
var NotificationSystem = require('react-notification-system');


var TermOverlay = React.createClass({

	getInitialState: function() {
	    return {
	        glossarriesList: [] ,
            glossariesEmpty: false,
            term: "",
            selectType: 1
	    };
	},

	componentDidMount: function() {
	    this.serverRequest = $.get("/glossaries.json", function(result){
            console.log(result.glossaries.length , this.state.glossariesEmpty);
            if (result.glossaries.length > 0 ){
                this.setState({
                    glossarriesList: result.glossaries
                });
            }else{
                this.setState({
                    glossariesEmpty: true
                });
                console.log(this.state.glossariesEmpty);
            }
	    }.bind(this));
        this.setState({
            term: this.props.select
        });
	    this._notificationSystem = this.refs.notificationSystem;
	},

	componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    handleChange: function(event) {
        this.setState({
            term: event.target.value
        })
    },
    createTerm: function(){
        if(this.state.glossariesEmpty == false){
            $.ajax({
                type: "POST",
                url: '/terms',
                context: this,
                data: {
                    term: {
                        name: this.state.term,
                        description: this.state.newDescriptionValue,
                        glossary_id: this.state.selectedType
                    }
                }
            })
        }else{
            $.ajax({
                type: "POST",
                url: '/glossaries',
                context: this,
                data: {
                    glossary: {
                        name: this.state.newDescriptionValue
                    }
                },
                success: function(data){
                    $.ajax({
                        type: "POST",
                        url: '/terms',
                        context: this,
                        data: {
                            term: {
                                name: this.state.term,
                                description: this.state.newDescriptionValue,
                                glossary_id: data.id
                            }
                        }
                    })
                }
            })
        }
    },
    selectType: function(event) {
        this.setState({ selectedType: event.target.value });
    },


    _notificationSystem: null,

    render: function(){
    	return(
    		<form>
                <NotificationSystem ref="notificationSystem" />

                { !this.state.glossariesEmpty ?
                    <select value={this.state.selectedType} onChange={this.selectType}>
            			{this.state.glossarriesList.map(function(glossary){
            				return(
                                <option value={glossary.id} >{glossary.name}</option>
            				);
            			})}
                    </select>
                : null }

                { this.state.glossariesEmpty ?
                    <div className="add_new_glossary">
                        <h3> Vous n'avez pas de glossary !</h3>
                        <div className="input-group input-group-lg">
                            <input type="text" id="new_glossary" value={this.state.newGlossaryValue}  placeholder="Create new glossary..." />
                        </div>
                    </div>
                : null }
                <br/>
                <input type="text" value={this.state.term} onChange={this.handleChange}  /><br/>
    			<textarea  type="text" value={this.state.newDescriptionValue} placeholder="Create new definition..." />

                <input type="submit" value='Create' className="btn-success" onClick={this.createTerm}/>
    		</form>  
    	);
    }
});

module.exports = TermOverlay;