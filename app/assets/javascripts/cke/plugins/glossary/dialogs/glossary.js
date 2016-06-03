CKEDITOR.dialog.add('glossaryDialog', function(editor) {

    
    return {
        title: 'Ajouter un terme',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'create-term',
                label: 'dans un glossaire',
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
                                    var that = this;
                                    $.each(data.glossaries, function(index, item) {
                                        that.add(item["name"], item["id"])
                                    });
                                }
                            });
                        },
		                label: 'Glossaire'
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
                        label: 'Définition'
                    }
                ]
            },
            {
                id: 'create-glossary',
                label: 'dans un nouveau glossaire',
                elements: [
                    {
                        type: 'text',
                        id: 'glossaire',
                        label: 'Nom du nouveau glossaire',
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
                    }
                ]
            }
        ],
        onOk: function() {
            var glossaryCreatTerm = this.getValueOf('create-term', 'glossaire');
        	var nameCreatTerm = this.getValueOf('create-term', 'name');
            var definitionCreatTerm = this.getValueOf('create-term', 'definition');

            var glossaryCreatGlossary = this.getValueOf('create-glossary', 'glossaire');
            var nameCreatGlossary = this.getValueOf('create-glossary', 'name');
            var definitionCreatGlossary = this.getValueOf('create-glossary', 'definition');

            if (glossaryCreatGlossary != "" && definitionCreatGlossary != "" && definitionCreatTerm == ""){
                console.log(glossaryCreatTerm);
                $.ajax ({
                    type: "POST",
                    url: '/glossaries',
                    context: this,
                    data: {
                        glossary: {
                            name: glossaryCreatGlossary
                        }
                    },
                    success: function(data){
                        console.log(data.id,definitionCreatGlossary,glossaryCreatGlossary);
                        $.ajax ({
                            type: "POST",
                            url: '/terms',
                            context: this,
                            data: {
                                term: {
                                    name: nameCreatGlossary,
                                    description: definitionCreatGlossary,
                                    glossary_id: data.id
                                }
                            },
                            success: function(data){
                                console.log("ok2");
                            },
                        }); 
                    },
                }); 
            }
            if( definitionCreatTerm == "" && definitionCreatGlossary == ""){
                alert( "aucun champs n'est rempli"  );
            }
            if(definitionCreatTerm != "" && nameCreatTerm != "" ){
                console.log(nameCreatTerm,definitionCreatTerm,glossaryCreatTerm);
                $.ajax ({
                    type: "POST",
                    url: '/terms',
                    context: this,
                    data: {
                        term: {
                            name: nameCreatTerm,
                            description: definitionCreatTerm,
                            glossary_id: glossaryCreatTerm
                        }
                    },
                    success: function(data){
                        console.log(data);
                    },
                }); 
            }
        }
    };
});