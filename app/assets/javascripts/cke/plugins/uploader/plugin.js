CKEDITOR.plugins.add('uploader', {

	init: function(editor) {
		var plugin_path = '/assets/cke/plugins/uploader/';

		editor.addCommand('startUpload', new CKEDITOR.dialogCommand('uploaderDialog'));

		editor.ui.addButton( 'Uploader', {
			label: 'Uploader',
			command: 'startUpload',
			toolbar: 'insert',
			icon: 'image'
		});

		CKEDITOR.dialog.add('uploaderDialog', plugin_path + 'dialogs/uploader.js');
	}

});