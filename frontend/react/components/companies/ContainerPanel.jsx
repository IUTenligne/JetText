var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Loader = require('../widgets/Loader.jsx');


var ContainerPanel = React.createClass({
    getInitialState: function() {
        return {
            versions: [],
            overviewedVersion: [],
            overviewedLatest: []
        };
    },
    
    componentDidMount: function() {
    	this.serverRequest = $.get("/versions/show_all/" + this.props.container.id + ".json", function(result) {
            this.setState({
                versions: result.versions
            });
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    formatDate: function(datestr) {
        return datestr.split("T")[0].split("-").reverse().join("/");
    },

    formatTime: function(timestr) {
        return timestr.split("T")[1].split(".")[0];
    },

    checkVersion: function(id, event) {
        event.preventDefault();
        $.ajax({
            method: "GET",
            url: "/versions/" + id + ".json",
            context: this,
            success: function(data) {
                this.setState({
                    overviewedVersion: data.version_blocks,
                    overviewedLatest: data.latest_blocks
                });
            }
        });
    },

    render: function() {
        var that = this;
        console.log(this.state.overviewed);
    	return (
    		<div>
    			<h2>{this.props.container.name}</h2>
                <ul>
                    <li>Auteur : {this.props.author}</li>
                    <li>Date de création : {this.formatDate(this.props.container.created_at)}, {this.formatTime(this.props.container.created_at)}</li>
                    <li>Date de mise à jour : {this.formatDate(this.props.container.updated_at)}, {this.formatTime(this.props.container.updated_at)}</li>
                </ul>

                <h3>Versions :</h3>
                <ul>
                    {this.state.versions.map(function(version) {
                        return(
                            <li key={version.id}>
                                <a href="#" onClick={that.checkVersion.bind(that, version.id)}>{that.formatDate(version.created_at)}, {that.formatTime(version.created_at)}</a>
                            </li>
                        );
                    })}
                </ul>

                <div className="versions-overview">
                    {this.state.overviewedVersion != []
                        ? <div>
                            {this.state.overviewedVersion.map(function(block) {
                                return (<div key={block.id}>{block.content}</div>);
                            })}
                            </div>
                        : null
                    }

                    {this.state.overviewedLatest != []
                        ? <div>
                            {this.state.overviewedLatest.map(function(block) {
                                return (<div key={block.id}>{block.content}</div>);
                            })}
                            </div>
                        : null
                    }
                </div>
    		</div>
    	);
    }
});

module.exports = ContainerPanel;