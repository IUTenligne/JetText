var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Loader = require('../widgets/Loader.jsx');
var Modal = require('../widgets/Modal.jsx');
var NotificationSystem = require('react-notification-system');


var FileInfo = React.createClass({
    getInitialState: function() {
        return {
        };
    },
    
    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },

    handleInfosModalState: function(st) {
        this.setState({ infos: st });
    },

    _notificationSystem: null, 

    render: function() {
        var file = this.props.file;

        return(
            <tr className="file">
                <td>
                    {file.file_file_name}
                </td>
                <td>
                    {file.file_content_type}
                </td>
                <td>
                    {file.type}
                </td>
                <td>
                    <NotificationSystem ref="notificationSystem"/>
                </td>
            </tr> 
        );
    }
});


var UsersFiles = React.createClass({
    getInitialState: function() {
        return {
            files: [],
            icon: '',
            loading: true
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/uploads.json", function(result) {
            this.setState({
                files: result.uploads,
                loading: false
            });
        }.bind(this));
        this._notificationSystem = this.refs.notificationSystem;
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    sort: function(list, elem) {
        if ((this.state.icon === "down") || (this.state.icon === ""))
            this.setState({ icon: "up" });
        else
            this.setState({ icon: "down" });

        this.setState({
            files: list.sort().reverse(),
            sorter: elem
        });
    },

    _notificationSystem: null,

    render: function() {
        var that = this;

        return (
            <article className="admin-panel">

                <ul className="align">
                    { this.state.loading
                        ? <Loader />
                        : null
                    }  

                    <h2>Fichiers :</h2>

                    <table>
                        <thead>
                            <tr>
                                <th onClick={this.sort.bind(this, this.state.files, "validated")}>
                                    Fichier {this.state.sorter === "validated" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.files, "validated")}>
                                    Type {this.state.sorter === "validated" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.state.files.map(function(result){
                                return (
                                    <FileInfo 
                                        file={result}
                                        key={result.id}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </ul>
            </article>
        );
    }
});

module.exports = UsersFiles;