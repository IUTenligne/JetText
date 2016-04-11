var React = require('react');
var NotificationSystem = require('react-notification-system');

var Sharebar = React.createClass({
  render: function() {
    return(
      <div>
          <li className="menuShare">
              <div className="line"></div>
          </li>
          <li className="menuShare">
              <div className="round"></div>
          </li>
          <li className="menuShare">
              <div className="line"></div>
          </li>
          <li className="menuShare">
              <div className="hexagon">
                  <i className="fa fa-facebook"></i>
              </div>
          </li>
          <li className="menuShare">
              <div className="hexagon">
                  <i className="fa fa-twitter"></i>
              </div>
          </li>
          <li className="menuShare">
              <div className="hexagon">
                  <i className="fa fa-envelope"></i>
              </div>
          </li>
      </div>
    )
  }
});

var style = {
    NotificationItem: { 
        DefaultStyle: { 
            margin: '50px 5px 2px 1px',
            background: " #eeeeee",
            color:"red"
        },
        success: { // Applied only to the success notification item
            color: 'red'
        },
    }
}

var Editor = React.createClass({
    
    getInitialState: function() {
        return {
          pageContent: '',
          editButton: true,
          saveButton: false
        };
    },

    componentDidMount: function() {
        this.setState({ pageContent: this.props.page.content });
        this._notificationSystem = this.refs.notificationSystem;
    },

    componentWillUnmount: function() {
        var editor = CKEDITOR.instances['editor1'];
        if (editor) { editor.destroy(true); }
    },

    postData: function(event) {
        var page = this.props.page;
        $.ajax({
          type: "PUT",
          url: '/pages/update_ajax',
          data: { id: page.id, name: page.name, content: this.state.pageContent }
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

    deletePage: function(event){
        // NotificationSystem popup
        var loc = this.props;
        event.preventDefault();
        console.log(loc);
        
        this._notificationSystem.addNotification({
            title: 'Hey, it\'s good to see you!',
            message: 'Now you can see how easy it is to use notifications in React!',
            level: 'success',
            position: 'tr',
            timeout: '9000',
            action: {
                label: 'Awesome!',
                callback: function() {
                    console.log(loc);
                    $.ajax({
                        type: "DELETE",
                        url: "/pages/"+loc.page.id,
                        context: this,
                        success: function(){
                            window.location.href= "/#/container/"+this.props.page.container_id
                        }
                    });
                }
            }
        });
    },

    _notificationSystem: null,
    render: function() {
    var page = this.props.page;
    return (
        <div className="col-lg-12">
            <div className="editor">
                <i className="fa fa-pencil"></i>
                { this.state.editButton ? <input type="button" onClick={this.unlock} value="" /> : null }
                <i className="fa fa-floppy-o"></i>
                { this.state.saveButton ? <input type="button" onClick={this.postData} value="Save" /> : null }
                
                <input type="button" onClick={this.deletePage} value="puf"/>


                <h2 className="page-header">{page.name}</h2>
                <div id="editor1" dangerouslySetInnerHTML={createMarkup(page.content)} />   
            </div>

            <div className="menuEditor">
                <ul>
                    <li>
                        <div className="hexagon" >
                            <a href='#' key={page.name}>
                                <i className="fa fa-home">
                                </i>
                             </a>
                        </div>
                    </li>

                    <li>
                        <div className="line"></div>
                    </li>
                    <li>
                        <div className="round"></div>
                    </li>
                    <li>
                        <div className="line"></div>
                    </li>

                    <li>
                        <div className="hexagon">
                            <i className="fa fa-pencil"></i>
                            { this.state.editButton ? <input type="button" onClick={this.unlock} value="" /> : null }
                            <i className="fa fa-floppy-o"></i>
                            { this.state.saveButton ? <input type="button" onClick={this.postData} value="Save" /> : null }
                        </div>
                    </li>
                    <li>
                        <div className="line"></div>
                    </li>
                    <li>
                        <div className="round"></div>
                    </li>
                    <li>
                        <div className="line"></div>
                    </li>

                    <li>
                        <div className="hexagon">
                            <i className="fa fa-upload"></i>
                        </div>
                    </li>

                     <li>
                        <div className="line"></div>
                    </li>
                    <li>
                        <div className="round"></div>
                    </li>
                    <li>
                        <div className="line"></div>
                    </li>

                    <li>
                        <div className="hexagon">
                            <i className="fa fa-share-alt"></i>
                        </div>
                    </li>
                    <ul>
                      <Sharebar />
                    </ul>
                </ul>
            </div>

        <NotificationSystem ref="notificationSystem" style={style} />

      </div>
    );
  }
});

function createMarkup(data) {
    return {__html: data};
};

module.exports = Editor;