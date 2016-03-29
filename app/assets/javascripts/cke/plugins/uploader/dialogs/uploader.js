CKEDITOR.dialog.add('uploaderDialog', function(editor) {
    return {
        title: 'Uploader',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    {
                        type: 'html',
                        html: '<form class="new_upload" id="new_upload" enctype="multipart/form-data" action="/uploads" accept-charset="UTF-8" data-remote="true" method="post"><input name="utf8" value="✓" type="hidden"><p><input class="uploader" name="upload[file]" id="upload_file" type="file"></p></form>'
                    }
                ]
            }
        ],
        onOk: function() {
            var dialog = this;
            $('#new_upload').submit();
            var file = $('#new_upload').find('#upload_file')[0].files[0];
            var type = file.type.split('/')[0];
            var url = currentUser.email + '/files/' + type + '/' + file.name;
            if (file.type === 'image/png') {
                var editor_elem = editor.document.createElement('img');
                editor_elem.setAttribute('src', url);
            } else if (file.type === 'application/pdf') {
                var editor_elem = editor.document.createElement('a');
                editor_elem.setAttribute('href', url);
                editor_elem.appendText('PDF');
            } else if (file.type === 'video/mp4') {
                var editor_elem = editor.document.createElement('video');
            }

            editor.insertElement(editor_elem);
        }
    };
});