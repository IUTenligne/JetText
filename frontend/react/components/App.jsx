var React = require('react');
import { Link } from 'react-router';

var App = React.createClass({

  render: function() {
    return (
      <div>
        App
        <li><Link to="/containers">Containers</Link></li>
      </div>
    );
  }
});

module.exports = App;