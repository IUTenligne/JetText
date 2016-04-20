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
            data: { page: { name: this.state.newPageValue, content: '', level: 0, container_id: this.props.container.id } },
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

    handleLevelClick: function(page, way, event) {
        var pageList = this.props.pages;
        var newList = [];
        var newLevel = page.level;

        for (var i in pageList) {
            if (pageList[i].id == page.id) {
                if (way == "add")
                    newLevel += 1;
                if (way == "remove")
                    newLevel -= 1;
                pageList[i].level = newLevel;
            }
            newList.push(pageList[i]);
        }

        console.log(pageList, newList);

        $.ajax({
            type: "PUT",
            url: '/pages/update_level',
            context: this,
            data: { id: page.id, level: newLevel },
            success: function(data) {
                this.setState({
                    pages: newList
                });
                /* passes the fresh pages list to the parent via callback */
                this.props.levelizeAction(newList);
            }
        });
    },

	render: function() {
        var that = this;
		return (
			<div className="sidebar-nav">

                <div className="iutenligne">
	                <a  href="http://www.iutenligne.net/resources.html">
	                    <img src="/templates/iutenligne/assets/img/iutenligne.png" border="0"/>
	                </a>
                </div>

                <div className="menu-container">
                    <ul className="menu-container nav" id="side-menu" ref="dragulable">
												{ this.props.pages.map((page, i) => {
														return (
																<li key={page.id} data-pos={i} data-id={page.id} className={"level-"+page.level}>
																		<Link to={"/containers/"+this.props.container.id+"/"+page.id}>{page.name}</Link>
																			{page.level <= 4 ? <a href="javascript:void(0);" onClick={that.handleLevelClick.bind(that, page, "add")}><i className="fa fa-arrow-right"></i></a> : null }
																			{page.level > 0 ? <a href="javascript:void(0);" onClick={that.handleLevelClick.bind(that, page, "remove")}><i className="fa fa-arrow-left"></i></a> : null }
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
                        <input type="text" id="new_page" className="form-control" value={this.state.newPageValue} onChange={this.handleChange} onKeyPress={this._handleKeyPress} autoComplet="off" placeholder="Create new page..." />
                    </div>
                </div>
	        </div>
	    );
	}
});

module.exports = Menu;
