CKEDITOR.plugins.add('glossary', {

	init: function(editor) {
		var plugin_path = '/assets/cke/plugins/glossary/';

		editor.addCommand('startVariables', new CKEDITOR.dialogCommand('glossaryDialog'));

		editor.ui.addButton( 'Variables', {
			label: 'Variables',
			command: 'startVariables',
			toolbar: 'insert',
			icon: plugin_path + 'icons/variable.png'
		});

		CKEDITOR.dialog.add('glossaryDialog', plugin_path + 'dialogs/glossary.js');
	}

});