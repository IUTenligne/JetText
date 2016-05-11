var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Block = require('../blocks/Block.jsx');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var GlossariesBox = require('../glossaries/GlossariesBox.jsx');

var Page = React.createClass({
    getInitialState: function() {
        return {
            status: 0,
            page: '',
            blocks: [],
            newBlockValue: '',
            selectedType: 1
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/pages/"+this.props.page+".json", function (result) {
            this.setState({
                status: result.status,
                page: result.page,
                blocks: result.blocks
            });
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    handleChange: function(event) {
        this.setState({ newBlockValue: event.target.value });
    },

    createBlock: function(event) {
        $.ajax({
            type: "POST",
            url: '/blocks',
            context: this,
            data: { block: { name: this.state.newBlockValue, content: '', page_id: this.state.page.id, type_id: this.state.selectedType } },
            success: function(data) {
                this.setState({
                    blocks: this.state.blocks.concat([data]),
                    newBlockValue: '',
                    selectedType: 1
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

    _selectType: function(event) {
        this.setState({ selectedType: event.target.value });
    },

    

    render: function() {
        var page = this.state.page;
        var that = this;
        
        return (
            <div className="page"> 
                <h2 className="header_page">{page.name}</h2>

                <div className="blocks">
                    <ReactCSSTransitionGroup transitionName="blocks-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppear={true} transitionAppearTimeout={500}>
                    {this.state.blocks.map(function(block){
                        return <Block key={block.id} item={block} containerId={page.container_id} removeBlock={that.handleBlockDeletion} />
                    })}
                    </ReactCSSTransitionGroup>
                </div>

                <form id="add_new_block">
                    <input type="text" id="new_block" className="form-control" value={this.state.newBlockValue} onChange={this.handleChange} autoComplete="off"/>
                    <div className="input-group input-group-lg">
                        <span className="input-group-addon">
                            <i className="fa fa-chevron-down fa-fw"></i>
                        </span>
                        <select className="form-control" value={this.state.selectedType} onChange={this._selectType}>
                            {this.props.types.map(function(type){
                                return <option value={type.id} key={type.id}>{type.name}</option>
                            })}
                        </select>
                    </div>
                    <input type="submit" value='Create' className="btn-success" onClick={this.createBlock}/>
                </form>

                <GlossaryMenu containerId={page.container_id}/>
            </div>
        );
    }
});

var GlossaryMenu = React.createClass({

    getInitialState: function() {
        return{
            glossaries: [], 
            popUp: false
        }
    },

    showGlossaries: function(){
        this.setState({
            popUp: true
        })
    },

    changeModalState: function(st) {
        this.setState({ popUp: false });
    },

    render: function(){
        var containerId = this.props.containerId;
        return(
            <div>
                <form id="add_new_glossary">
                    <button onClick={this.showGlossaries}>add glossary</button>
                </form>

                <div>
                    {this.state.popUp ? <GlossariesBox containerId={containerId} handleModalState={this.changeModalState} /> : null}
                </div>

            </div>
        );
    }

});

module.exports = Page;
