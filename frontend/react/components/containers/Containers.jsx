var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';

var Containers = React.createClass({
  getInitialState: function() {
    return {
      containersList: [],
      newContainerValue: ''
    };
  },
  
  componentDidMount: function() {
      this.serverRequest = $.get("/containers.json", function (result) {
          this.setState({
              containersList: result
          });
      }.bind(this));
  },

  componentWillUnmount: function() {
      this.serverRequest.abort();
  },

  handleChange: function(event) {
    this.setState({newContainerValue: event.target.value});
  },

  postData: function(event) {
    $.ajax({
      type: "POST",
      url: '/containers',
      data: { container: { name: this.state.newContainerValue, content: '' } }
    });

    this.setState({ containersList: this.state.containersList });
  },

  render: function() {
    var results = this.state.containersList;
    return (
        <div className="containers">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="page-header">Vos Containers</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <ul className="tags">
                        {results.map(function(result){
                            return (
                                <li className="tag" key={result.id}>
                                    <div className="triangle">
                                        
                                    </div>
                                    <div className="contenu">
                                        <div className="img">
                                            <i className="fa fa-folder-o"></i>
                                        </div>
                                        <div className="elem">
                                            <div className="name">
                                                {result.name}
                                            </div>
                                            <div className="option">
                                                <Link to={"/containers/"+result.id}>
                                                    <i className="fa fa-pencil"></i>
                                                </Link>
                                                <Link to={"/containers/"+result.id}>
                                                    <i className="fa fa-trash-o"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div> 
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
  }
});

module.exports = Containers;