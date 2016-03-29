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
      <div>
        {results.map(function(result){
          return (
            <li key={result.id}>
              <Link to={"/containers/"+result.id}>{result.name}</Link>
            </li>
          );
        })}
      </div>
    );
  }
});

module.exports = Containers;