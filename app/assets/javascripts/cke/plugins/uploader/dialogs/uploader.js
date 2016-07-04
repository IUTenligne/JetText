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
                        html: '<input name="upload[file]" id="cke_upload_file" type="file">'
                    }
                ]
            }
        ],
        onOk: function() {
            var ed_name = editor.name.split("_");
            var block_id = ed_name[ed_name.length - 1];
            var file = $("#cke_upload_file")[0].files[0];
            var type = file.type.split("/")[1];

            var formData = new FormData();
            formData.append("tempfile", file);
            formData.append("block_id", block_id);

            if ((type === "png") || (type === "jpg") || (type === "gif") || (type === "jpeg") || (type === "svg")) {
                $.ajax({
                    url: "/uploads",
                    type: "POST",
                    contentType: false,
                    cache: false,
                    processData: false,
                    data: formData,
                    success: function(data) {
                        var element = editor.document.createElement('img');
                        element.setAttribute('src', data.url);
                        editor.insertElement(element);
                    }
                });
                return;
            } else {
                editor.showNotification('Erreur : format de fichier non pris en charge');
                return;
            }
        }
    };
});
