tinymce.PluginManager.add('formula', function(editor, url) {
    editor.addButton('formula', {
        type: 'button',
        title: 'Formula',
        icon: 'formula',
        id: 'formula',
        onclick: function() {
            editor.windowManager.open({
                title: 'Formula',
                html: '<textarea id="formula_content" style="width:100%;height:50%;padding: 5px"></textarea><div id="preview" style="width:100%;height:50%;padding: 5px">Preview</div>',
                buttons: [{
                    text: 'Submit',
                    onclick: 'submit'
                }, {
                    text: 'Cancel',
                    onclick: 'close'
                }],
                width: 400,
                height: 250,
                onopen: function(e) {

				    $('#formula_content').on('change keyup paste', function() {
				    	var f = $('#formula_content').val();
      				    $('#preview').html(f);
      				    MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#preview').html()]);
				    });
                },
                onsubmit: function(e) {
                    e.preventDefault();
                    editor.insertContent($('#formula_content').val());
                    editor.windowManager.close();
                    return;
                }
            });
        }
    });
});

