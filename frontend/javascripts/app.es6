class App {
  ready() {
    var componentName, viewName;
    componentName = $('#outlet').data('component');
    viewName = $('#outlet').data('view');
    try {
      var view = eval("new " + componentName + viewName + "()");
      view.render();
    }
    catch (err) {
      console.error("outer", err.message);
    }
  }
}

var app = new App;

$(document).ready(app.ready);
$(document).on('page:load', app.ready);
