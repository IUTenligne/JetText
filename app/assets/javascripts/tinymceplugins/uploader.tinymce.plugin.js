tinymce.PluginManager.add('uploader', function(editor, url) {
    editor.addButton('uploader', {
        type: 'button',
        title: 'File uploader',
        icon: 'uploader',
        id: 'uploader',
        onclick: function() {
            editor.windowManager.open({
                title: 'File uploader',
                html: '<div id="uploadform"></div>',
                buttons: [{
                    text: 'Submit',
                    onclick: 'submit'
                }, {
                    text: 'Cancel',
                    onclick: 'close'
                }],
                width: 400,
                height: 150,
                onopen: function(e) {
                    $('#new_upload').clone().appendTo('#uploadform').show();
                },
                onsubmit: function(e) {
                   e.preventDefault();
                   $('#uploadform').find('#new_upload').submit();
                   var file = $('#uploadform').find('#upload_file')[0].files[0];
                   var elem = wrapElem(file.type, file.name);
                   editor.insertContent(elem);
                   editor.windowManager.close();
                   return;
                }
            });
        }
    });

    function wrapElem(type, name) {
        console.log(type);
        var t = type.split('/')[0];
        switch(type) {
            case 'image/png':
                return '<img src="'+c_path+t+'/'+name+'" />';
            case 'application/pdf':
                return '<a href="'+c_path+t+'/'+name+'" target="_blank"><i class="fa fa-file-pdf-o"></i> '+name+'</a>';
            case 'video/mp4':
                return '<video width="100%" controls>\n<source src="'+c_path+t+'/'+name+'" type="video/mp4">\n</video>';
        }
    }
});
