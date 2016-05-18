var React = require('react');
var NotificationSystem = require('react-notification-system');
var Modal = require('../widgets/Modal.jsx');
var Loader = require('../widgets/Loader.jsx');

/* File browser's content in the modal */
var FileType = React.createClass({
    getInitialState: function() {
        return {
            filePreview: ''
        };
    },

    handleSelection: function(file, event) {
        event.preventDefault();
        this.props.updateBlockContent(file);
    },

    handleFilePreview: function(file, event) {
        event.preventDefault();
        this.setState({ 
            filePreview: file
        });
    },

    render: function() {
        var that = this;
        return (
            <div>
                <ul>
                    { this.props.files.map(function(file) {
                        return(
                            <li key={file.id}>
                                <a href="#" onClick={that.handleFilePreview.bind(that, file)}>{file.file_file_name}</a>
                            </li>
                        );
                    })}
                </ul>

                <div id="file-browser-preview">
                    { this.state.filePreview != ''
                        ? <object data={this.state.filePreview.url} width="100%" type={this.state.filePreview.file_content_type}><embed src={this.state.filePreview.url} type={this.state.filePreview.file_content_type}/></object>
                        : null
                    }
                    <button onClick={this.handleSelection.bind(this, this.state.filePreview)} className="btn btn-success"><i className="fa fa-check white"></i></button>
                </div>
            </div> 
        )
    }
});


/* File browser in a modal */
var FileBrowser = React.createClass({
    getInitialState: function() {
        return {
            loading: true,
            browserList: [],
            showType: false,
            selectedType: '',
            selectedFiles: [],
            modalState: true
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/uploads.json", function(result){
            this.setState({
                browserList: result.uploads,
                loading: false
            })
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    handleModalState: function(st) {
        console.log(st);
        this.setState({ modalState: st });
        this.props.active(st);
    },

    handleFileType: function(type, name) {
        var t = type.split("/");
        var n = name.split(".")[1];

        if ( t[0] === "application" ) {
            if ( t[1] === "pdf" ) {
                return "pdf";
            } else if ( (t[1] === "force-download") && (n === "mp4") ) {
                return "video";
            } else {
                return "application";
            }
        } else if ( t[0] === "audio" ) {
            return "audio";
        } else if ( t[0] === "video" || ((t[1] === "force-download") && (n === "mp4")) ) {
            return "video";
        } else {
            return "misc";
        }
    },

    handleTypeClick: function(type, files) {
        this.setState({ 
            showType: true,
            selectedType: type,
            selectedFiles: files
        });
    },

    handleBlockUpdate: function(data) {
        this.props.updateBlock(data);
        this.props.active(false);
    },

    render: function() {
        var that = this;

        var pdfs = [],
            videos = [],
            audios = [],
            miscs = [];

        this.state.browserList.map(function(file) {
            var type = that.handleFileType(file.file_content_type, file.file_file_name);

            if (type === "pdf") {
                pdfs.push(file);
            } else if (type === "video") {
                videos.push(file);
            } else if (type === "audio") {
                audios.push(file);
            } else {
                miscs.push(file);
            }
        });

        return (
            <Modal active={this.handleModalState} title={"My files"}>
                { this.state.loading 
                    ? <Loader />
                    : null
                }

                { pdfs.length > 0 ? <div className="file-type" onClick={this.handleTypeClick.bind(this, "PDF", pdfs)}><i className="fa fa-file-pdf-o fa-fw pdfs"></i></div> : null }

                { videos.length > 0 ? <div className="file-type" onClick={this.handleTypeClick.bind(this, "video", videos)}><i className="fa fa-video-camera fa-fw videos"></i></div> : null }

                { audios.length > 0 ? <div className="file-type" onClick={this.handleTypeClick.bind(this, "audio", audios)}><i className="fa fa-music fa-fw audios"></i></div> : null }

                { miscs.length > 0 ? <div className="file-type" onClick={this.handleTypeClick.bind(this, "other", miscs)}><i className="fa fa-random fa-fw miscs"></i></div> : null }

                <div id="files-zone">
                    { this.state.showType
                        ? <div>
                            <h3>My {this.state.selectedType} files</h3>
                            <FileType files={this.state.selectedFiles} updateBlockContent={this.handleBlockUpdate} /> 
                        </div>
                        : null
                    }
                </div>
            </Modal>
        );
    }
});


var MediaBlock = React.createClass({
	getInitialState: function() {
        return {
            blockName: '',
            blockContent: '',
            browserList: [],
            modalState: false,
            changeName: false
        };
    },

    componentDidMount: function() {
        this.setState({ 
            blockName: this.props.block.name,
            blockContent: this.props.block.content
        });
        
    },

    componentWillUnmount: function() {
         $.ajax({
            url: "/blocks/"+this.props.block.id,
            type: "PUT",
            context: this,
            data: {
                name: this.state.blockName,
                content: this.state.blockContent
            }
        });  
    },

    submitMedia: function(event) {
        event.preventDefault();

        this.setState({ blockContent: '<i class="fa fa-spinner fa-pulse loader"></i>' });

        var fileName = $(this.refs.mediaFile.files[0])[0].name;
        var fileExt = fileName.split(".").slice(-1)[0];

        var formData = new FormData();
        formData.append("tempfile", $(this.refs.mediaFile.files[0])[0]);
        formData.append("block_id", this.props.block.id);

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
                var content = this.makeHtmlContent(data, fileExt);

                $.ajax({
                    url: "/blocks/set_content/" + this.props.block.id,
                    type: "PUT",
                    data: { content: content, upload_id: data.id }
                });

                this.setState({ blockContent: content });
            }
        });
    },

    makeHtmlContent: function(data,type) {
        if (type == "mp4") {
            return '<video width="100%" controls>\n\t<source src="'+data.url+'" type="video\/mp4">\n</video>';
        } else if (type == "mp3"|| type == "mpeg") {
            return "<audio controls>\n\t<source src='"+data.url+"' type='audio/mpeg'>\n</audio>";
        } else {
            return type;
        }
    },

    handleBrowseFiles: function() {
        this.setState({ modalState: true });
    },

    handleModalState: function(st) {
        this.setState({ modalState: st });
    },

    handleBlockChange: function(data) {
        var fileExt = data.file_file_name.split(".").slice(-1)[0];
        var content = this.makeHtmlContent(data, fileExt);
        console.log(content);

        $.ajax({
            url: "/blocks/update_upload",
            type: "PUT",
            context: this,
            data: {
                id: this.props.block.id,
                name: this.state.blockName,
                content: content,
                upload_id: data.id,
            },
            success: function(data) {
                this.setState({ blockContent: content });
            }
        });
    },

    handleBlockName: function(event) {
        this.setState({
            blockName: event.target.value,
            changeName: true
        });
    },

    saveBlockName: function() {
        $.ajax({
            url: "/blocks/"+this.props.block.id,
            type: "PUT",
            context: this,
            data: {
                name: this.state.blockName,
                content: this.state.blockContent
            },
            success: function(data) {
                this.setState({ 
                    changeName: false,
                    blockName: data.name
                });
            }
        });
    },

    dynamicId: function(id){
        return "media_block_" + id;
    },

    createMarkup: function(data) {
        return {__html: data};
    },

	render: function() {
		var block = this.props.block;
		return (
            <div className="block-inner">
                <div className="content" key={block.id}>
                    <div className="block-title">
                        <i className="fa fa-file-text"></i>
                        <h3>
                            <input ref="mediablockname" type="text" value={this.state.blockName ? this.state.blockName : ''} placeholder="Block name..." onChange={this.handleBlockName}/>
                            { this.state.changeName ? <button onClick={this.saveBlockName}><i className="fa fa-check"></i></button> : null }
                        </h3>
                    </div>

                    <div className="block-content">
                        <form className="dropzone new_upload" id="new_upload" ref="mediaForm" encType="multipart/form-data" onChange={this.submitMedia} action="/uploads" method="post">
                            <br/>Select some files and <br/>
                            <input className="uploader" name="upload[file]" ref="mediaFile" id="upload_file" type="file" />
                        </form>

                    <div className="block-content" id={this.dynamicId(block.id)} dangerouslySetInnerHTML={this.createMarkup(this.state.blockContent)} />

                        <div className="browseFiles" onClick={this.handleBrowseFiles}>
                            <i className="fa fa-folder-open"></i><br/>
                            Browse files
                        </div>
                        { this.state.modalState ? <FileBrowser active={this.handleModalState} block={block.id} updateBlock={this.handleBlockChange} /> : null }
                    </div>
                    
                    <div className="block-content border" ref="mediaResult" id={this.dynamicId(block.id)} dangerouslySetInnerHTML={this.createMarkup(this.state.blockContent)} />

                </div>
                <NotificationSystem ref="notificationSystem"/>
            </div>
        );
	}
});

module.exports = MediaBlock;