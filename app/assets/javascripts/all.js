'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App() {
    _classCallCheck(this, App);
  }

  _createClass(App, [{
    key: 'ready',
    value: function ready() {
      var componentName, viewName;
      componentName = $('#outlet').data('component');
      viewName = $('#outlet').data('view');
      try {
        var view = eval("new " + componentName + viewName + "()");
        view.render();
      } catch (err) {
        console.error("outer", err.message);
      }
    }
  }]);

  return App;
}();

var app = new App();

$(document).ready(app.ready);
$(document).on('page:load', app.ready);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//     ____    ____
//      /__ _/_ /_\   _/_
//     //_  /  //_ \/ /
// /__/ \__/_ / \__/\/_
// 
// views
// |-containers
// | |-my

var ContainersEdit = function (_App) {
  _inherits(ContainersEdit, _App);

  function ContainersEdit() {
    _classCallCheck(this, ContainersEdit);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ContainersEdit).apply(this, arguments));
  }

  _createClass(ContainersEdit, [{
    key: "render",
    value: function render() {
      console.log("containers/edit"); //file
    }
  }]);

  return ContainersEdit;
}(App);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//     ____    ____
//      /__ _/_ /_\   _/_
//     //_  /  //_ \/ /
// /__/ \__/_ / \__/\/_
// 
// views
// |-containers
// | |-index

var ContainersIndex = function (_App) {
  _inherits(ContainersIndex, _App);

  function ContainersIndex() {
    _classCallCheck(this, ContainersIndex);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ContainersIndex).apply(this, arguments));
  }

  _createClass(ContainersIndex, [{
    key: "render",
    value: function render() {
      console.log("containers/index"); //file
    }
  }]);

  return ContainersIndex;
}(App);

var ContainersIndexPart = function (_ContainersIndex) {
  _inherits(ContainersIndexPart, _ContainersIndex);

  function ContainersIndexPart() {
    _classCallCheck(this, ContainersIndexPart);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ContainersIndexPart).apply(this, arguments));
  }

  _createClass(ContainersIndexPart, [{
    key: "testTry",
    value: function testTry() {
      console.log("index-view-part");
    }
  }]);

  return ContainersIndexPart;
}(ContainersIndex);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//     ____    ____
//      /__ _/_ /_\   _/_
//     //_  /  //_ \/ /
// /__/ \__/_ / \__/\/_
// 
// views
// |-containers
// | |-my

var ContainersNew = function (_App) {
  _inherits(ContainersNew, _App);

  function ContainersNew() {
    _classCallCheck(this, ContainersNew);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ContainersNew).apply(this, arguments));
  }

  _createClass(ContainersNew, [{
    key: "render",
    value: function render() {
      console.log("containers/new"); //file
    }
  }]);

  return ContainersNew;
}(App);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContainersShow = function (_App) {
	_inherits(ContainersShow, _App);

	function ContainersShow() {
		_classCallCheck(this, ContainersShow);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ContainersShow).apply(this, arguments));
	}

	_createClass(ContainersShow, [{
		key: "render",
		value: function render() {
			console.log("containers/show");
		}
	}]);

	return ContainersShow;
}(App);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PagesShow = function (_App) {
  _inherits(PagesShow, _App);

  function PagesShow() {
    _classCallCheck(this, PagesShow);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PagesShow).apply(this, arguments));
  }

  _createClass(PagesShow, [{
    key: 'render',
    value: function render() {
      console.log("pages/show");

      $(document).on('page:receive', function () {
        tinymce.remove(); //fixes turbolinks issue
      });

      $('#editor-container').css({
        "height": "100%"
      });

      $('#editor1').css({
        "width": "100%",
        "height": "100%",
        "min-height": "100%"
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
        setup: function setup(editor) {
          editor.on('init', function (args) {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, editor.getContent()], function () {
              editor.getContent();
            });
            MathJax.Hub.Queue(function () {
              editor.getContent();
            });
            editor.setContent(editor.getContent());

            var iframe = $("#" + args.target.id + "_ifr");
            var content = $(iframe[0].contentWindow.document.body);
            var iframeElm = $.parseHTML(content.html());

            var selected_text = "";
            content.mouseup(function () {
              selected_text = getIframeSelectionText(iframe[0]);
              var selected = $.parseHTML(getIframeSelectionText(iframe[0]));
            });
          });
        }
      });

      addPageBox();

      // sortable pages order using jquery.sortable.min.js
      function set_positions() {
        // loop through and give each task a data-pos
        // attribute that holds its position in the DOM
        $('.pages-panel.sortable').find('a').each(function (i) {
          $(this).attr("data-pos", i + 1);
        });
      }

      set_positions();
      $('.pages-panel.sortable').sortable();

      $('.pages-panel.sortable').sortable().bind('sortupdate', function (e, ui) {
        // array to store new order
        var updated_order = [];
        // set the updated positions
        set_positions();

        // populate the updated_order array with the new task positions
        $('.pages-panel.sortable').find('a').each(function (i) {
          updated_order.push({ id: $(this).data("id"), position: i + 1 });
        });

        // send the updated order via ajax
        $.ajax({
          type: "PUT",
          url: '/pages/sort',
          data: { order: updated_order }
        });
      });

      $('.increment-level').click(function (e) {
        e.preventDefault();
        $.ajax({
          type: "PUT",
          url: '/pages/levelize',
          data: { id: $(this).data('target'), do: "inc" }
        });
        return false;
      });
    }
  }]);

  return PagesShow;
}(App);

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
//# sourceMappingURL=all.js.map
