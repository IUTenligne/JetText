CKEDITOR.plugins.add('dynavar', {

	init: function(editor) {
		var plugin_path = '/assets/cke/plugins/dynavar/';

		editor.addCommand('startVariables', new CKEDITOR.dialogCommand('dynavarDialog'));

		editor.ui.addButton( 'Variables', {
			label: 'Variables',
			command: 'startVariables',
			toolbar: 'insert',
			icon: plugin_path + 'icons/variable.png'
		});

		CKEDITOR.dialog.add('dynavarDialog', plugin_path + 'dialogs/dynavar.js');
	}

});