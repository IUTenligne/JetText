var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, Link, hashHistory } from 'react-router';
var dragula = require('react-dragula');

var Menu = React.createClass({
  getInitialState: function() {
    return {
      currentPage: '',
      pages: [],
      pagesLinks: []
    };
  },

  componentDidMount: function () {
    //storing pages order
    var order = [];
    {this.props.items.map((page, i) => {
        order.push(page.id);
    })};

    this.setState({
      pages: this.props.items,
      pagesLinks: this.props.items
    });

    var container = ReactDOM.findDOMNode(this.refs.dragulable);
    var drake = dragula([container]);
    this.moveItems(drake, this.props.items);
  },

  moveItems: function(drake, pages) {
    drake.on('drag', function(element, source) {
      var index = [].indexOf.call(element.parentNode.children, element);
    });

    var that = this;

    drake.on('drop', function(element, target, source, sibling) {
      var index = [].indexOf.call(element.parentNode.children, element)
      var updated_order = [];

      $(source).children().each(function(i) {
        updated_order.push({ id: $(this).data('id'), weight: i });
      });

      $.ajax({
        type: "PUT",
        url: '/pages/sort',
        context: that,
        data: { order: updated_order },
        success: function(data) {
          var sortedPages = [];
          for (var i in updated_order) {
            var o = updated_order[i];
            var page = $.grep(pages, function(e){ 
              if (e.id == o.id)
                return e; 
            });
            sortedPages.push(page[0]);
          }

          that.setState({ 
            pages: sortedPages,
            pagesLinks: sortedPages
          });           
        }
      });
    });
  },

  _notificationSystem: null,

  _checkActive: function(id) {
    return (id == this.state.currentPage) ? "active" : ""
  },

  render: function() {
    return (
      <div>
        <ul className="menu-container nav" id="side-menu" ref="dragulable">
          {this.state.pages.map((page, i) => {
            return (
              <li key={Math.random()} data-pos={i} data-id={page.id}>
                <Link to={"/containers/"+this.props.container+"/"+this.state.pagesLinks[i].id} key={this.state.pagesLinks[i].id} className={this._checkActive(this.state.pagesLinks[i].id)} >{this.state.pagesLinks[i].name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
});

module.exports = Menu;