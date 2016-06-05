var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('../widgets/Modal.jsx');

var Toolbar = React.createClass({
	getInitialState: function() {
    return {
    	containersName: '',
    	changeContainersName: true,
      overview: false
    };
  },

  componentDidMount: function() {
    this.setState({
      containersName: this.props.container.name
    });  	
  },

  handleContainersName: function(event) {
    this.setState({
      containersName: event.target.value,
      changeContainersName: true
    });
  },

  saveContainersName: function() {
    $.ajax({
      type: "PUT",
      url: '/containers/'+this.props.container.id,
      context: this,
      data: { 
        name: this.state.containersName
      },
      success: function(data) {
        this.setState({
          changeContainersName: false
        });
      }
    });
  },


	handleModalState: function(st) {
    this.setState({ overview: st });
  },

	render: function(){
		console.log(this.props);
		return(
			<div id="toolbar">
				<div id="previewbutton">
          <button onClick={this.handleModalState} title="Aperçu de la ressource"><i className="fa fa-eye"></i></button>
        </div>
        <div className="header">
          <h1>
            <input className="capitalize" ref="containername" type="text" value={this.state.containersName} placeholder="Titre de la ressource..." onChange={this.handleContainersName}/>
            { this.state.changeContainersName ? <button onClick={this.saveContainersName}><i className="fa fa-check"></i></button> : null }
          </h1>
        </div>
        { this.state.overview 
	          ? <Modal active={this.handleModalState} mystyle={"view"} title={"Aperçu"}> 
	            <iframe src={"/generator/overview/"+this.props.container.id} width="100%" height="100%" scrolling="auto" frameborder="0"></iframe>
	          </Modal> 
	          : null 
          }
				{ this.props.children }
			</div>
		);
	}
});

module.exports = Toolbar;