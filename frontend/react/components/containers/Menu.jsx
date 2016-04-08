var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, Link, hashHistory } from 'react-router';
var dragula = require('react-dragula');

var NewPage = React.createClass({
  render: function(){
    return(
      <div>
        <form>
          <p>Create new page</p>
          <p>
            <input type="text" id="text"/>
            <input type="submit" value='Save' className="btn"/>
          </p>
        </form>
      </div>
    )
  }
})

var Menu = React.createClass({
  getInitialState: function() {
    return {
      currentPage: '',
      pagesOrder: []
    };
  },

  componentDidMount: function () {
    //storing pages order
    var order = [];
    {this.props.items.map((page, i) => {
        order.push(page.id);
    })};
    this.setState({pagesOrder: order});

    var container = ReactDOM.findDOMNode(this.refs.dragulable);
    var drake = dragula([container]);

    this.moveItems(drake);
  },

  moveItems: function(drake) {
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
          that.setState({ pagesOrder: updated_order });
          location.reload();
        }
      });
    });
  },

  _notificationSystem: null,

  changePage: function(event) {
    this.setState({ currentPage: event.target.id });
  },

  _checkActive: function(id) {
    return (id == this.state.currentPage) ? "active" : ""
  },

  render: function() {
    return (
      <div>
        <ul className="menu-container nav" id="side-menu" ref="dragulable">
          {this.props.items.map((page, i) => {
            return (
              <li key={page.id} data-pos={i} data-id={page.id}>
                <Link to={"/container/"+this.props.container+"/"+page.id} key={page.id} id={page.id} data-pos={i} data-id={page.id} className={this._checkActive(page.id)} onClick={this.changePage}>{page.name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
});

module.exports = Menu;