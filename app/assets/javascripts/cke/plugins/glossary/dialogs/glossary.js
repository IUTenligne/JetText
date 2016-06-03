CKEDITOR.dialog.add('glossaryDialog', function(editor) {

    
    return {
        title: 'Ajouter un terme',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'create-term',
                label: 'Create term',
                elements: [
                	{
                        type: 'select',
		                id: 'glossaire',
                        items: [],
                        onShow: function(){
                            
                            $.ajax({
                                url: "/glossaries.json",
                                type: "GET",
                                context: this,
                                success: function(data) {
                                    console.log(data);
                                    var that = this;
                                    $.each(data.glossaries, function(index, item) {
                                        that.add(item["name"], item["id"])
                                    });
                                }
                            });
                        },
		                label: 'Glossaire',
		                validate: CKEDITOR.dialog.validate.notEmpty( "Cannot be empty." )
                    },

                    {
                        type: 'text',
		                id: 'name',
		                label: 'Terme',
                        onShow:  function(){
                            var name = editor.getSelection().getSelectedText().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                            this.setValue( name );
                        },

                        
                    },

                    {
                        type: 'text',
                        id: 'definition',
                        label: 'Définition',
                        validate: CKEDITOR.dialog.validate.notEmpty( "Cannot be empty." )
                    }
                ]
            }
        ],
        onOk: function() {
            var glossary = this.getValueOf('create-term', 'glossaire');
        	var name = this.getValueOf('create-term', 'name');
            var definition = this.getValueOf('create-term', 'definition');
        	$.ajax ({
                type: "POST",
                url: '/terms',
                context: this,
                data: {
                    term: {
                        name: name,
                        description: definition,
                        glossary_id: glossary
                    }
                },
                success: function(data){
                    console.log(data);
                },
            });
        }
    };
});