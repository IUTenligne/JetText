var React = require('react');
var NotificationSystem = require('react-notification-system');
import { Router, Route, Link, hashHistory } from 'react-router';


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
    }
}

var Editor = React.createClass({
    
    getInitialState: function() {
        return {
          pageContent: '',
          editButton: true,
          saveButton: false,
          loading: true
        };
    },

    componentDidMount: function() {
        this.setState({ 
            pageContent: this.props.page.content,
            loading: false
        });
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

    generateContainer: function(event){
       var page = this.props.page;
       $.ajax({
            type: "GET",
            url: '/generate_container/'+page.container_id,
        });
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Container generate !',
            level: 'success'
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
                    
                    <h2 className="page-header">{page.name}</h2>
                    {this.state.loading ? <div><i className="fa fa-spinner fa-pulse teste"></i></div> : <div id="editor1" dangerouslySetInnerHTML={createMarkup(page.content)} /> }
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
                                <a onClick={this.generateContainer}>
                                    <i className="fa fa-upload"></i>
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
                                <i className="fa fa-share-alt"></i>
                            </div>
                        </li>
                        <ul>
                          <Sharebar />
                        </ul>
                    </ul>
                </div>

            <NotificationSystem ref="notificationSystem" style={style}/>

          </div>
        );
    }
});

function createMarkup(data) {
    return {__html: data};
};

module.exports = Editor;