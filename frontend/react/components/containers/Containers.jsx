var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Constants = require('../constants');
var Loader = require('../widgets/Loader.jsx');
var Modal = require('../widgets/Modal.jsx');
var NotificationSystem = require('react-notification-system');


var Result = React.createClass({
    getInitialState: function() {
        return {
            option: false,
            overview: false,
            coverBackground: {}
        };
    },

    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },

    deleteContainer: function(event){
        var that = this;
        // NotificationSystem popup
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Confirmer la suppression',
            message: 'Voulez-vous supprimer la ressource ' + this.props.item.name + ' ?',
            level: 'success',
            position: 'tc',
            timeout: '20000',
            action: {
                label: 'Oui',
                callback: function() {
                    $.ajax({
                        type: "PUT",
                        url: "/containers/delete/" + that.props.item.id,
                        context: that,
                        success: function(data) {
                            /* passes the container.id to the parent using removeContainer's props */
                            that.props.removeContainer(data.container)
                        }
                    });
                }
            }
        });
    },

    generateContainer: function(event) {
        /* allow a container to be generated and downloaded */
        var that = this;
        $.ajax({
            type: "GET",
            url: '/generator/save/'+that.props.item.id,
            success: function(data) {
                window.location = data.url
            }
        });
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Ressource générée !',
            level: 'success'
        });
    },

    validateContainer: function(event){
        var that = this;
        // NotificationSystem popup
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Confirmer la validation',
            message: 'Voulez-vous envoyer la ressource ' + this.props.item.name + ' pour évaluation ?',
            level: 'success',
            position: 'tc',
            timeout: '20000',
            action: {
                label: 'Oui',
                callback: function() {
                    $.ajax({
                        type: "PUT",
                        url: "/containers/validate/" + that.props.item.id,
                        context: that,
                        success: function(data) {
                            that.props.validateContainer(data.containers)
                        }
                    });
                }
            }
        });
    },

    updateContainer: function(event){
        var that = this;
        $.ajax({
            type: "POST",
            url: "/containers/send_update/" + that.props.item.id
        });
    },

    optionContainer: function (){
        this.setState({
            option: true
        });
    },

    handleModalState: function(st) {
        this.setState({ overview: st });
    },

    _notificationSystem: null,

    render: function() {
        var result = this.props.item;
        return(
            <tr className="container">
              <td>
                <a href={"/#/containers/"+result.id}>{result.name}</a>
              </td>
              <td>
                {result.categories.map(function(category) {
                  return( <li key={category.id} className="category">{category.name}</li> );
                })}
              </td>
              <td>
                <span>{result.created_at.split("T")[0].split("-").reverse().join("/")}</span>
              </td>
              <td>
                <a href={"/#/containers/"+result.id} title="Editer">
                    <span className="fa-stack fa-lg">
                        <i className="fa fa-square fa-stack-2x"></i>
                        <i className="fa fa-pencil fa-stack-1x fa-inverse"></i>
                    </span>
                </a>

                { result.status
                    ? <a onClick={this.updateContainer} title="Actualiser">
                            <span className="fa-stack fa-lg">
                                <i className="fa fa-square fa-stack-2x"></i>
                                <i className="fa fa-check fa-stack-1x fa-inverse"></i>
                            </span>
                        </a>
                    : <a onClick={this.validateContainer} title="Marquer comme terminé">
                            <span className="fa-stack fa-lg">
                                <i className="fa fa-square fa-stack-2x"></i>
                                <i className="fa fa-check fa-stack-1x fa-inverse"></i>
                            </span>
                        </a>
                }

                <a onClick={this.handleModalState} title="Aperçu">
                    <span className="fa-stack fa-lg">
                        <i className="fa fa-square fa-stack-2x"></i>
                        <i className="fa fa-eye fa-stack-1x fa-inverse"></i>
                    </span>
                </a>

                <a onClick={this.generateContainer} title="Télécharger">
                    <span className="fa-stack fa-lg">
                        <i className="fa fa-square fa-stack-2x"></i>
                        <i className="fa fa-download fa-stack-1x fa-inverse"></i>
                    </span>
                </a>

                { result.status
                    ? null
                    : <a onClick={this.deleteContainer} title="Supprimer">
                            <span className="fa-stack fa-lg">
                                <i className="fa fa-trash-o fa-stack-1x "></i>
                                <i className="fa fa-ban fa-stack-2x"></i>
                            </span>
                        </a>
                }
              </td>
              <td>
                { this.state.overview
                    ? <Modal active={this.handleModalState} mystyle={"view"} title={"Aperçu"}>
                        <iframe src={"/overview/"+this.props.item.url} width="100%" height="100%" scrolling="auto" frameborder="0"></iframe>
                    </Modal>
                    : null
                }
                <NotificationSystem ref="notificationSystem" />
              </td>
            </tr>
        );
    }
});


var Containers = React.createClass({
    getInitialState: function() {
        return {
          containersList: [],
          categories: [],
          selectedCategories: [],
          loading: true,
          viewCreate: false,
          newContainerValue: '',
          inputCreate: false
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/containers.json", function(result) {
          this.setState({
            containersList: result
          });
        }.bind(this));

        this.serverRequest = $.get("/categories.json", function(result) {
          this.setState({
            categories: result,
            loading: false
          });
        }.bind(this));
    },

    componentWillUnmount: function() {
      this.serverRequest.abort();
    },

    handleContainerDeletion: function(containerId) {
      /* updates the containers list with the containerId returned by the prop this.props.deleteContainer of the child <Result /> */
      this.setState({
        containersList: this.state.containersList.filter((i, _) => i["id"] !== containerId)
      });
    },

    handleContainerValidation: function(containersList) {
      this.setState({
        containersList: containersList
      });
    },

    viewCreateContainers: function(){
      this.setState({ viewCreate: true });
    },

    createContainer: function(){
        $.ajax({
            type: "POST",
            url: "/containers",
            context: this,
            data: {
                container: {
                    name: this.state.newContainerValue,
                    content: "",
                    url: JSON.parse(currentUser).email,
                    categories: this.state.selectedCategories
                }
            },
            success: function(data){
                this.setState({
                    viewCreate: false,
                    containersList: this.state.containersList.concat([data]),
                });

                window.location = "/#/containers/" + data.id;
            }
        });
    },

    handleModalState: function(st) {
        this.setState({ viewCreate: false });
    },

    handleChange: function(myparam, event) {
        if (myparam == "newContainerValue") {
            this.setState({
                newContainerValue: event.target.value,
                inputCreate: true
            })
        }
    },

    selectCategory: function(event) {
      var i = this.state.selectedCategories.indexOf(parseInt(event.target.value));
      if (i != -1) {
        this.setState({ selectedCategories: this.state.selectedCategories.splice(i, 1) });
      } else {
        this.setState({ selectedCategories: this.state.selectedCategories.concat([parseInt(event.target.value)]) });
      }
    },

    _handleKeyPress: function(event) {
        if (event.key === 'Enter') {
            this.createContainer(event);
        }
    },

    _notificationSystem: null,

    render: function() {
        var results = this.state.containersList;
        var that = this;

        return (
            <article id="containers">
                <div className="containers">
                    <ul className="align">
                        <li id="add-container" onClick={this.viewCreateContainers}>
                            <button className="btn btn-success"><i className="fa fa-plus fa-fw "></i> Créer une ressource</button>
                        </li>
                    </ul>

                    { this.state.loading
                      ? <Loader />
                      : <table className="containers-table">
                          <thead>
                            <tr>
                              <th>Titre</th>
                              <th>Catégories</th>
                              <th>Date</th>
                              <th colspan="2">Options</th>
                            </tr>
                          </thead>
                          <tbody>
                              { results.map(function(result){
                                  return (
                                      <Result
                                          item={result}
                                          categories={that.state.categories}
                                          key={result.id}
                                          removeContainer={that.handleContainerDeletion}
                                          validateContainer={that.handleContainerValidation}
                                      />
                                  );
                              })}
                          </tbody>
                        </table>
                    }

                    { this.state.viewCreate
                        ? <Modal active={this.handleModalState} mystyle={"create"} title={"Créer une nouvelle ressource"}>
                            <div className="add_new">
                                <div id="inputs">
                                  <span className="input-group-addon" onClick={this.createContainer}>
                                    <i className="fa fa-plus fa-fw"></i>
                                  </span>
                                  <input
                                      type="text"
                                      ref="new_container"
                                      id="new_container"
                                      className="form-control"
                                      autoComplet="off"
                                      onKeyPress={this._handleKeyPress}
                                      onChange={this.handleChange.bind(this, "newContainerValue")}
                                      value={this.state.newContainerValue}
                                      placeholder="Titre de la ressource..."
                                  />
                                </div>
                                <ul id="categories-list">
                                  <h4>Catégories de la ressource :</h4>
                                  { this.state.categories.map(function(category) {
                                    return(
                                      <li key={category.id} className="category">
                                        <input value={category.id} name={category.name} type="checkbox" onChange={that.selectCategory}/>
                                        {category.name}
                                      </li>
                                    );
                                  })}
                                </ul>
                                <br/>
                                { this.state.inputCreate
                                  ? <div id="submit">
                                      <input type="submit" value='Créer' className="btn-success" onClick={this.createContainer}/>
                                    </div>
                                  : null
                                }
                            </div>
                          </Modal>
                        : null
                    }
                </div>
            </article>
        );
    }
});

module.exports = Containers;
