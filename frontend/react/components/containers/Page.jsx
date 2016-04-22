var React = require('react');
var ErrorsHandler = require('../general/ErrorsHandler.jsx');
import { Router, Route, Link, hashHistory } from 'react-router';
var Block = require('../blocks/Block.jsx');

var Page = React.createClass({
    mixins: [ErrorHandling],

    getInitialState: function() {
        return {
            status: 0,
            page: '',
            blocks: [],
            newBlockValue: '',
            types: [],
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

        this.serverRequest = $.get("/types.json", function (result) {
            this.setState({
                types: result.types
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
        { ErrorHandling.checkStatus(this.state.status) }
        return (
            <div className="page">
                <h2 className="header_page">{page.name}</h2>

                <div className="blocks">
                    {this.state.blocks.map(function(block){
                        return <Block key={block.id} item={block} removeBlock={that.handleBlockDeletion} />
                    })}
                </div>

                <form id="add_new_block">
                    <input type="text" id="new_block" className="form-control" value={this.state.newBlockValue} onChange={this.handleChange} autoComplete="off"/>
                    <div className="input-group input-group-lg">
                        <span className="input-group-addon">
                            <i className="fa fa-chevron-down fa-fw"></i>
                        </span>
                        <select className="form-control" value={this.state.selectedType} onChange={this._selectType}>
                            {this.state.types.map(function(type){
                                return <option value={type.id} key={type.id}>{type.name}</option>
                            })}
                        </select>
                    </div>
                    <input type="submit" value='Create' className="btn-success" onClick={this.createBlock}/>
                </form>
            </div>
        );
    }
});

module.exports = Page;