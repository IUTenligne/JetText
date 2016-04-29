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

            $.ajax({
                url: "/uploads",
                type: "POST",
                contentType: false,
                cache: false,
                processData: false,
                data: formData,
                success: function(data) {
                    if (type == "mp4") {
                        var element = editor.document.createElement('video');
                        element.setAttribute('src', data.url);
                        element.setAttribute('controls', '');
                    } else if (type == "mp3"|| type == "mpeg") {
                        var element = "<script type='text/javascrip'>var wavesurfer = WaveSurfer.create({container: '#block_"+data.block_id+"', waveColor: 'blue', progressColor: 'purple'}); wavesurfer.load(data.url); wavesurfer.on('ready', function () { wavesurfer.play(); });</script><audio controls><source src='"+data.url+"' type='audio/mpeg'></audio>";
                    } else if (type == "pdf") {
                        var element = editor.document.createElement('a');
                        element.setAttribute('href', data.url);
                        element.appendText('PDF');
                    }
                    editor.insertElement(element);
                }
            });
        }
    };
});