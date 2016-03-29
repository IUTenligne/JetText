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
      <div>
        <div key={Math.random()}>
          {results.map(function(result){
            return (
              <li key={result.id}>
                <Link to={"/containers/"+result.id}>{result.name}</Link>
              </li>
            );
          })}
        </div>
        <div>
          <input
            type="text"
            id="new_container"
            value={this.state.newContainerValue}
            onChange={this.handleChange}
          />
          { this.state.newContainerValue ? <input type="button" onClick={this.postData} value="Save" /> : null }
        </div>
      </div>
    );
  }
});

module.exports = Containers;