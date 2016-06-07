var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Loader = require('../widgets/Loader.jsx');
var Modal = require('../widgets/Modal.jsx');
var NotificationSystem = require('react-notification-system');


var UserInfo = React.createClass({
    getInitialState: function() {
        return {
            unlock: true
        };
    },
    
    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },

    handleModalState: function(st) {
        this.setState({ overview: st });
    },

    handleInfosModalState: function(st) {
        this.setState({ infos: st });
    },

    validateUser: function() {
        $.ajax({
            type: "PUT",
            url: "/users/validate/" + this.props.user.id,
            context: this,
            success: function(data){
                this.props.updateUsersStatus(data.usersdata);
            }
        });
    },

    unlock: function() {
        this.setState({
            unlock: !this.state.unlock
        })
    },

    changeRole: function(event) {
        $.ajax({
            type: "PUT",
            url: "/users/update_role/" + this.props.user.id,
            context: this,
            data: {
                role_id: event.target.value
            },
            success: function(data){
                this.props.updateUsersStatus(data.usersdata);
                this.setState({
                    unlock: true
                })
            }
        });
    },  

    _notificationSystem: null, 

    render: function() {
        var user = this.props.user;

        return(
            <tr className="user">
                <td>
                    {user.firstname} {user.lastname}
                </td>
                <td>
                    {user.email}
                </td>
                <td>
                    {user.created_at ? user.created_at.split("T")[0].split("-").reverse().join("/") : null}
                </td>
                <td>
                    {user.role.role}
                </td>
                <td>
                    <button onClick={this.validateUser}><i className="fa fa-check"></i></button>
                </td>
                <td>
                    <a href="javascript:;" onClick={this.unlock}>
                        <i className={this.state.unlock ? "fa fa-lock" : "fa fa-unlock"}></i>
                    </a>
                    <select value="0" onChange={this.changeRole} disabled={this.state.unlock}>
                        <option disabled="true" value="0">-- rôle --</option>
                        { this.props.roles.map(function(role){
                            return (<option key={role.id} value={role.id}>{role.role}</option>);
                        })}
                    </select>
                </td>
                <td>
                    <NotificationSystem ref="notificationSystem"/>
                </td>
            </tr> 
        );
    }
});


var UsersPanel = React.createClass({
    getInitialState: function() {
        return {
            users: [],
            roles: [],
            validatedUsersList: [],
            pendingUsersList: [],
            sorter: '',
            icon: '',
            loading: true
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/users.json", function(result) {
            this.setState({
                users: result.users,
                roles: result.roles,
                validatedUsersList: result.validated_users,
                pendingUsersList: result.pending_users,
                loading: false
            });
        }.bind(this));
        this._notificationSystem = this.refs.notificationSystem;
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    handleModalState: function(st) {
        this.setState({ viewCreate: false });
    },

    sort: function(list, elem) {
        if ((this.state.icon === "down") || (this.state.icon === ""))
            this.setState({ icon: "up" });
        else
            this.setState({ icon: "down" });

        this.setState({
            containersList: list.sort().reverse(),
            sorter: elem
        });
    },

    updateUsersList: function(users) {
        this.setState({
            users: users.users,
            validatedUsersList: users.validated_users,
            pendingUsersList: users.pending_users
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

                    <h2>Utilisateurs authorisés :</h2>

                    <table>
                        <thead>
                            <tr>
                                <th onClick={this.sort.bind(this, this.state.validatedUsersList, "validated")}>
                                    Utilisateur {this.state.sorter === "validated" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.validatedUsersList, "validatedEmail")}>
                                    Email {this.state.sorter === "validatedEmail" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.validatedUsersList, "validatedCreation")}>
                                    Inscription {this.state.sorter === "validatedCreation" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.validatedUsersList, "validatedRole")}>
                                    Rôle {this.state.sorter === "validatedRole" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th>
                                    Bloquer
                                </th>
                                <th>
                                    Attributer rôle
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.state.validatedUsersList.map(function(result){
                                return (
                                    <UserInfo 
                                        user={result}
                                        roles={that.state.roles}
                                        key={result.id}
                                        updateUsersStatus={that.updateUsersList} 
                                    />
                                );
                            })}
                        </tbody>
                    </table>

                    <h2>Utilisateurs en attente de validation :</h2>

                    <table>
                        <thead>
                            <tr>
                                <th onClick={this.sort.bind(this, this.state.pendingUsersList, "pending")}>
                                    Utilisateur {this.state.sorter === "pending" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.pendingUsersList, "pendingEmail")}>
                                    Email {this.state.sorter === "pendingEmail" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.pendingUsersList, "pendingCreation")}>
                                    Inscription {this.state.sorter === "pendingCreation" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, this.state.pendingUsersList, "pendingRole")}>
                                    Rôle {this.state.sorter === "pendingRole" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th>
                                    Valider
                                </th>
                                <th>
                                    Attributer rôle
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.state.pendingUsersList.map(function(result){
                                return (
                                    <UserInfo 
                                        user={result} 
                                        roles={that.state.roles}
                                        key={result.id}
                                        updateUsersStatus={that.updateUsersList} 
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

module.exports = UsersPanel;