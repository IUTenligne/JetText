var React = require('react');
var Constants = require('../constants');
var NotificationSystem = require('react-notification-system');
var Modal = require('../widgets/Modal.jsx');
var Loader = require('../widgets/Loader.jsx');
var Tooltip = require('../widgets/Tooltip.jsx');
var ContainersList = require('./ContainersList.jsx');


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
                        ? <div>
                                <object 
                                    data={this.state.filePreview.url} 
                                    width="100%" 
                                    type={this.state.filePreview.file_content_type}>
                                        <embed src={this.state.filePreview.url} type={this.state.filePreview.file_content_type}/>
                                </object>
                                <button onClick={this.handleSelection.bind(this, this.state.filePreview)} className="btn btn-success"><i className="fa fa-check white"></i></button>
                            </div>
                        : null
                    }
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
            modalState: true,
            searchedFile: '',
            browserList: [],
            pdfs: [],
            images: [],
            audios: [],
            videos: [],
            miscs: []
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/uploads.json", function(result){
            this.setState({
                browserList: result.uploads,
                loading: false
            });

            this.handleList(result.uploads);
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    handleModalState: function(st) {
        this.setState({ modalState: st });
        this.props.active(st);
    },

    handleFileType: function(type, name) {
        if (type && name) {
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
            } else if ( t[0] === "image" ) {
                return "image";
            } else {
                return "misc";
            }
        } else {
            return;
        }
    },

    handleList: function(data) {
        var pdfs = [],
            videos = [],
            audios = [],
            images = [],
            miscs = [];

        for (var i in data) {
            var type = this.handleFileType(data[i]["file_content_type"], data[i]["file_file_name"]);
            
            if (type === "pdf") {
                pdfs.push(data[i]);
            } else if (type === "video") {
                videos.push(data[i]);
            } else if (type === "audio") {
                audios.push(data[i]);
            } else if (type === "image") {
                images.push(data[i]);
            } else {
                miscs.push(data[i]);
            }
        }

        this.setState({
            pdfs: pdfs,
            videos: videos,
            audios: audios,
            images: images,
            miscs: miscs
        });
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

    handleFileSearch: function(event) {
        var that = this;
        this.setState({ 
            searchedFile: event.target.value,
            loading: true 
        });

        if (event.target.value.length > 0) {
            $.ajax({
                type: "GET",
                url: "/uploads/search/" + event.target.value,
                context: this,
                success: function(data) {
                    this.setState({ 
                        browserList: data.uploads,
                        showType: false,
                        selectedFiles: '',
                        selectedType: '',
                        loading: false
                    });
                    this.handleList(data.uploads);
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: "/uploads.json",
                context: this,
                success: function(data) {
                    this.setState({ 
                        browserList: data.uploads,
                        showType: false,
                        selectedFiles: '',
                        selectedType: '',
                        loading: false
                    });
                    this.handleList(data.uploads);
                }
            });
        }
    },

    render: function() {
        var that = this;

        return (
            <Modal active={this.handleModalState} mystyle={"media"} title={"Mes fichiers"}>
                { this.state.loading 
                    ? <Loader />
                    : null
                }

                { this.state.images.length > 0 ? <div className="file-type" onClick={this.handleTypeClick.bind(this, "image", this.state.images)}><i className="fa fa-image images fa-fw"></i></div> : null }

                { this.state.pdfs.length > 0 ? <div className="file-type" onClick={this.handleTypeClick.bind(this, "PDF", this.state.pdfs)}><i className="fa fa-file-pdf-o pdfs fa-fw"></i></div> : null }

                { this.state.videos.length > 0 ? <div className="file-type" onClick={this.handleTypeClick.bind(this, "video", this.state.videos)}><i className="fa fa-video-camera videos fa-fw"></i></div> : null }

                { this.state.audios.length > 0 ? <div className="file-type" onClick={this.handleTypeClick.bind(this, "audio", this.state.audios)}><i className="fa fa-music audios fa-fw"></i></div> : null }

                { this.state.miscs.length > 0 ? <div className="file-type" onClick={this.handleTypeClick.bind(this, "other", this.state.miscs)}><i className="fa fa-random miscs fa-fw"></i></div> : null }

                <div>
                    <br />
                    <input ref="searchfile" type="text" value={this.state.searchedFile} placeholder="Rechercher..." onChange={this.handleFileSearch}/>
                </div>

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
            upload: null,
            showActions: true,
            browserList: [],
            modalState: false,
            mediaAlt: '',
            mediaWidth: '',
            tooltipState: false,
            tooltipMovesState: false
        };
    },

    componentDidMount: function() {
        if (this.props.block.upload_id != undefined) {
            this.serverRequest = $.get("/uploads/"+ this.props.block.upload_id +".json", function(result) {
                this.setState({
                    upload: result,
                    mediaAlt: result.alt,
                    mediaWidth: result.width,
                    blockContent: this.makeHtmlContent(result, result.filetype, result.width),
                    showActions: false
                });
            }.bind(this));
        }

        this.setState({ 
            blockName: this.props.block.name,
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
        /* lowercase the ext to stick to the upload backend model */
        var fileExt = fileName.split(".").slice(-1)[0].toLowerCase();

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
                var content = this.makeHtmlContent(data, data.filetype, '');

                $.ajax({
                    url: "/blocks/set_content/" + this.props.block.id,
                    type: "PUT",
                    data: { 
                        content: content,
                        upload_id: data.id
                    }
                });

                this.setState({ 
                    blockContent: content, 
                    upload: data,
                    showActions: false 
                });
            }
        });
    },

    makeHtmlContent: function(data, type, width) {
        if (type == "video") {
            return '<video width="100%" controls>\n\t<source src="'+data.url+'" type="video\/mp4">\n</video>';
        } else if (type == "audio") {
            return '<audio controls>\n\t<source src="'+data.url+'" type="'+data.file_content_type+'">\n</audio>';
        } else if (type == "image") {
            if (width != '')
                return '<img src="'+data.url+'" style="max-width:'+width+'px">';
            else
                return '<img src="'+data.url+'">';
        } else if (type == "pdf") {
            return "<object data='"+data.url+"' width='100%' height='300px' type='application/pdf'>\n\t<embed src='"+data.url+"' type='application/pdf'/>\n</object>";
        } else {
            return type;
        }
    },

    handleBrowseFiles: function() {
        this.setState({ modalState: true });
    },

    handleModalState: function(st) {
        this.setState({ modalState: st });
    },

    handleBlockChange: function(data) {
        var content = this.makeHtmlContent(data, data.filetype, '');
        var upload = data;

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
                this.setState({ 
                    blockContent: content,
                    upload: upload, 
                    showActions: false 
                });
            }
        });
    },

    handleBlockName: function(event) {
        this.setState({
            blockName: event.target.value.trim(),
            
        });
    },

    handleMediaAlt: function(event) {
        var that = this;
        var saveChanges;
        clearTimeout(saveChanges);

        this.setState({
            mediaAlt: event.target.value
        });

        saveChanges = setTimeout(function(){
            that.saveChanges();
        }, Constants.DRAFT_TIMER);
    },

    handleMediaWidth: function(event) {
        var that = this;
        var saveChanges;
        clearTimeout(saveChanges);

        this.setState({
            mediaWidth: event.target.value
        });

        saveChanges = setTimeout(function(){
            that.saveChanges();
        }, Constants.DRAFT_TIMER);
    },

    saveChanges: function() {
        $.ajax({
            url: "/uploads/" + this.state.upload.id,
            type: "PUT",
            context: this,
            data: {
                name: this.state.blockName,
                alt: this.state.mediaAlt,
                width: this.state.mediaWidth
            },
            success: function(data) {
                var content = this.makeHtmlContent(data, data.filetype, this.state.mediaWidth);
                this.setState({ blockContent: content });
                $.ajax({
                    url: "/blocks/"+this.props.block.id,
                    type: "PUT",
                    context: this,
                    data: {
                        name: this.state.blockName,
                        content: content
                    }
                });  
            }
        });
    },

    toggleActions: function () {
        this.setState({ showActions: !this.state.showActions });
    },

    dynamicId: function(id){
        return "media_block_" + id;
    },

    createMarkup: function(data) {
        return {__html: data};
    },

    viewBlockAction: function() {
        this.setState({ 
            tooltipState: !this.state.tooltipState,
            tooltipMovesState: false
        });
    },

    viewBlockMoves: function() {
        this.setState({ 
            tooltipState: false,
            tooltipMovesState: !this.state.tooltipMovesState
        });
    },

    handleTooltipState: function(st) {
        this.setState({ tooltipState: st });
    },

    handleTooltipMovesState: function(st) {
        this.setState({ tooltipMovesState: st });
    },

    handleRemoveBlock: function() {
        this.props.removeBlock(this.props.block);
    },

    handleHelpModalState: function() {
        this.setState({ helpModalState: !this.state.helpModalState });
    },

    exportBlock: function() {
        this.props.exportBlock();
    },

    moveUpBlock: function() {
        this.props.moveBlock("up");
    },

    moveDownBlock: function() {
        this.props.moveBlock("down");
    },

    render: function() {
        var block = this.props.block;

        return (
            <div className="block-inner" onMouseEnter={this.showEditButton} onMouseLeave={this.showEditButton}>
                <div className="block-inner-content" key={block.id}>
                    <div className="block-title">
                        <i className="fa fa-image"></i>
                        <h3>
                            <input ref="mediablockname" type="text" value={this.state.blockName ? this.state.blockName : ''} placeholder="Titre..." onChange={this.handleBlockName}/>
                        </h3>
                    </div>

                    <div className="block-content">
                        <div className="block-content border" id={this.dynamicId(block.id)} dangerouslySetInnerHTML={this.createMarkup(this.state.blockContent)} />

                        { this.state.blockContent != '' 
                            ? <div>
                                <input type="text" value={this.state.mediaAlt ? this.state.mediaAlt : ''} placeholder="Texte descriptif..." onChange={this.handleMediaAlt} />
                                {  this.state.upload.filetype != null && this.state.upload.filetype === "image"
                                    ? <input type="text" value={this.state.mediaWidth ? this.state.mediaWidth : ''} placeholder="Largeur (optionnel)" onChange={this.handleMediaWidth} />
                                    : null
                                }
                            </div>
                            : null
                        }

                        { this.state.showActions 
                            ? <div className="block-media-actions">
                                    <div className="dropzone" id="new_upload" ref="mediaForm" encType="multipart/form-data" onChange={this.submitMedia} action="/uploads" method="post">
                                        <div className="viewDropzone"></div> 
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
                                
                                    <div className="browse-files" onClick={this.handleBrowseFiles}>
                                        <i className="fa fa-folder-open"></i><br/>
                                        Parcourir mes fichiers
                                    </div>

                                    { this.state.modalState 
                                        ? <FileBrowser active={this.handleModalState} block={block.id} updateBlock={this.handleBlockChange} selectFile={this.selectFile} /> 
                                        : null 
                                    }
                                </div>
                            : null
                        }
                    </div>
                        
                    { this.state.helpModalState
                        ? <Modal active={this.handleHelpModalState} mystyle={"help"} title={"Aide"}>
                                <div className="modal-in media">
                                <h4> Block Média (En cours d'édition)</h4>
                                    Déposer un nouveau fichier :
                                    <ul>
                                        <li>cliquez sur l'icône <i className="fa fa-file-text"></i> ou glissez directement votre fichier par dessus.</li>
                                    </ul>
                                    <br />
                                    Réemployer un fichier :
                                    <ul>
                                        <li>cliquez sur l'icône <i className="fa fa-folder-open"></i>.</li>
                                    </ul>
                                    <br />
                                    Editer le block :
                                    <ul>
                                        <li>cliquez sur l'icône <i className="fa fa-pencil"></i>.</li>
                                    </ul>
                                    <br />
                                    Enregistrer le block :
                                    <ul>
                                        <li>cliquez sur l'icône <i className="fa fa-check"></i>.</li>
                                    </ul>
                                </div>
                            </Modal>
                        : null
                    }

                    <div className="action">
                        { this.state.showActions
                            ? <i onClick={this.toggleActions} title="Enregistrer " className="fa fa-check"></i>
                            :<i 
                                className=" fa fa-pencil"
                                onClick={this.toggleActions}
                                title="Editer"
                                >
                            </i>
                        }
                        <i className="fa fa-cog" title="Paramètre" onClick={this.viewBlockAction} ></i>
                        <i className="fa fa-question-circle" title="Aide" onClick={this.handleHelpModalState} ></i>
                        <button className="handle" title="Déplacer le bloc" onClick={this.viewBlockMoves}></button>
                    </div>

                    <Tooltip tooltipState={this.handleTooltipState}>
                        { this.state.tooltipState
                            ? <div className="block-actions">
                                <button className="btn-block" onClick={this.exportBlock.bind(this, block.id)}><i className="fa fa-files-o"></i> Dupliquer</button>
                                <br/>
                                <button className="btn-block" onClick={this.handleRemoveBlock}><i className="fa fa-remove"></i> Supprimer</button><br/>
                            </div>
                            : null
                        }
                    </Tooltip>

                    <Tooltip tooltipState={this.handleTooltipMovesState}>
                        { this.state.tooltipMovesState
                            ? <div className="block-actions block-moves">
                                <button className="btn-block" onClick={this.moveUpBlock}><i className="fa fa-chevron-up"></i> Monter</button><br/>
                                <button className="btn-block" onClick={this.moveDownBlock}><i className="fa fa-chevron-down"></i> Descendre</button><br/>
                                <NotificationSystem ref="notificationSystem" />
                            </div>
                            : null
                        }
                    </Tooltip>
                </div>

                <NotificationSystem ref="notificationSystem"/>
            </div>
        );
    }
});

module.exports = MediaBlock;