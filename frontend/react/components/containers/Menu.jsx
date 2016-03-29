var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, Link, hashHistory } from 'react-router';
var dragula = require('react-dragula');

var Menu = React.createClass({
  getInitialState: function() {
    return {
      pagesOrder: []
    };
  },

  componentDidMount: function () {
    var container = ReactDOM.findDOMNode(this);
    var drake = dragula([container]);
    drake.on('drag', function(element, source) {
      var index = [].indexOf.call(element.parentNode.children, element);
    });

    drake.on('drop', function(element, target, source, sibling) {
      var index = [].indexOf.call(element.parentNode.children, element)
      var updated_order = [];
      $(source).children().each(function(i) {
        console.log($(this).text(), $(this).data('id'), $(this).data('pos'), i);
        updated_order.push({ id: $(this).data('id'), position: $(this).data('pos') });
      });
      $.ajax({
        type: "PUT",
        url: '/pages/sort',
        data: { order: updated_order }
      });
    });
  },

  render: function() {
    return (
      <ul className="menu-container">
        {this.props.items.map((page, i) => {
          return (
            <li key={page.id} data-pos={i} data-id={page.id}>
              <Link to={"/pages/"+page.id} data-pos={i} data-id={page.id}>{page.name}</Link>
            </li>
          );
        })}
      </ul>
    );
  }
});

module.exports = Menu;