var React = require('react');
import { Link } from 'react-router';
var Containers = require('./containers/Containers.jsx');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <Containers />
      </div>
    );
  }
});

module.exports = App;