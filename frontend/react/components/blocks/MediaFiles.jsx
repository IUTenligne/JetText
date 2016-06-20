var React = require('react');
var Loader = require('../widgets/Loader.jsx');
var Modal = require('../widgets/Modal.jsx');


var MediaInfo = React.createClass({
    getInitialState: function() {
        return {
            overview: false,
            preview: false,
            selectedFile: ''
        };
    },
    
    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },

    handleInfosModalState: function(st) {
        this.setState({ infos: st });
    },

    handleFilePreview: function() {
        this.setState({ preview: true });

        if (this.props.file.filetype === "image") {
            if (this.props.file.file_content_type.split("/")[1] === "svg+xml")
                var item = '<object data="'+ this.props.file.url +'" type="image/svg+xml" style="min-width:600px">\n\t<img src="'+ this.props.file.url +'">\n</object>';
            else
                var item = '<img src="'+ this.props.file.url +'">';
        } else if (this.props.file.filetype === "audio") {
            var item = '<audio controls>\n\t<source src="'+ this.props.file.url +'" type="'+ this.props.file.file_content_type +'">\n</audio>';
        } else if (this.props.file.filetype === "video") {
            var item = '<video controls style="max-width:100%">\n\t<source src="'+ this.props.file.url +'" type="'+ this.props.file.file_content_type +'">\n</video>';
        } else if (this.props.file.filetype === "pdf") {
           var item = '<object data="'+ this.props.file.url +'" width="100%" height="300px" type="application/pdf">\n\t<embed src="'+ this.props.file.url +'" type="application/pdf"/>\n</object>';
        }
        
        this.props.preview(true, item, this.props.file);
    },

    toggleOverview: function(st) {
        this.setState({ overview: st });
    },

    render: function() {
        var file = this.props.file;

        return(
            <tr className="file">
                <td>
                    {this.props.index}
                </td>
                <td className="file-name" onClick={this.handleFilePreview} >
                    {file.file_file_name}
                </td>
                <td>
                    {file.filetype}
                </td>
                <td>
                    {file.file_updated_at.split("T")[0].split("-").reverse().join("/")}
                </td>
            </tr> 
        );
    }
});


var MediaFiles = React.createClass({
    getInitialState: function() {
        return {
            modal: true,
            files: [],
            filter: false,
            filterSearch: false,
            filteredFiles: [],
            activeFilter: '',
            types: [],
            icon: '',
            sorter: '',
            searchedString: '',
            preview: '',
            previewedFile: null,
            selectedFile: null,
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

    handlePreview: function(st, file, fileObject) {
        this.setState({ 
            preview: st,
            previewedFile: file,
            selectedFile: fileObject
        });
    },

    closeModal: function(st) {
        this.setState({ modal: !this.state.modal });
        this.props.active(false);
    },

    handleUpdate: function() {
        this.props.updateBlock(this.state.selectedFile);
    },

    render: function() {
        var that = this;

        return (
            <Modal active={this.closeModal} mystyle={"media"} title={"Mes fichiers"}>
                <div className="filters-bar">
                    <span className="input-group-addon">
                        <i className="fa fa-search fa-fw"></i>
                    </span>
                    <input type="text" placeholder="Rechercher..." className="form-control" onChange={this.searchByString} /><br/>
                    { this.state.types.map(function(type, index){
                        return( 
                            that.state.activeFilter === type.filetype 
                            ? <span key={index} className="active-filter">
                                <button key={index} className={"active-filter filter-file filter-" + type.filetype} onClick={that.filterByType.bind(that, type.filetype)}>
                                    <i className={"file-" + type.filetype}></i>
                                </button> 
                            </span>
                            : 
                            <button key={index} className={"filter-file filter-" + type.filetype} onClick={that.filterByType.bind(that, type.filetype)}>
                                <i className={"file-" + type.filetype}></i>
                            </button> 
                        );
                    })}
                </div>
                <article id="media-panel"> 
                        
                    { this.state.loading
                        ? <Loader />
                        : <div id="media-browser">
                            <div id="media-table">
                                <table id="media-files">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th onClick={this.sort.bind(this, "file_file_name")}>
                                                Nom {this.state.sorter === "file_file_name" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                            </th>
                                            <th onClick={this.sort.bind(this, "filetype")}>
                                                Type {this.state.sorter === "filetype" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                            </th>
                                            <th onClick={this.sort.bind(this, "file_updated_at")}>
                                                Date {this.state.sorter === "file_updated_at" ? <i className={"fa fa-sort-"+this.state.icon}></i> : null}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.state.filter || this.state.filterSearch
                                            ? this.state.filteredFiles.map(function(result, index){
                                                return (
                                                    <MediaInfo
                                                        key={result.id} 
                                                        file={result}
                                                        index={index+1}
                                                        preview={that.handlePreview}
                                                    />
                                                );
                                            })
                                            : this.state.files.map(function(result, index){
                                                return (
                                                    <MediaInfo 
                                                        key={result.id}
                                                        file={result}
                                                        index={index+1}
                                                        preview={that.handlePreview}
                                                    />
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div id="media-files-preview">
                                { this.state.preview 
                                    ? <div>
                                        <div id="previewed-file" dangerouslySetInnerHTML={{__html: this.state.previewedFile}} /> 
                                        <button id="previewed-btn" className="btn btn-lg" onClick={this.handleUpdate}>
                                            Ok <i className="fa fa-check"></i>
                                        </button>
                                    </div>
                                    : null 
                                }
                            </div>
                        </div>
                    }

                </article>
            </Modal>
        );
    }
});


module.exports = MediaFiles;