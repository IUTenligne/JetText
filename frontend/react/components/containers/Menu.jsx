var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var dragula = require('react-dragula');

var Menu = React.createClass({
  componentDidMount: function () {
    var container = React.findDOMNode(this);
    dragula([container]);
  },

  render: function() {
    return (
      <ul className="menu-container">
        {this.props.items.map((page, i) => {
          return (
            <li key={page.id}>
              <Link to={"/pages/"+page.id}>{page.name}</Link>
            </li>
          );
        })}
      </ul>
    );
  }
});

module.exports = Menu;