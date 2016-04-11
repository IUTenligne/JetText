var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';

var Containers = React.createClass({
    getInitialState: function() {
        return {
            containersList: []
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

    render: function() {
      var results = this.state.containersList;
      return (
          <div className="containers">

              <div className="row">
                  <div className="col-lg-12">
                      <h1 className="page-header">My containers</h1>
                  </div>
              </div>

              <div className="row">
                {results.map(function(result){
                  return (
                    <div className="col-lg-4 tags" key={result.id}>  
                      <li className="tag">
                          <div className="contenu">
                              <div className="elem">
                                  <div className="name">
                                      <Link to={"/containers/"+result.id}>
                                          {result.name}
                                      </Link>
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
                    </div>
                  );
                })}
              </div>
          </div>
      );
  }
});

module.exports = Containers;