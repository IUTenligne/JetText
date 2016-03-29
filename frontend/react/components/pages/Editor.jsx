var React = require('react');
var NotificationSystem = require('react-notification-system');

var Editor = React.createClass({

  getInitialState: function() {
    return {
      page: '',
      pageName: '',
      pageContent: '',
      editButton: true,
      saveButton: false
    };
  },
  
  componentDidMount: function() {
    this.serverRequest = $.get("/pages/"+this.props.children.id+".json", function (result) {
      this.setState({
        page: result.page,
        pageName: result.page.name,
        pageContent: result.page.content
      });
    }.bind(this));

    this._notificationSystem = this.refs.notificationSystem;
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
    var editor = CKEDITOR.instances['editor1'];
    if (editor) { editor.destroy(true); }
  },

  postData: function(event) {
    var page = this.state.page;
    $.ajax({
      type: "PUT",
      url: '/pages/update_ajax',
      data: { id: page.id, name: this.state.pageName, content: this.state.pageContent }
    });

    // NotificationSystem popup
    event.preventDefault();
    this._notificationSystem.addNotification({
      title: 'Container saved !',
      level: 'success'
    });
  },

  unlock: function() {
    var that = this;
    
    var editor = CKEDITOR.replace('editor1', {
      customConfig: '/assets/cke/custom_config.js'
    });
    editor.on('change', function( evt ) {
      // setState to allow changes to be saved on submit
      that.setState({ pageContent: evt.editor.getData() });
    });
    CKEDITOR.plugins.addExternal('uploader', '/assets/cke/plugins/uploader/', 'plugin.js');

    this.setState({ saveButton: true, editButton: false });
  },

  _notificationSystem: null,

  render: function() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <h2 className="page-header">{this.state.page.name}</h2>
        </div>
        <div className="col-lg-12">
          <div id="editor1" dangerouslySetInnerHTML={createMarkup(this.state.page.content)} />
          { this.state.editButton ? <input type="button" onClick={this.unlock} value="Edit" /> : null }
          { this.state.saveButton ? <input type="button" onClick={this.postData} value="Save" /> : null }
          <NotificationSystem ref="notificationSystem" />
        </div>
      </div>
    );
  }

});

function createMarkup(data) {
  return {__html: data};
};

module.exports = Editor;