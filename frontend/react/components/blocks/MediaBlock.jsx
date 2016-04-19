var React = require('react');
var NotificationSystem = require('react-notification-system');


var MediaBlock = React.createClass({
	getInitialState: function() {
        return {
          mediaResultContent: ''
        };
    },

	submitMedia: function(event) {
        event.preventDefault();

        this.setState({ mediaResultContent: '<i class="fa fa-spinner fa-pulse"></i>' });

        var formData = new FormData();
        var fileName = $(this.refs.mediaFile.files[0])[0].name;
        var fileExt = fileName.split(".").slice(-1)[0];

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
                var content = '<a href=""><i class="fa fa-file-pdf-o"></i> PDF !</a>';
                $.ajax({
                    url: "/blocks/set_content/" + this.props.block.id,
                    type: "PUT",
                    data: { content: content }
                });
                this.setState({ mediaResultContent: content });
            }
        });
    },

    createMarkup: function(data) {
        return {__html: data};
    },

	render: function() {
		var block = this.props.block;
		return (
            <div className="block">
                <div>
                    <h3>{block.name}</h3>
                    <form className="dropzone new_upload" id="new_upload" ref="mediaForm" encType="multipart/form-data" onChange={this.submitMedia} action="/uploads" method="post">
                        <input className="uploader" name="upload[file]" ref="mediaFile" id="upload_file" type="file" />
                    </form>
                    <div ref="mediaResult" dangerouslySetInnerHTML={this.createMarkup(this.state.mediaResultContent)} />
                </div>
                <NotificationSystem ref="notificationSystem"/>
            </div>
        );
	}
});

module.exports = MediaBlock;