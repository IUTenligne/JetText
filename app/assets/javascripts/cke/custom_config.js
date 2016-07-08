// Called by frontend/react/pages/Editor.jsx
CKEDITOR.editorConfig = function( config ) {
	config.toolbar = [
		{ name: 'clipboard', items: [ 'Undo', 'Redo' ] },

		{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
		{ name: 'insert', items: [ 'Table', 'HorizontalRule', 'SpecialChar' ] },
		{ name: 'document', items: [ 'Source' ] },
		{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
		{ name: 'paragraph', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Uploader', 'Glossary' ] },
	];

	config.format_tags = 'p;h1;h2;h3;pre';
	config.tabSpaces = 4;

	config.removeDialogTabs = 'image:advanced;link:advanced';

	// Custom plugins app/assets/javascripts/cke/plugins
	config.extraPlugins = 'uploader,glossary,pastefromword,justify';

	config.allowedContent = 'img[!src,width,height,alt,title,align]; a[!href]; ul; li; ol; strong; em; table; tbody; thead; tfoot; th[colspan,rowspan]; tr[colspan,rowspan]; td[colspan,rowspan]; p{text-align}; u; strike; sub; sup; iframe[*];'; //keep special styles on re-edition
};

CKEDITOR.on('dialogDefinition', function(ev) {
	if(ev.data.name === 'table') {
		var infoTab = ev.data.definition.getContents('info');
		var width = infoTab.get('txtWidth');
		width['default'] = "100%";
	}
});
