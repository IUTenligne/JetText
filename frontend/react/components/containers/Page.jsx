var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Block = require('../blocks/Block.jsx');

var Page = React.createClass({
    getInitialState: function() {
        return {
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

    _selectType: function(event) {
        this.setState({ selectedType: event.target.value });
    },

    render: function() {
        var page = this.state.page;
        return (
            <div className="page">
            
                <h2 className="header_page">{page.name}</h2>
                
                {this.state.blocks.map(function(block){
                    return <Block key={block.id} item={block} />
                })}

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