var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, Link, hashHistory } from 'react-router';
var Block = require('../blocks/Block.jsx');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var GlossariesBox = require('../glossaries/GlossariesBox.jsx');
var dragula = require('react-dragula');


var Page = React.createClass({
    getInitialState: function() {
        return {
            status: 0,
            page: '',
            blocks: [],
            retractedBlocks: false,
            pageName: '',
            changePageName: false,
            popUp: false
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/pages/"+this.props.page+".json", function (result) {
            this.setState({
                status: result.status,
                page: result.page,
                blocks: result.blocks,
                pageName: result.page.name
            });
        }.bind(this));

        var container = ReactDOM.findDOMNode(this.refs.dragableblocks);
        /* makes the blocks draggable by using "handle" class elements in block's jsx */
        var drake = dragula([container], {
            moves: function (el, container, handle) {
                return handle.className === 'handle';
            }
        });

        this.moveItems(drake);
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    createBlock: function(typeId, event) {
        for (name in CKEDITOR.instances) {
            CKEDITOR.instances[name].destroy(true);
        }
        
        $.ajax({
            type: "POST",
            url: '/blocks',
            context: this,
            data: { 
                block: { 
                    name: '', 
                    content: '', 
                    sequence: this.state.blocks.length, 
                    page_id: this.state.page.id,
                    type_id: typeId
                } 
            },
            success: function(data) {
                this.setState({
                    blocks: this.state.blocks.concat([data])
                });
            }
        });

        event.target.value = 1;
    },

    handleBlockDeletion: function(block_id) {
        /* updates the blocks list after a block deletion */
        this.setState({
            blocks: this.state.blocks.filter((i, _) => i["id"] !== block_id)
        });
    },

    handleBlockAdd: function(block) {
        /* updates the block list after a duplication on the same page */
        if (block.page_id == parseInt(this.props.page)) {
            this.setState({
                blocks: this.state.blocks.concat([block])
            });
        }
    },

    moveItems: function(drake) {
        for (name in CKEDITOR.instances) {
            CKEDITOR.instances[name].destroy(true);
        }
        
        var that = this;

        drake.on('drag', function(element, source) {
            var index = [].indexOf.call(element.parentNode.children, element);
            that.setState({ retractedBlocks: true });
        });

        drake.on('drop', function(element, target, source, sibling) {
            var index = [].indexOf.call(element.parentNode.children, element);
            var updated_sequence = [];
            var blocks = that.state.blocks;

            $(source).children().each(function(i) {
                updated_sequence.push({ id: $(this).data('id'), sequence: i });
            });

            $.ajax({
                type: "PUT",
                url: '/blocks/sort',
                context: that,
                data: { sequence: updated_sequence },
                success: function(data) {
                    var sortedBlocks = [];
                    for (var i in updated_sequence) {
                        var o = updated_sequence[i];
                        var block = $.grep(blocks, function(e){
                            if (e.id == o.id) return e;
                        });
                        sortedBlocks.push(block[0]);
                    }

                    that.setState({ blocks: sortedBlocks });
                }
            });

            that.setState({ retractedBlocks: false });
        });
    },

    handleDragAction: function(blockList) {
        /* sent by its Block.jsx child */
        this.setState({ blocks: blockList });
    },

    handlePageRename: function(event) {
        this.setState({ 
            pageName: event.target.value.trim(),
            changePageName: true 
        });
    },

    savePageName: function() {
        $.ajax({
            type: "PUT",
            url: '/pages/'+this.state.page.id,
            data: {
                name: this.state.pageName
            },
            context: this,
            success: function() {
                this.setState({ changePageName: false });
                this.props.changePageName(this.state.pageName, this.state.page.id);
            }
        });
    },

    showGlossaries: function() {
        this.setState({
            popUp: true
        })
    },

    closeModal: function() {
        this.setState({
            popUp: false
        })
    },

    render: function() {
        var page = this.state.page;
        var that = this;
        
        return (
            <div className="page"> 
                <h2 className="header_page">
                    <input className="capitalize" ref="containername" type="text" value={this.state.pageName} placeholder="Titre de la page..." onChange={this.handlePageRename}/>
                    { this.state.changePageName ? <button onClick={this.savePageName}><i className="fa fa-check"></i></button> : null }
                </h2>

                <ReactCSSTransitionGroup transitionName="blocks-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppear={true} transitionAppearTimeout={500}>
                    <div className={this.state.retractedBlocks ? "blocks retracted" : "blocks"} ref="dragableblocks">
                        { this.state.blocks.map(function(block){
                            return (
                                <Block 
                                    key={block.id} 
                                    item={block} 
                                    containerId={page.container_id} 
                                    removeBlock={that.handleBlockDeletion}
                                    addBlock={that.handleBlockAdd} 
                                />
                            );
                        })}
                    </div>
                    
                    <div id="add_new_block">
                        { this.props.types.map(function(type) {
                            return (
                                <div key={type.id} className={"select-action " + type.name.toLowerCase()} onClick={that.createBlock.bind(that, type.id)}>
                                    <i className={"fa fa-fw icon-" + type.name.toLowerCase()} aria-hidden="true"></i><br/>
                                    {type.name}
                                </div>
                            );
                        })}

                        <div className="select-action glossary">
                            <a onClick={this.showGlossaries}>
                                <i className="fa fa-book fa-fw" aria-hidden="true"></i><br/>
                                Glossaires
                            </a>
                        </div>
                    </div>
                    <div>
                        {this.state.popUp ? <GlossariesBox containerId={page.container_id}  handleModalState={this.closeModal}/> : null}
                    </div>
                </ReactCSSTransitionGroup>      
            </div>
        );
    }
});

module.exports = Page;
