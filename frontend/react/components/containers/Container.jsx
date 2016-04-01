var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Menu = require('./Menu.jsx');

var Container = React.createClass({
	getInitialState: function() {
        return {
            container: "",
            pages: []
        };
    },
  
    componentDidMount: function() {
        this.serverRequest = $.get("/containers/"+this.props.params.id+".json", function (result) {
            this.setState({
                container: result.container,
                pages: result.pages
            });
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    render: function() {
        var container = this.state.container;
        var pages = this.state.pages;
        return (
        	<div className="containers">
                <div className="row">
                    <div className="col-lg-12">
                  	     <div className="tags">
                            <div className="tag tagWidth" key={container.id}>
                                <div className="triangle">
                                </div>
                                <div className="contenu">
                                    <div className="img">
                                        <i className="fa fa-folder-open-o"></i>
                                    </div>
                                    <div className="elem">
                                        <div className="name">
                                            {container.id}
                                        </div>
                                        <div className="option">
                                            {container.name} - {container.content}
                                        </div>
                                    </div>
                                </div>
                            </div> 
                  	     </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <Menu className="menu" items={pages}>
                            
                        </Menu>
                     </div>
                </div>
    	    </div>
        );
    }
});

module.exports = Container;