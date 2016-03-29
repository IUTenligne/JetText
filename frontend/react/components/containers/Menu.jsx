var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';

var Menu = React.createClass({
  getInitialState: function() {
    return {
      links: []
    };
  },

  componentDidMount: function() {
    $('.pages-panel.sortable').sortable();
  },

  setPositions: function(){
    $('.pages-panel.sortable').find('a').each(function(i){
      $(this).attr("data-pos",i+1);
    });
  },

  render: function() {
    return (
      <ul className="nav pages-panel sortable" id="side-menu">
        {this.props.items.map((page, index) => (
          <li key={index}>
            <Link to={"/pages/"+page.id}>{page.name}</Link>
          </li>
        ))}
      </ul>
    );
  }
});

module.exports = Menu;