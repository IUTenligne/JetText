var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Loader = require('../widgets/Loader.jsx');
var Modal = require('../widgets/Modal.jsx');
var NotificationSystem = require('react-notification-system');


var FileInfo = React.createClass({
    getInitialState: function() {
        return {
            overview: false,
            modalPreview: false
        };
    },
    
    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },

    handleInfosModalState: function(st) {
        this.setState({ infos: st });
    },

    handleFileWrapper: function() {
        if (this.props.file.filetype === "image") {
            return { __html: '<img src="'+ this.props.file.url +'" height="28">' };
        } else if (this.props.file.filetype === "audio") {
            return { __html: '<i class="fa fa-music"></i>' };
        } else if (this.props.file.filetype === "video") {
            return { __html: '<i class="fa fa-camera"></i>' };
        } else if (this.props.file.filetype === "pdf") {
            return { __html: '<i class="fa fa-file-pdf-o"></i>' };
        }
    },

    handleFilePreview: function() {
        if (this.props.file.filetype === "image") {
            if (this.props.file.file_content_type.split("/")[1] === "svg+xml")
                return { __html: '<object data="'+ this.props.file.url +'" type="image/svg+xml">\n\t<img src="'+ this.props.file.url +'" height="28">\n</object>' };
            else
                return { __html: '<img src="'+ this.props.file.url +'" "style="max-height: 400px">' };
        } else if (this.props.file.filetype === "audio") {
            return { __html: '<audio controls>\n\t<source src="'+ this.props.file.url +'" type="'+ this.props.file.file_content_type +'">\n</audio>' };
        } else if (this.props.file.filetype === "video") {
            return { __html: '<video controls style="max-width:100%">\n\t<source src="'+ this.props.file.url +'" type="'+ this.props.file.file_content_type +'">\n</video>' };
        } else if (this.props.file.filetype === "pdf") {
           return { __html: '<object data="'+ this.props.file.url +'" width="100%" height="300px" type="application/pdf">\n\t<embed src="'+ this.props.file.url +'" type="application/pdf"/>\n</object>' };
        }
    },

    toggleOverview: function(st) {
        this.setState({ overview: st });
    },

    showPreview: function(st) {
        this.setState({ modalPreview: !this.state.modalPreview });
    },

    _notificationSystem: null, 

    render: function() {
        var file = this.props.file;

        return(
            <tr className="file">
                <td className="file-overview">
                    <div dangerouslySetInnerHTML={this.handleFileWrapper()} /> 
                </td>
                <td className="file-name" onClick={this.showPreview.bind(this, true)} >
                    {file.file_file_name}
                </td>
                <td>
                    {file.filetype}
                </td>
                <td>
                    {file.file_updated_at.split("T")[0].split("-").reverse().join("/")}
                </td>
                <td>
                    <NotificationSystem ref="notificationSystem"/>
                    { this.state.modalPreview
                        ? <Modal active={this.showPreview} mystyle={""} title={"Aperçu " + file.file_file_name}>
                                <div className="modal-in">
                                    <center>
                                        <div dangerouslySetInnerHTML={this.handleFilePreview()} />
                                    </center>
                                </div>
                            </Modal>
                        : null
                    }
                </td>
            </tr> 
        );
    }
});


var UsersFiles = React.createClass({
    getInitialState: function() {
        return {
            files: [],
            filter: false,
            filteredFiles: [],
            types: [],
            icon: '',
            sorter: '',
            loading: true
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/uploads.json", function(result) {
            this.setState({
                files: result.uploads,
                types: result.types,
                loading: false
            });
        }.bind(this));
        this._notificationSystem = this.refs.notificationSystem;
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    sort: function(attribute) {
        this.setState({ sorter: attribute });

        if (this.state.filter === false)
            var fileList = this.state.files;
        else
            var fileList = this.state.filteredFiles;

        if ((this.state.icon === "desc") || (this.state.icon === "")) {
            this.setState({ icon: "asc" });
            var files = fileList.sort(function(a, b) {
                if (attribute === "file_file_name")
                    return a.file_file_name < b.file_file_name;
                if (attribute === "filetype")
                    return a.filetype < b.filetype;
                if (attribute === "date")
                    return a.date < b.date;
            });
        } else {
            this.setState({ icon: "desc" });
            var files = fileList.sort(function(a, b) {
                if (attribute === "file_file_name")
                    return a.file_file_name > b.file_file_name;
                if (attribute === "filetype")
                    return a.filetype > b.filetype;
                if (attribute === "date")
                    return a.date > b.date;
            });
        }

        if (this.state.filter === false)
            this.setState({ files: files, loading: false });
        else
            this.setState({ filteredFiles: files, loading: false });
    },

    filterByType: function(type) {
        this.setState({ 
            loading: true,
            filter: !this.state.filter
        });

        if (!this.state.filter === true) {
            var files = this.state.files.filter((i, _) => i["filetype"] === type);

            this.setState({
                filteredFiles: files,
                loading: false
            });
        } else {
            this.setState({
                loading: false
            });
        }
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

                    <div className="filters-bar">
                        { this.state.types.map(function(type, index){
                            return( <button key={index} className="filter" onClick={that.filterByType.bind(that, type.filetype)}>{type.filetype}</button> );
                        })}
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th onClick={this.sort.bind(this, "file_file_name")} width="auto" />
                                <th onClick={this.sort.bind(this, "file_file_name")} width="50%">
                                    Nom {this.state.sorter === "file_file_name" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, "filetype")} width="20%">
                                    Type {this.state.sorter === "filetype" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                                <th onClick={this.sort.bind(this, "file_updated_at")} width="20%">
                                    Date {this.state.sorter === "file_updated_at" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.state.filter
                                ? this.state.filteredFiles.map(function(result){
                                    return (
                                        <FileInfo 
                                            file={result}
                                            key={result.id}
                                        />
                                    );
                                })
                                : this.state.files.map(function(result){
                                    return (
                                        <FileInfo 
                                            file={result}
                                            key={result.id}
                                        />
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </ul>
            </article>
        );
    }
});

module.exports = UsersFiles;