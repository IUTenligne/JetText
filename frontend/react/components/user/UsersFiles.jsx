var React = require('react');
import { Router, Route, Link, hashHistory } from 'react-router';
var Loader = require('../widgets/Loader.jsx');
var Modal = require('../widgets/Modal.jsx');
var NotificationSystem = require('react-notification-system');


var FileInfo = React.createClass({
    getInitialState: function() {
        return {
            overview: false,
            modalPreview: false,
            errors: false,
            errorMessage: ''
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
            return { __html: '<img src="'+ this.props.file.url +'" height="24">' };
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
                return { __html: '<object data="'+ this.props.file.url +'" type="image/svg+xml">\n\t<img src="'+ this.props.file.url +'">\n</object>' };
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

    deleteFile: function() {
        $.ajax({
            type: "DELETE",
            url: "/uploads/" + this.props.file.id,
            context: this,
            success: function(data) {
                if (data.status === "success") {
                    this.setState({ modalPreview: false });
                    this.showPreview(false);
                    this.props.delete(this.props.file.id)
                } else {
                    this.setState({
                        errors: true,
                        errorMessage: "Ce fichier est employé dans des blocs de contenu."
                    });
                }
            }
        })
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
                        ? <Modal active={this.showPreview} mystyle={"media"} title={"Aperçu " + file.file_file_name}>
                                <div className="modal-in">
                                    <center>
                                        <div dangerouslySetInnerHTML={this.handleFilePreview()} />
                                    </center>

                                    <button onClick={this.deleteFile}><i className="fa fa-trash"></i> Supprimer</button>

                                    { this.state.errors
                                        ? <div className="error-msg">{ this.state.errorMessage }</div>
                                        : null
                                    }
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
            filterSearch: false,
            filteredFiles: [],
            activeFilter: '',
            types: [],
            icon: '',
            sorter: '',
            searchedString: '',
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

    submitMedia: function(event) {
        event.preventDefault();
        this.setState({ loading: true });

        var fileName = $(this.refs.mediaFile.files[0])[0].name;
        /* lowercase the ext to stick to the upload backend model */
        var fileExt = fileName.split(".").slice(-1)[0].toLowerCase();
        var formData = new FormData();
        formData.append("tempfile", $(this.refs.mediaFile.files[0])[0]);

        /* Ajax file upload handled by uploads_controller.rb & model upload.rb */
        $.ajax({
            url: "/uploads",
            type: "POST",
            contentType: false,
            cache: false,
            processData: false,
            data: formData,
            context: this,
            success: function(data) {
                this.setState({
                    files: this.state.files.concat([data]),
                    filter: false,
                    loading: false
                });
            }
        });
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
                if (attribute === "file_updated_at")
                    return a.file_updated_at < b.file_updated_at;
            });
        } else {
            this.setState({ icon: "desc" });
            var files = fileList.sort(function(a, b) {
                if (attribute === "file_file_name")
                    return a.file_file_name > b.file_file_name;
                if (attribute === "filetype")
                    return a.filetype > b.filetype;
                if (attribute === "file_updated_at") {
                    return a.file_updated_at > b.file_updated_at;
                }
            });
        }

        if (this.state.filter === false)
            this.setState({ files: files, loading: false });
        else
            this.setState({ filteredFiles: files, loading: false });
    },

    filterByType: function(type) {
        this.setState({ loading: true });

        if (this.state.activeFilter === type) {
            /* case when the user selects the already active type filter */
            if (this.state.filterSearch === true) {
                /* if any searchedString is on */
                this.setState({
                    filteredFiles: this.state.files.filter( i => i["file_file_name"].indexOf(this.state.searchedString) > -1 ),
                    loading: false,
                    filterSearch: true,
                    activeFilter: ''
                });
            } else {
                /* if not, consider the user removes the type filter - set the files[] to the default state */
                this.setState({
                    filteredFiles: this.state.files,
                    loading: false,
                    filter: false,
                    filterSearch: false,
                    activeFilter: ''
                });
            }
        } else {
            /* case when the user selects a new type filter */
            if (this.state.filterSearch === true) {
                /* if any searchedString is on */
                var files = this.state.files.filter( i => (i["filetype"] === type) && (i["file_file_name"].indexOf(this.state.searchedString) > -1) );
            } else {
                /* otherwise */
                var files = this.state.files.filter( i => i["filetype"] === type );
            }

            this.setState({
                filteredFiles: files,
                activeFilter: type,
                loading: false,
                filter: true
            });
        }
    },

    searchByString: function(event) {
        if (event.target.value.length > 0) {
            if (this.state.activeFilter != '') {
                /* case when the user hasn't selected any type filter */
                var filterType = this.state.activeFilter;
                this.setState({
                    filterSearch: true,
                    searchedString: event.target.value,
                    filteredFiles: this.state.files.filter( i => (i["file_file_name"].indexOf(event.target.value) > -1) && (i["filetype"] === filterType) )
                });
            } else {
                /* case when the user has already selected a type filter */
                this.setState({
                    filterSearch: true,
                    searchedString: event.target.value,
                    filteredFiles: this.state.files.filter( i => i["file_file_name"].indexOf(event.target.value) > -1 )
                });
            }
        } else {
            /* case when the searchedString is empty */
            this.setState({
                searchedString: '',
                filter: false,
                activeFilter: '',
                filteredFiles: this.state.files
            });
        }
    },

    deleteFile: function(file_id) {
        this.setState({
            files: this.state.files.filter((i,_) => i["id"] != file_id),
            filteredFiles: this.state.filteredFiles.filter((i,_) => i["id"] != file_id)
        })
    },

    _notificationSystem: null,

    render: function() {
        var that = this;

        return (
            <article className="admin-panel">

                <div className="dropzone-user" id="new_upload" ref="mediaForm" encType="multipart/form-data" onChange={this.submitMedia} action="/uploads" method="post">
                    <div className="viewDropzonebis">
                       <div className="textDropzone">
                            <i className="fa fa-file-text"></i>
                            <br/>
                            Déposer un fichier
                         </div>
                    </div>
                    <div className="zoneDropzone">
                        <input className="uploader" name="upload[file]" ref="mediaFile" id="upload_file" type="file" ></input>
                    </div>
                </div>

                <ul className="align">
                    <h2>Fichiers :</h2>

                    <div className="filters-bar">
                        <input type="text" placeholder="Rechercher..." onChange={this.searchByString} />
                        { this.state.types.map(function(type, index){
                            return(
                                that.state.activeFilter === type.filetype
                                ? <span key={index} className="active-filter">
                                    <button key={index} className={"active-filter filter-file filter-" + type.filetype} onClick={that.filterByType.bind(that, type.filetype)}>
                                        <i className={"file-" + type.filetype}></i>
                                    </button>
                                </span>
                                : <button key={index} className={"filter-file filter-" + type.filetype} onClick={that.filterByType.bind(that, type.filetype)}>
                                    <i className={"file-" + type.filetype}></i>
                                </button>
                            );
                        })}
                    </div>

                    { this.state.loading
                        ? <Loader />
                        : <table id="user-files">
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
                                { this.state.filter || this.state.filterSearch
                                    ? this.state.filteredFiles.map(function(result){
                                        return (
                                            <FileInfo
                                                key={result.id}
                                                file={result}
                                                delete={that.deleteFile}
                                            />
                                        );
                                    })
                                    : this.state.files.map(function(result){
                                        return (
                                            <FileInfo
                                                key={result.id}
                                                file={result}
                                                delete={that.deleteFile}
                                            />
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    }
                </ul>
            </article>
        );
    }
});

module.exports = UsersFiles;
