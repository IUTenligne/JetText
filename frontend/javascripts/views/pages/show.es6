class PagesShow extends App {
  render() {
    console.log("pages/show");

    $(document).on('page:receive',function(){
      tinymce.remove(); //fixes turbolinks issue
    });

    $('#editor-container').css({
      "height":"100%"
    });

    $('#editor1').css({
      "width":"100%",
      "height":"100%",
      "min-height":"100%"
    });

    tinymce.init({
      selector: '#editor1',
      plugins: "code link visualblocks table uploader formula glossary",
      menubar: false,
      extended_valid_elements: "span[!class]",
      toolbar: "undo redo | formatselect | link code table | uploader formula glossary",
      visualblocks_default_state: false, //show info boxes around elements 
      force_br_newlines: false,
      force_p_newlines: true,
      forced_root_block: '',
      content_css: '/assets/bootstrap/dist/css/bootstrap.min.css',
      setup: function(editor) {
        editor.on('init', function(args) {
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, editor.getContent()], function() {
            editor.getContent();
          });
          MathJax.Hub.Queue(function() {
            editor.getContent();
          });
          editor.setContent(editor.getContent());
          
          var iframe = $("#" + args.target.id + "_ifr");
          var content = $(iframe[0].contentWindow.document.body);
          var iframeElm = $.parseHTML(content.html());
                    
          var selected_text = "";
          content.mouseup(function() {
            selected_text = getIframeSelectionText(iframe[0]);
            var selected = $.parseHTML(getIframeSelectionText(iframe[0]));
          });

        });
      }
    });

    addPageBox();

    // sortable pages order using jquery.sortable.min.js
    function set_positions(){
      // loop through and give each task a data-pos
      // attribute that holds its position in the DOM
      $('.pages-panel.sortable').find('a').each(function(i){
        $(this).attr("data-pos",i+1);
      });
    }

    set_positions();
    $('.pages-panel.sortable').sortable();

    $('.pages-panel.sortable').sortable().bind('sortupdate', function(e, ui) {
      // array to store new order
      var updated_order = [];
      // set the updated positions
      set_positions();

      // populate the updated_order array with the new task positions
      $('.pages-panel.sortable').find('a').each(function(i){
        updated_order.push({ id: $(this).data("id"), position: i+1 });
      });

      // send the updated order via ajax
      $.ajax({
        type: "PUT",
        url: '/pages/sort',
        data: { order: updated_order }
      });
    });

    $('.increment-level').click(function(e) {
      e.preventDefault();
      $.ajax({
        type: "PUT",
        url: '/pages/levelize',
        data: { id: $(this).data('target'), do: "inc" }
      });
      return false;
    });
  }
}

// create a new page from the menu
function addPageBox() {
  $('.hidden_elem').hide();
  $('#add_new_page_button').click(function () {
    $('#add_new_page').toggle();
  });
}

// selected text in the editor's iframe
function getIframeSelectionText(iframe) {
  var win = iframe.contentWindow;
  var doc = win.document;

  if (win.getSelection) {
    return win.getSelection().toString();
  } else if (doc.selection && doc.selection.createRange) {
    return doc.selection.createRange().text;
  }
}