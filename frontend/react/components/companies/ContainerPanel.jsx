var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Loader = require('../widgets/Loader.jsx');


var ContainerPanel = React.createClass({
    getInitialState: function() {
        return {
            versions: [],
            words: null,
            selectedVersion: '',
            pages: [],
            diffs: []
        };
    },
    
    componentDidMount: function() {
    	this.serverRequest = $.get("/versions/show_all/" + this.props.container.id + ".json", function(result) {
            this.setState({
                versions: result.versions,
                words: result.words
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

    checkVersion: function(version, event) {
        event.preventDefault();
        
        this.setState({ diffs: [] });
       
        $.ajax({
            method: "GET",
            url: "/versions/" + version.id + ".json",
            context: this,
            success: function(data) {
                this.setState({
                    selectedVersion: version,
                    pages: data.pages
                });
            }
        });
    },

    showDiffs: function(pageId, event) {
        event.preventDefault();
        $.ajax({
            method: "GET",
            url: "/versions/diffs/" + this.state.selectedVersion.id + "/" + pageId + ".json",
            context: this,
            success: function(data) {
                this.setState({
                    diffs: data.contents
                });
            }
        });
    },

    createMarkup: function(data) {
        return {__html: data};
    },

    render: function() {
        var that = this;
    	return (
    		<div>
    			<h2>{this.props.container.name}</h2>
                <ul>
                    <li>Auteur : {this.props.author}</li>
                    <li>Date de création : {this.formatDate(this.props.container.created_at)}, {this.formatTime(this.props.container.created_at)}</li>
                    <li>Date de mise à jour : {this.formatDate(this.props.container.updated_at)}, {this.formatTime(this.props.container.updated_at)}</li>
                    <li>Nombre de mots : {this.state.words}</li>
                </ul>

                <h3>Versions :</h3>
                <ul>
                    {this.state.versions.map(function(version) {
                        return(
                            <li key={version.id}>
                                <a href={"/generator/diffs/" + version.id} target="_blank">{that.formatDate(version.created_at)}, {that.formatTime(version.created_at)}</a>
                            </li>
                        );
                    })}
                </ul>
    		</div>
    	);
    }
});

module.exports = ContainerPanel;