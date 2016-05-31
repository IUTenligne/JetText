// Called by frontend/react/pages/Editor.jsx
CKEDITOR.editorConfig = function( config ) {
	config.toolbar = [
		{ name: 'clipboard', items: [ 'Undo', 'Redo' ] },
		{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor', 'Uploader', 'Variables' ] },
		{ name: 'insert', items: [ 'Table', 'HorizontalRule', 'SpecialChar' ] },
		{ name: 'document', items: [ 'Source' ] },
		{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
		{ name: 'paragraph', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent' ] },
	];

	config.format_tags = 'p;h1;h2;h3;pre';
	config.tabSpaces = 4;

	config.removeDialogTabs = 'image:advanced;link:advanced';

	// Custom plugins app/assets/javascripts/cke/plugins
	//config.extraPlugins = 'uploader,dynavar,justify';
	config.extraPlugins = 'justify';
 	
	config.allowedContent = true; //keep special styles on re-edition
};
