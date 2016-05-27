var React = require('react');
var ReactDOM = require('react-dom');
var dragula = require('react-dragula');
import { Router, Route, Link, hashHistory } from 'react-router';

var levels = {
    /* min and max levels for menu items */
    min: 0,
    max: 2
}

var Menu = React.createClass({
    getInitialState: function() {
        return {
            newPageValue: '',
            activePage: '',
            pageHover: false,
            hoveredPage: ''
        };
    },

    componentDidMount: function() {
        this.setState({
            activePage: this.props.activePage
        });
        var container = ReactDOM.findDOMNode(this.refs.dragulable);
     
        
        /* makes the blocks draggable by using "handle" class elements in block's jsx */
        var drake = dragula([container], {
            moves: function (el, container, handle) {
                return handle.className === 'handle';
            }
        });
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
            data: { 
                page: { 
                    name: this.state.newPageValue, 
                    content: '', 
                    sequence: this.props.pages.length,
                    level: 0, 
                    container_id: this.props.container.id 
                }
            },
            success: function(data) {
                this.setState({
                    newPageValue: ''
                });
                this.props.dragAction(this.props.pages.concat([data]));
            }
        });

        event.target.value = '';
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
        /* changes the level of a page in the menu */
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

    deletePage: function(activePage, page) {
        this.props.pageDeletion(activePage, page);
    },

    activeHover: function(page){
        this.setState({ 
            pageHover: true,
            hoveredPage: page.id
        });
    },

    hoverFalse: function(){
        this.setState({ pageHover: false});
    },

    render: function() {
        var that = this;
        return (
            <div className="sidebar menu" role="navigation">
                <h2 className="zone-header"><i className="fa fa-bars"></i> Menu</h2>

                <ul className="side-menu" ref="dragulable">
                    { this.props.pages.map((page, i) => {
                        return (
                            <li 
                                key={page.id} 
                                data-pos={i} 
                                data-id={page.id} 
                                className={page.id == this.props.activePage ? "level-"+page.level+" active" : "level-"+page.level}
                            >
                                <div className="handle"></div>

                                <div className="menu-content">
                                   
                                    <Link className="page-link-menu" to={"/containers/"+that.props.container.id+"/"+page.id} >{page.name}</Link>

                                    <div className="option-page">
           
                                            { page.level > levels.min
                                                ? <button onClick={that.handleLevelClick.bind(that, page, "remove")} title="Retirer un niveau">
                                                    <i className="fa fa-chevron-left fa-fw"></i>
                                                </button>
                                                : null
                                            }

                                            { (page.level <= levels.max) && (page != this.props.pages[0]) 
                                                ? <button onClick={that.handleLevelClick.bind(that, page, "add")} title="Ajouter un niveau">
                                                    <i className="fa fa-chevron-right fa-fw"></i> 
                                                </button> 
                                                : null
                                            }
                                               <button className="page-delete"  onClick={this.deletePage.bind(that, this.state.activePage, page)} title="Supprimer la page">
                                                <i className="fa fa-remove"></i>
                                            </button>  
             
                                        
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul> 

                <div id="add_new_page" className="input-group">
                    <span className="input-group-addon">
                        <i className="fa fa-plus fa-fw"></i>
                    </span>
                    <input type="text" id="new_page" className="form-control " value={this.state.newPageValue} onChange={this.handleChange} onKeyPress={this._handleKeyPress} autoComplet="off" placeholder="Ajouter une page..." />
                </div>
            </div>
        );
    }
});

module.exports = Menu;
