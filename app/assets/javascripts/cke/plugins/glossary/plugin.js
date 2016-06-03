CKEDITOR.plugins.add('glossary', {

	init: function(editor) {
		var plugin_path = '/assets/cke/plugins/glossary/';

		editor.addCommand('startGlossary', new CKEDITOR.dialogCommand('glossaryDialog'));

		editor.ui.addButton( 'Glossary', {

			label: 'Glossaires',
			command: 'startGlossary',
			toolbar: 'insert',
			icon: plugin_path + 'icons/glossary.png'

		});

		CKEDITOR.dialog.add('glossaryDialog', plugin_path + 'dialogs/glossary.js');
	}

});