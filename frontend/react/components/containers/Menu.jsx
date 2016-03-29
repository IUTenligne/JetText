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
    var container = ReactDOM.findDOMNode(this.refs.dragulable);
    var drake = dragula([container]);

    this.moveItems(drake);
  },

  moveItems: function(drake) {
    console.log("moveitns");
    drake.on('drag', function(element, source) {
      var index = [].indexOf.call(element.parentNode.children, element);
    });

    drake.on('drop', function(element, target, source, sibling) {
      var index = [].indexOf.call(element.parentNode.children, element)
      var updated_order = [];

      $(source).children().each(function(i) {
        updated_order.push({ id: $(this).data('id'), weight: i });
      });

      $.ajax({
        type: "PUT",
        url: '/pages/sort',
        data: { order: updated_order }
      });
    });
  },

  _notificationSystem: null,

  render: function() {
    return (
      <div>
        <ul className="menu-container" ref="dragulable">
          {this.props.items.map((page, i) => {
            return (
              <li key={page.id} data-pos={i} data-id={page.id}>
                <Link to={"/pages/"+page.id} data-pos={i} data-id={page.id}>{page.name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
});

module.exports = Menu;