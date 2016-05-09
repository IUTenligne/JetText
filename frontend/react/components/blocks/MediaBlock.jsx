var React = require('react');
var NotificationSystem = require('react-notification-system');
var Modal = require('../widgets/Modal.jsx');

var FileBrowser = React.createClass({
    getInitialState: function() {
        return {
              browserList: []
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get("/uploads.json", function(result){
            this.setState({
                browserList: result.uploads
            })
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    handleModalState: function(st) {
        this.props.active( st );
    },

    render: function() {
        console.log(this.state.browserList)
        return (
            <Modal active={this.handleModalState}>
                { this.state.browserList.map(function(file) {
                    return( <li key={file.id}>{file.file_file_name}</li> );
                })}
            </Modal>
        );
    }
});

var MediaBlock = React.createClass({
	getInitialState: function() {
        return {
            mediaResultContent: '',
            browserList: [],
            modalState: false
        };
    },

    componentDidMount: function() {
        this.setState({ mediaResultContent: this.props.block.content });
    },

    submitMedia: function(event) {
        event.preventDefault();

        this.setState({ mediaResultContent: '<i class="fa fa-spinner fa-pulse loader"></i>' });

        var fileName = $(this.refs.mediaFile.files[0])[0].name;
        var fileExt = fileName.split(".").slice(-1)[0];

        var formData = new FormData();
        formData.append("tempfile", $(this.refs.mediaFile.files[0])[0]);
        formData.append("block_id", this.props.block.id);

        $.ajax({
            url: "/uploads/clear/" + this.props.block.id,
            type: "DELETE"
        });

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

                this.setState({ mediaResultContent: content });
            }
        });
    },

    makeHtmlContent: function(data, type) {
        if (type == "mp4") {
            return '<video width="100%" controls><source src="'+data.url+'" type="video\/mp4"></video>';
        } else if (type == "mp3"|| type == "mpeg") {
            return "<script type='text/javascrip'>var wavesurfer = WaveSurfer.create({container: '#block_"+data.block_id+"', waveColor: 'blue', progressColor: 'purple'}); wavesurfer.load(data.url); wavesurfer.on('ready', function () { wavesurfer.play(); });</script><audio controls><source src='"+data.url+"' type='audio/mpeg'></audio>";
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
                        <h3>{block.name}</h3>
                    </div>

                    <form className="block-content dropzone new_upload" id="new_upload" ref="mediaForm" encType="multipart/form-data" onChange={this.submitMedia} action="/uploads" method="post">
                        <input className="uploader" name="upload[file]" ref="mediaFile" id="upload_file" type="file" />
                    </form>

                    <button onClick={this.handleBrowseFiles}>Browse files</button>
                    { this.state.modalState ? <FileBrowser active={this.handleModalState} /> : null }

                    <div className="block-content" ref="mediaResult" id={this.dynamicId(block.id)} dangerouslySetInnerHTML={this.createMarkup(this.state.mediaResultContent)} />
                </div>

                <NotificationSystem ref="notificationSystem"/>
            </div>
        );
	}
});

module.exports = MediaBlock;