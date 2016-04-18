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

        var formData = new FormData();
        formData.append("tempfile", $(this.refs.mediaFile.files[0])[0]);

        $.ajax({
            url: '/uploads',
            type: "POST",
            contentType: false,
            cache: false,
            processData: false,
            data: formData,
            context: this,
            success: function(data) {
                this.drawBlockContent(data);
            }
        });
    },

    drawBlockContent: function(data) {
        var content = React.createElement("a", {value: "And here is a child"});
        this.setState({
            mediaResultContent: content
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
                    <form className="new_upload" id="new_upload" ref="mediaForm" encType="multipart/form-data" onSubmit={this.submitMedia} action="/uploads" method="post">
                        <input className="uploader" name="upload[file]" ref="mediaFile" id="upload_file" type="file" />
                        <input type="submit" value="Save" className="btn-success" />
                    </form>
                    <div ref="mediaResult" dangerouslySetInnerHTML={this.createMarkup(this.state.mediaResultContent)} />
                </div>
                <NotificationSystem ref="notificationSystem"/>
            </div>
        );
	}
});

module.exports = MediaBlock;