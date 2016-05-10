CKEDITOR.dialog.add('dynavarDialog', function(editor) {
    return {
        title: 'Variables',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    {
                        type: 'text',
				                id: 'formula',
				                label: 'Formula',
				                validate: CKEDITOR.dialog.validate.notEmpty( "Cannot be empty." )
                    }
                ]
            }
        ]
    };
});