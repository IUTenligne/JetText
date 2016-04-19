var React = require('react');
var ReactDOM = require('react-dom');
var dragula = require('react-dragula');
import { Router, Route, Link, hashHistory } from 'react-router';

var Menu = React.createClass({
	getInitialState: function() {
        return {
            newPageValue: '',
            activePage: ''
        };
    },

    componentDidMount: function() {
        var container = ReactDOM.findDOMNode(this.refs.dragulable);
        var drake = dragula([container]);
        this.moveItems(drake, this.props.pages);
    },

    handleChange: function(event) {
        this.setState({newPageValue: event.target.value});
    },

    createPage: function(event) {
        $.ajax({
            type: "POST",
            url: '/pages',
            context: this,
            data: { page: { name: this.state.newPageValue, content: '', container_id: this.props.container.id } },
            success: function(data) {
                this.setState({ 
                    newPageValue: ''
                });
                this.props.dragAction(this.props.pages.concat([data]));  
            }
        });

        event.target.value='';
    },

    moveItems: function(drake, pages) {
        drake.on('drag', function(element, source) {
            var index = [].indexOf.call(element.parentNode.children, element);
        });

        var that = this;

        drake.on('drop', function(element, target, source, sibling) {
            var index = [].indexOf.call(element.parentNode.children, element)
            var updated_sequence = [];

            $(source).children().each(function(i) {
                updated_sequence.push({ id: $(this).data('id'), sequence: i });
            });

            $.ajax({
                type: "PUT",
                url: '/pages/sort',
                context: that,
                data: { sequence: updated_sequence },
                success: function(data) {
                    /* necessary to resequence the pages correctly 
                    sortedPages is filled with this.state.pages values following updated_sequence's new sequence */
                    var sortedPages = [];
                    for (var i in updated_sequence) {
                        var o = updated_sequence[i];
                        var page = $.grep(pages, function(e){ 
                            if (e.id == o.id) return e; 
                        });
                        sortedPages.push(page[0]);
                    }

                    that.setState({
                        pages: sortedPages
                    });
                    that.props.dragAction(sortedPages);          
                }
            });
        });
    },

    _handleKeyPress: function(event) {
        if (event.key === 'Enter') {
            this.createPage(event);
        }
    },

	render: function() {
		return (
			<div className="navbar-default sidebar menu" role="navigation">
	            <div className="sidebar-nav navbar-collapse collapse ">
	                <a href="http://www.iutenligne.net/resources.html">
	                    <img src="/templates/iutenligne/assets/img/iutenligne.png" border="0"/>
	                </a>

	                <div>
	                    <ul className="menu-container nav" id="side-menu" ref="dragulable">
	                        { this.props.pages.map((page, i) => {
	                            return (
	                                <li key={page.id} data-pos={i} data-id={page.id}>
	                                    <Link to={"/containers/"+this.props.container.id+"/"+page.id}>{page.name}</Link>
	                                </li>
	                            );
	                        })}
	                    </ul>
	                </div>
	                
	                <div id="add_new_page">
                        <div className="input-group input-group-lg">
                            <span className="input-group-addon">
                                <i className="fa fa-plus fa-fw"></i>
                            </span>
	                        <input type="text" id="new_page" className="form-control " value={this.state.newPageValue} onChange={this.handleChange} onKeyPress={this._handleKeyPress} autoComplet="off" placeholder="Create new page..." />
	                    </div>
	                </div>
	           </div>
	        </div>
	    );
	}
});

module.exports = Menu;