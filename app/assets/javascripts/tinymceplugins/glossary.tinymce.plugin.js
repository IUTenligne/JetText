tinymce.PluginManager.add('glossary', function(editor, url) {
    editor.addButton('glossary', {
        type: 'button',
        title: 'Glossary',
        icon: 'glossary',
        id: 'glossary',
        onclick: function(e, args) {
            console.log(e, args);
            var selection = window.getSelection().toString();
            console.log(selection);
            editor.windowManager.open({
                title: 'Glossary',
                html: '<input type="text" id="glossary_name" placeholder="name..." style="width:100%;height:20%;padding: 5px"><br><textarea id="glossary_description" placeholder="description..." style="width:100%;height:80%;padding: 5px"></textarea>',
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
                    function getIframeSelectionText(iframe) {
                      var win = iframe.contentWindow;
                      var doc = win.document;

                      if (win.getSelection) {
                        return win.getSelection().toString();
                      } else if (doc.selection && doc.selection.createRange) {
                        return doc.selection.createRange().text;
                      }
                    }
                    //if some text is selected in the editor, removes the spaces before and after the string and adds it to the input
                    var iframe = $("#editor1_ifr");
                    var selected_text = getIframeSelectionText(iframe[0]).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                    if (selected_text != "") {
                        $('#glossary_name').val(selected_text);
                    }
                },
                onsubmit: function(e) {
                    e.preventDefault();
                    $.ajax({
                        type: "POST",
                        url: '/glossaries',
                        data: {
                            glossary: {
                                name: $('#glossary_name').val(),
                                description: $('#glossary_description').val()
                            }
                        },
                        beforeSend: function(jqXHR, settings) {
                            jqXHR.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                        },
                        error: function(){
                            alert("An error ocurred");
                        },
                        success: function(){

                        }
                    });
                    editor.windowManager.close();
                    return;
                }
            });
        }
    });
});

