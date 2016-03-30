var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';

var Containers = React.createClass({
    getInitialState: function() {
        return {
            containersList: []
        };
    },
  
    componentDidMount: function() {
        this.serverRequest = $.get("/containers.json", function (result) {
            this.setState({
                containersList: result
            });
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

render: function() {
    var results = this.state.containersList;
    return (
        <div className="containers">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="page-header">Dashboard</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <ul className="nav" id="side-menu">
                        {results.map(function(result){
                            return (
                                <li key={result.id}>

                                    <Link to={"/containers/"+result.id}>
                                         <i className="fa fa-file-o"></i>
                                         {result.name}
                                    </Link>
                                    <br/>
                                </li>

                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}
});

module.exports = Containers;