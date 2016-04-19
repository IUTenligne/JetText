var React = require('react');
var NotificationSystem = require('react-notification-system');


var MediaBlock = React.createClass({
	getInitialState: function() {
        return {
            mediaResultContent: '',
            upload: ''
        };
    },

    componentDidMount: function() {
        if (this.props.block.upload_id != null) {
            this.serverRequest = $.get("/uploads/"+this.props.block.upload_id+".json", function (result) {
                this.setState({ upload: result });
            }.bind(this));
        }
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
                this.setState({ mediaResultContent: content, upload: '' });

                if (fileExt == "mp3" || fileExt == "mpeg") {
                    var wavesurfer = WaveSurfer.create({container: '#media_block_'+data.block_id, waveColor: '#00AEEF', progressColor: '#FF8500'});
                    wavesurfer.load(data.url);
                    wavesurfer.on('ready', function () { wavesurfer.play(); });
                }
            }
        });
    },

    makeHtmlContent: function(data, type) {
        if (type == "mp4") {
            return '<video controls><source src="'+data.url+'" type="video\/mp4"></video>';
        } else if (type == "mp3"|| type == "mpeg") {
            return "<script type='text/javascrip'>var wavesurfer = WaveSurfer.create({container: '#block_"+data.block_id+"', waveColor: 'blue', progressColor: 'purple'}); wavesurfer.load(data.url); wavesurfer.on('ready', function () { wavesurfer.play(); });</script>";
        } else {
            return type;
        }
    },

    dynamicId: function(id){
        return "media_block_" + id;
    },

    createMarkup: function(data) {
        return {__html: data};
    },

	render: function() {
		var block = this.props.block;
        if (this.state.upload.file_content_type == "audio/mpeg") {
            var wavesurfer = WaveSurfer.create({container: '#media_block_'+this.props.block.id, waveColor: '#00AEEF', progressColor: '#FF8500'});
            wavesurfer.load(this.state.upload.url);
            wavesurfer.on('ready', function () { wavesurfer.play(); });
        }
		return (
            <div className="block">
                <div>
                    <h3>{block.name}</h3>
                    <form className="dropzone new_upload" id="new_upload" ref="mediaForm" encType="multipart/form-data" onChange={this.submitMedia} action="/uploads" method="post">
                        <input className="uploader" name="upload[file]" ref="mediaFile" id="upload_file" type="file" />
                    </form>
                    <div ref="mediaResult" id={this.dynamicId(block.id)} dangerouslySetInnerHTML={this.createMarkup(this.state.mediaResultContent)} />
                </div>
                <NotificationSystem ref="notificationSystem"/>
            </div>
        );
	}
});

module.exports = MediaBlock;