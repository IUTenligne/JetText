var React = require('react');
var ReactDOM = require('react-dom');
var NotificationSystem = require('react-notification-system');
var GlossaryBox = require('./GlossaryBox.jsx');
var Modal = require('../widgets/Modal.jsx');
var Loader = require('../widgets/Loader.jsx');


var GlossaryItem = React.createClass({
  getInitialState: function() {
    return {
      isChecked: false,
      showTerms: false
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
      message: 'Confirmer la suppression du glossaire ?',
      level: 'success',
      position: 'tc',
      timeout: '20000',
      action: {
        label: 'Oui',
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
      showTerms: !this.state.showTerms
    })
  },

  render: function(){
    var glossary = this.props.glossary;

    return(
      <li className="name-glossary">
        <NotificationSystem ref="notificationSystem"/>
        <div className="viewGlossary">
          <div className="switch">
            <input
              type="checkbox"
              checked={this.state.isChecked}
              onChange={this.onChange}
              id="IdCheckBox"
              className="cmn-toggle cmn-toggle-round-flat"
            />
            { this.state.isChecked
              ? <label className="check" for="IdCheckBox"/>
              : <label for="IdCheckBox"/>
            }
          </div>
        <div className="name">
          <p onClick={this.showTerms}>{glossary.name}</p>
          <i className="fa fa-chevron-down" aria-hidden="true" onClick={this.showTerms}></i>
        </div>
        <a href="#" onClick={this.deleteGlossary.bind(this, glossary.id)} className="delete">
          <i className="fa fa-trash-o" ></i>
        </a>

      </div>
      { this.state.showTerms ? <GlossaryBox glossary={glossary.id} /> : null }
    </li>
  );
}
});


var GlossariesBox = React.createClass({
  getInitialState: function() {
    return {
      loading: true,
      newGlossaryValue: '',
      glossariesList: [],
      containersGlossaries: [],
      modalState: true,
      inputCreate: false
    };
  },

  handleChange: function(input, event) {
    if(input == "newGlossaryValue"){
      this.setState({
        newGlossaryValue: event.target.value,
        inputCreate: true
      });
    }

  },

  componentDidMount: function() {
    this.serverRequest = $.get("/glossaries/box/"+this.props.containerId+".json", function(result){
      this.setState({
        glossariesList: result.glossaries,
        containersGlossaries: result.containers_glossaries,
        loading: false
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

  handleModalState: function(st) {
    this.setState({ modalState: st });
    this.props.handleModalState(st);
  },

  _notificationSystem: null,

  render: function(){
    var that = this;
    var containerId= this.props.containerId;
    return(
      <Modal active={this.handleModalState} mystyle={"glossaire"} title={"Mes glossaires"}>
        { this.state.loading
          ? <Loader />
          : null
        }
        <div id="glossaries">
          <ul id="list-glossary">
            { this.state.glossariesList.map(function(glossary) {
              return(<GlossaryItem glossary={glossary} containerId={containerId} removeGlossary={that.handleGlossaryDeletion} containersGlossaries={that.state.containersGlossaries} key={glossary.id}/>);
            })}
          </ul>

          <div className="add_new_glossary">
            <div className="input-group input-group-lg">
              <span className="input-group-addon">
                <i className="fa fa-plus fa-fw"></i>
              </span>
              <input
                type="text"
                id="new_glossary"
                className="form-control"
                value={this.state.newGlossaryValue}
                onChange={this.handleChange.bind(this, "newGlossaryValue")}
                onKeyPress={this._handleKeyPress}
                autoComplet="off"
                placeholder="Create new glossary..."
                />
              { this.state.inputCreate && this.state.newGlossaryValue != ''
                ? <input type="submit" value='Créer' className="btn-success" onClick={this.createGlossary}/>
                : null
              }
            </div>
          </div>

          <NotificationSystem ref="notificationSystem" />
        </div>
      </Modal>
    );
  }
});



module.exports = GlossariesBox;
