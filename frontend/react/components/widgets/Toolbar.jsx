var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('../widgets/Modal.jsx');
var enhanceWithClickOutside = require('react-click-outside');


var Toolbar = React.createClass({
	getInitialState: function() {
    return {
    	containersName: '',
    	changeContainersName: false,
      overview: false,
      menu: false
    };
  },

  componentDidMount: function() {
    this.setState({
      containersName: this.props.container.name
    });  	
  },

  toggleMenu: function() {
    this.setState({ menu: !this.state.menu });
  },

  handleClickOutside: function() {
    this.setState({ menu: false });
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
    this.setState({ 
      overview: st
    });
  },

	render: function(){
    const style = {
      display: "none"
    };

		return(
			<div id="toolbar">
        <div className="header">
          <h1 className="capitalize" onClick={this.toggleMenu}>{this.state.containersName}</h1>
          <div id="container-toolbar-menu" style={this.state.menu ? null : style}>
            <ul>
              <li>
                <a href="javascript:;" onClick={this.handleModalState} title="Aperçu de la ressource">Aperçu de la ressource</a>
              </li>
              <li>
                <input className="capitalize" ref="containername" type="text" value={this.state.containersName} placeholder="Titre de la ressource..." onChange={this.handleContainersName}/>
                { this.state.changeContainersName ? <button onClick={this.saveContainersName}><i className="fa fa-check"></i></button> : null }
              </li>
            </ul>
          </div>
        </div>
        { this.state.overview 
	          ? <Modal active={this.handleModalState} mystyle={"view"} title={"Aperçu"}> 
	            <iframe src={"/generator/overview/pages/"+this.props.page.id} width="100%" height="100%" scrolling="auto" frameborder="0"></iframe>
	          </Modal> 
	          : null 
          }
				{ this.props.children }
			</div>
		);
	}
});

module.exports = enhanceWithClickOutside(Toolbar);