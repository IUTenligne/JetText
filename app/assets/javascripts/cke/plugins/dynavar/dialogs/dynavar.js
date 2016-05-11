CKEDITOR.dialog.add('dynavarDialog', function(editor) {
    return {
        title: 'Variables',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'tab-variable',
                label: 'Create variable',
                elements: [
                	{
                        type: 'text',
		                id: 'name',
		                label: 'Name',
		                validate: CKEDITOR.dialog.validate.notEmpty( "Cannot be empty." )
                    },
                    {
                        type: 'text',
		                id: 'value',
		                label: 'Value',
		                validate: CKEDITOR.dialog.validate.notEmpty( "Cannot be empty." )
                    }
                ]
            },
            {
                id: 'tab-formula',
                label: 'Create formula',
                elements: [
                	{
                		type: 'select',
                		id: 'variable',
                		items: [],
                		onLoad: function() {
                			$.ajax({
                				url: "/formulas.json",
                				type: "GET",
                				context: this,
                				success: function(data) {
                					var that = this;
                					$.each(data.formulas, function(index, item) {
					                    that.add(item["name"], item["name"])
					                });
                				}
                			});
                		},
                		onChange: function() {
                			var dialog = CKEDITOR.ui.dialog;
        					console.log(dialog);
                		}
                	},
                    {
                    	type: 'text',
		                id: 'formula',
		                label: 'Formula',
		                onChange: function(api) {
                			//console.log(api.data.value);
                			var test = CKEDITOR.ui.dialog.select;
                			//console.log(test);
                		}
                    },
                    {
                    	type: 'text',
		                id: 'result',
		                label: 'Result'
                    }
                ]
            }
        ],
        onOk: function() {
        	var dialog = this;
        	var name = dialog.getValueOf('tab-variable', 'name');
        	var value = dialog.getValueOf('tab-variable', 'value');

        	$.ajax({
                url: "/formulas",
                type: "POST",
                data: {
                	formula: {
                		name: name,
                		value: value
                	}
                }
            });
        }
    };
});